# SwarmShield Enterprise Dashboard

> The centralized policy manager and compliance firewall portal for enterprise agent swarms.

This repository runs the SwarmShield control plane and policy coordinator. It hosts the administrative dashboard interface (React) and the firewall event proxy gateway (Express) on port `3001` to coordinate rules and log actions.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Launch the Stack**:
   * **Start Backend Policy Server**:
     ```bash
     npm run start
     ```
   * **Start React Control Dashboard**:
     ```bash
     npm run dev
     ```

## Ports Configuration
* **React Dashboard UI**: `http://localhost:3000`
* **Express Gateway Listener**: `http://localhost:3001` (Accepts SDK prompt-audit logs via `/api/audit`)

## Main Controls
* **Active Guardrails**: Enable/disable active prompts validation, SSRF checks, and PII filters.
* **Onboarding Playground**: Trigger mock payloads to inspect logs outputs instantly.
* **Incident Terminal Stream**: Server-Sent Events (SSE) logs connection showing active threat vectors and exceptions.
