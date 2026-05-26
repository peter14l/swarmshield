# SwarmShield Monorepo

Welcome to **SwarmShield**, the zero-trust security control plane and behavioral firewall for autonomous AI agent swarms.

This repository is organized as a monorepo containing the following components:

## Repository Structure

* **[`/swarmshield-sdk`](./swarmshield-sdk)**: The open-source client library that developers drop into their AI agent scripts to intercept, clean, and validate prompts.
* **[`/swarmshield-dashboard`](./swarmshield-dashboard)**: The commercial enterprise control plane consisting of:
  * **Vite + React Dashboard**: An administrative UI to toggle security policies, monitor agent statistics, and view real-time log alerts.
  * **Express Proxy Gateway**: The security server running the policy rules engine.
* **[`demo.js`](./demo.js)**: A verification script demonstrating the SDK communicating with the gateway server.

## Getting Started

To launch the entire stack locally for testing:

1. **Start the Proxy Server**:
   ```bash
   cd swarmshield-dashboard
   npm install
   node server.js
   ```

2. **Start the React Control Dashboard**:
   ```bash
   cd swarmshield-dashboard
   npm run dev
   ```
   *UI will be live on `http://localhost:3000`*

3. **Run the Protected Agent Script**:
   ```bash
   cd ..
   node demo.js
   ```

## License
MIT
