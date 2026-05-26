# @swarmshield/sdk

> Developer-first security & orchestration SDK for autonomous enterprise AI agents.

SwarmShield SDK is a lightweight client library designed to intercept, audit, and clean prompt inputs/outputs before they reach your LLMs or run tool calls. It connects with your central SwarmShield control gateway to enforce active firewall rules.

## Installation

```bash
npm install @swarmshield/sdk
```

## Quick Start

Import the client and wrap your agent's execution loops or tool calls:

```javascript
import { SwarmShieldClient } from '@swarmshield/sdk';

// Initialize the shield client pointing to your gateway
const shield = new SwarmShieldClient({
  agentName: 'CustomerSupportAgent-04',
  gatewayUrl: 'http://localhost:3001' // Your policy manager portal
});

async function handleUserInput(userPrompt) {
  try {
    // 1. Audit prompt before running
    const cleanPrompt = await shield.audit(userPrompt, {
      category: 'User Input Intercept',
      targetTool: 'None'
    });

    // 2. Pass cleanPrompt (potentially redacted) to LLM
    const response = await callLLM(cleanPrompt);
    console.log("Agent response:", response);
  } catch (error) {
    // Blocks execution instantly if security policy is violated
    console.error("🔴 Shield Alert:", error.message);
  }
}
```

## Features
* **Prompt Injection Defense**: Throws fatal errors for system prompt overrides.
* **PII/DLP Redaction**: Redacts credit cards and email details inline on approved flows.
* **Tool sandboxing**: Controls execution params before running backend terminal actions.

## License
MIT
