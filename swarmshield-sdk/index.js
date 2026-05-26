// SwarmShield Open-Source Client SDK

export class SwarmShieldClient {
  constructor(config = {}) {
    this.gatewayUrl = config.gatewayUrl || 'http://localhost:3001';
    this.agentName = config.agentName || 'DefaultAgent';
  }

  /**
   * Audits a prompt payload before passing it to the LLM or tool.
   * Throws an error if blocked, otherwise returns the clean/redacted prompt.
   */
  async audit(prompt, config = {}) {
    try {
      const response = await fetch(`${this.gatewayUrl}/api/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          agent: this.agentName,
          category: config.category || 'Agent Execution Stream',
          targetTool: config.targetTool || 'None'
        })
      });

      if (!response.ok) {
        throw new Error(`SwarmShield Gateway responded with status: ${response.status}`);
      }

      const result = await response.json();

      if (result.decision === 'BLOCKED') {
        throw new Error(`[SwarmShield Alert] Execution terminated. Threat Blocked: ${result.blockReason}`);
      }

      return result.processedPrompt;
    } catch (error) {
      // In production, we default to throwing for active shielding.
      throw error;
    }
  }
}
