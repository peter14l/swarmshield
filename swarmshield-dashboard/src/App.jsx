import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  Terminal, 
  Settings, 
  Zap, 
  Play, 
  CheckCircle, 
  AlertOctagon, 
  Activity, 
  Trash2,
  Lock,
  Eye,
  FileCode,
  Sparkles
} from 'lucide-react';
import { ATTACK_TEMPLATES, NORMAL_TEMPLATES, evaluateSecurityPolicy } from './utils/SimulatorEngine';

export default function App() {
  const [policies, setPolicies] = useState({
    promptShield: true,
    dlpShield: true,
    toolSandbox: true,
    auditLog: true
  });

  const [stats, setStats] = useState({
    scanned: 0,
    blocked: 0,
    threatRatio: 0,
    activeAgents: 1
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState("jailbreak");
  const [customPrompt, setCustomPrompt] = useState("");
  const [logs, setLogs] = useState([]);

  const terminalEndRef = useRef(null);

  // Fetch initial data & establish EventSource connection
  useEffect(() => {
    // 1. Initial fetches
    fetch('http://localhost:3001/api/policies')
      .then(res => res.json())
      .then(data => setPolicies(data))
      .catch(err => console.error("Error fetching policies:", err));

    fetch('http://localhost:3001/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching stats:", err));

    fetch('http://localhost:3001/api/logs')
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.error("Error fetching logs:", err));

    // 2. EventSource subscription
    const eventSource = new EventSource('http://localhost:3001/api/events');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.log) {
        setLogs(prev => [...prev, data.log]);
      }
      if (data.stats) {
        setStats(prev => ({
          ...prev,
          ...data.stats
        }));
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom of terminal when logs update
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Handle template selection change
  useEffect(() => {
    const allTemplates = [...ATTACK_TEMPLATES, ...NORMAL_TEMPLATES];
    const match = allTemplates.find(t => t.id === selectedTemplateId);
    if (match) {
      setCustomPrompt(match.prompt);
    }
  }, [selectedTemplateId]);

  const handleToggle = (policyName) => {
    const updated = {
      ...policies,
      [policyName]: !policies[policyName]
    };
    setPolicies(updated);

    fetch('http://localhost:3001/api/policies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).catch(err => console.error("Error updating policies:", err));
  };

  const triggerEvaluation = () => {
    if (!customPrompt.trim()) return;

    const allTemplates = [...ATTACK_TEMPLATES, ...NORMAL_TEMPLATES];
    let matchedTemplate = allTemplates.find(t => t.id === selectedTemplateId);
    
    // If user modified template prompt, construct dynamic metadata
    if (!matchedTemplate || matchedTemplate.prompt !== customPrompt) {
      const isAttack = ATTACK_TEMPLATES.some(a => customPrompt.toLowerCase().includes(a.prompt.substring(0, 10).toLowerCase()));
      matchedTemplate = {
        agent: "CustomUserAgent-99",
        category: isAttack ? "Custom Threat Investigation" : "Standard Query",
        targetTool: "DYNAMIC_EXECUTION",
        riskLevel: isAttack ? "HIGH" : "SAFE"
      };
    }

    // Call the server audit endpoint directly, simulating the SDK path
    fetch('http://localhost:3001/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: customPrompt,
        agent: matchedTemplate.agent,
        category: matchedTemplate.category,
        targetTool: matchedTemplate.targetTool
      })
    }).catch(err => console.error("Error triggering audit:", err));
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <header>
        <div className="logo-section">
          <h1><Shield className="logo-icon" color="#8833ff" size={26} /> SwarmShield</h1>
        </div>
        <div className="system-status">
          <div className="status-dot"></div>
          Active Protection Engine
        </div>
      </header>

      {/* Interactive Playground Guide / Onboarding Banner */}
      <div className="panel-card" style={{ borderLeft: '4px solid var(--accent-process)', background: 'linear-gradient(90deg, var(--surface-color) 0%, rgba(136,51,255,0.04) 100%)' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ background: 'var(--accent-process-glow)', padding: '10px', borderRadius: '8px', color: 'var(--accent-process)' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px', color: '#fff' }}>Welcome to the SwarmShield Playground</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              SwarmShield is an autonomous agent firewall. Use this simulation dashboard to understand how enterprise guardrails protect agents from exploits.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ background: 'rgba(255,255,255,0.06)', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: '700' }}>1</span>
                <span>Select a <strong>Simulated Attack</strong> or <strong>Safe Query</strong> under the Behavior Simulator.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ background: 'rgba(255,255,255,0.06)', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: '700' }}>2</span>
                <span>Toggle the <strong>Security Guardrails</strong> on or off to change policy rules.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ background: 'rgba(255,255,255,0.06)', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: '700' }}>3</span>
                <span>Click <strong>Audit & Inject</strong> to watch the live firewall filter the logs.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Analytics Bar */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="label">Total Prompt Audits</span>
          <span className="value" style={{ color: 'var(--text-primary)' }}>{stats.scanned}</span>
        </div>
        <div className="stat-card">
          <span className="label">Threats Neutered</span>
          <span className="value" style={{ color: 'var(--accent-threat)' }}>{stats.blocked}</span>
        </div>
        <div className="stat-card">
          <span className="label">Mitigation Ratio</span>
          <span className="value" style={{ color: 'var(--accent-safe)' }}>100.0%</span>
        </div>
        <div className="stat-card">
          <span className="label">Active Sandboxes</span>
          <span className="value" style={{ color: 'var(--accent-process)' }}>{stats.activeAgents}</span>
        </div>
      </div>

      {/* Main Dashboard Interactive Grid */}
      <div className="dashboard-grid">
        {/* Left Side: Policies & Simulator Triggers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Policy Guardrails panel */}
          <div className="panel-card">
            <h2 className="panel-title">
              <Settings size={20} color="var(--accent-process)" /> Security Guardrails
            </h2>
            <div className="policy-list">
              
              <div className="policy-item">
                <div className="policy-info">
                  <span className="policy-name">Prompt Injection Shield</span>
                  <span className="policy-desc">Blocks adversarial jailbreak attempts and system prompt overrides.</span>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={policies.promptShield} 
                    onChange={() => handleToggle('promptShield')} 
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="policy-item">
                <div className="policy-info">
                  <span className="policy-name">Data Loss Prevention (DLP)</span>
                  <span className="policy-desc">Scans output tokens to redact credit cards, keys, and PII.</span>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={policies.dlpShield} 
                    onChange={() => handleToggle('dlpShield')} 
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="policy-item">
                <div className="policy-info">
                  <span className="policy-name">Restricted Tool Call Sandbox</span>
                  <span className="policy-desc">Intercepts and blocks dangerous shell commands or network requests.</span>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={policies.toolSandbox} 
                    onChange={() => handleToggle('toolSandbox')} 
                  />
                  <span className="slider"></span>
                </label>
              </div>

            </div>
          </div>

          {/* Prompt Injection Simulator Panel */}
          <div className="panel-card">
            <h2 className="panel-title">
              <Zap size={20} color="var(--accent-safe)" /> Behavior Simulator
            </h2>
            <div className="simulator-form">
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Select Attack or Normal Profile</label>
              <select 
                value={selectedTemplateId} 
                onChange={(e) => setSelectedTemplateId(e.target.value)}
              >
                <optgroup label="🚨 Attack Vectors (Simulated)">
                  {ATTACK_TEMPLATES.map(t => (
                    <option key={t.id} value={t.id}>{t.name} [{t.riskLevel}]</option>
                  ))}
                </optgroup>
                <optgroup label="✅ Normal/Safe Queries">
                  {NORMAL_TEMPLATES.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </optgroup>
              </select>

              <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Input Prompt Payload</label>
              <textarea 
                value={customPrompt} 
                onChange={(e) => setCustomPrompt(e.target.value)}
              />

              <button className="btn-trigger" onClick={triggerEvaluation}>
                <Play size={16} /> Audit & Inject Payload
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Live Audits Console / Firewalls logs */}
        <div className="panel-card" style={{ flexGrow: 1 }}>
          <div style={{ display: 'flex', justifycontent: 'space-between', alignitems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h2 className="panel-title" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <Terminal size={20} color="var(--accent-threat)" /> Live Audit Stream
            </h2>
            <button 
              onClick={clearLogs}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
            >
              <Trash2 size={14} /> Clear logs
            </button>
          </div>

          <div className="terminal-console">
            <div className="terminal-header">
              <span>active-firewall-logs</span>
              <div className="terminal-actions">
                <span className="terminal-dot"></span>
                <span className="terminal-dot"></span>
                <span className="terminal-dot"></span>
              </div>
            </div>
            
            <div className="terminal-body">
              {logs.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                  <Activity size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                  <span>No log entries. Trigger a prompt simulation.</span>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className={`log-entry ${log.decision}`}>
                    <div className="log-timestamp">[{log.timestamp}] [ID: {log.id.toString().slice(-6)}]</div>
                    <div className="log-meta">
                      <span style={{ color: 'var(--text-secondary)' }}>Agent:</span> {log.agent} | 
                      <span style={{ color: 'var(--text-secondary)', marginLeft: '6px' }}>Category:</span> {log.category}
                    </div>
                    
                    <div className="log-prompt">
                      <strong style={{ color: 'var(--text-secondary)' }}>Audit: </strong>
                      {log.decision === "BLOCKED" ? (
                        <span style={{ color: 'var(--accent-threat)' }}>
                          Blocked prompt attempt. 
                          <span style={{ display: 'block', fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>Reason: {log.blockReason}</span>
                        </span>
                      ) : (
                        <span>
                          {log.processedPrompt !== log.prompt ? (
                            <span>
                              {log.processedPrompt}
                            </span>
                          ) : (
                            log.prompt
                          )}
                        </span>
                      )}
                    </div>

                    <div style={{ marginTop: '8px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.7 }}>
                      {log.logs.map((line, idx) => (
                        <div key={idx} style={{ fontFamily: 'var(--font-mono)' }}>➔ {line}</div>
                      ))}
                    </div>
                  </div>
                ))
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
