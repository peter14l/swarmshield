# Graph Report - swarmshield  (2026-05-26)

## Corpus Check
- 15 files · ~5,293 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 66 nodes · 69 edges · 8 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]

## God Nodes (most connected - your core abstractions)
1. `@swarmshield/sdk` - 5 edges
2. `SwarmShieldClient` - 4 edges
3. `ATTACK_TEMPLATES` - 4 edges
4. `NORMAL_TEMPLATES` - 4 edges
5. `evaluateSecurityPolicy()` - 4 edges
6. `SwarmShieldClient` - 4 edges
7. `SwarmShield Enterprise Dashboard` - 4 edges
8. `Getting Started` - 4 edges
9. `App()` - 2 edges
10. `Installation` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (8 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.15
Nodes (11): app, auditLogs, clientId, clients, dangerousPatterns, injectionPatterns, logs, newLog (+3 more)

### Community 1 - "Community 1"
Cohesion: 0.15
Nodes (11): app, auditLogs, clientId, clients, dangerousPatterns, injectionPatterns, logs, newLog (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.2
Nodes (3): shield, SwarmShieldClient, SwarmShieldClient

### Community 3 - "Community 3"
Cohesion: 0.4
Nodes (4): App(), ATTACK_TEMPLATES, evaluateSecurityPolicy(), NORMAL_TEMPLATES

### Community 4 - "Community 4"
Cohesion: 0.25
Nodes (7): code:bash (npm install), code:bash (npm run start), code:bash (npm run dev), Getting Started, Main Controls, Ports Configuration, SwarmShield Enterprise Dashboard

### Community 5 - "Community 5"
Cohesion: 0.25
Nodes (7): code:bash (npm install @swarmshield/sdk), code:javascript (import { SwarmShieldClient } from '@swarmshield/sdk';), Features, Installation, License, Quick Start, @swarmshield/sdk

## Knowledge Gaps
- **32 isolated node(s):** `shield`, `app`, `policies`, `stats`, `logs` (+27 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `shield`, `app`, `policies` to the rest of the system?**
  _32 weakly-connected nodes found - possible documentation gaps or missing edges._