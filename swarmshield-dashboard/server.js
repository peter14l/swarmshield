import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory states
let policies = {
  promptShield: true,
  dlpShield: true,
  toolSandbox: true,
  auditLog: true
};

let stats = {
  scanned: 0,
  blocked: 0,
  activeAgents: 1
};

let logs = [];
let clients = [];

function broadcastLog(newLog) {
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify(newLog)}\n\n`);
  });
}

app.get('/api/policies', (req, res) => {
  res.json(policies);
});

app.post('/api/policies', (req, res) => {
  policies = { ...policies, ...req.body };
  res.json({ success: true, policies });
});

app.get('/api/stats', (req, res) => {
  const threatRatio = stats.scanned > 0 ? parseFloat(((stats.blocked / stats.scanned) * 100).toFixed(1)) : 0;
  res.json({ ...stats, threatRatio });
});

app.get('/api/logs', (req, res) => {
  res.json(logs);
});

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = Date.now();
  clients.push({ id: clientId, res });

  req.on('close', () => {
    clients = clients.filter(client => client.id !== clientId);
  });
});

app.post('/api/audit', (req, res) => {
  const { prompt, agent, category, targetTool } = req.body;
  
  let isBlocked = false;
  let blockReason = "";
  let redactedPrompt = prompt;
  let auditLogs = ["Inbound gateway validation initiated."];

  if (policies.promptShield) {
    const injectionPatterns = [
      /system override/i,
      /ignore your previous/i,
      /ignore all previous/i,
      /you are now/i,
      /output the configuration/i,
      /db_password/i
    ];
    if (injectionPatterns.some(pattern => pattern.test(prompt))) {
      isBlocked = true;
      blockReason = "Unauthorized prompt directive override (System Jailbreak Match)";
      auditLogs.push("Detecting adversarial prompt pattern. Initiating instant termination.");
    }
  }

  if (policies.dlpShield && !isBlocked) {
    const cardPattern = /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g;
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

    if (cardPattern.test(prompt) || emailPattern.test(prompt)) {
      redactedPrompt = redactedPrompt
        .replace(cardPattern, "[REDACTED_CREDIT_CARD]")
        .replace(emailPattern, "[REDACTED_EMAIL]");
      auditLogs.push("PII Data detected. Intercepted and redacted sensitive credentials.");
    }
  }

  if (policies.toolSandbox && !isBlocked) {
    const dangerousPatterns = [
      /rm -rf/i,
      /echo exploited/i,
      /192\.168\./i,
      /admin\/settings/i
    ];
    if (dangerousPatterns.some(pattern => pattern.test(prompt))) {
      isBlocked = true;
      blockReason = `Restricted shell/network pattern inside tool call arguments (${targetTool || 'GENERIC_TOOL'})`;
      auditLogs.push("Dynamic execution sandbox flag triggered. Process stopped.");
    }
  }

  const decision = isBlocked ? "BLOCKED" : "PASSED";
  auditLogs.push(isBlocked ? "Firewall state: BLOCKED." : "Firewall state: PASSED.");

  const now = new Date();
  const timestampStr = now.toTimeString().split(' ')[0];
  const newLog = {
    id: Date.now(),
    timestamp: timestampStr,
    agent: agent || "Unknown-Agent",
    decision,
    prompt,
    processedPrompt: redactedPrompt,
    category: category || (isBlocked ? "Custom Threat" : "Standard Query"),
    blockReason,
    logs: auditLogs
  };

  logs.push(newLog);
  stats.scanned += 1;
  if (isBlocked) stats.blocked += 1;

  broadcastLog({
    log: newLog,
    stats: {
      scanned: stats.scanned,
      blocked: stats.blocked,
      threatRatio: parseFloat(((stats.blocked / stats.scanned) * 100).toFixed(1))
    }
  });

  res.json({
    decision,
    processedPrompt: redactedPrompt,
    blockReason
  });
});

app.listen(PORT, () => {
  console.log(`[SwarmShield Control Plane] Listening on port ${PORT}`);
});
