# Implementation kickoff

Use this prompt with an autonomous coding agent in a checkout of this repository:

> Read AGENTS.md and MEMORY.md, then the required architecture and contract documents. Implement the first unblocked task in docs/BACKLOG.md, starting with M0 if no implementation exists. Validate assumptions against official versioned documentation and executable evidence. Make reversible local decisions autonomously; stay within the local synthetic-data scope. Keep work small, test it, and update memory, backlog, and decisions with exact outcomes. Do not claim tests ran when they did not. If multiple agents are authorized, assign disjoint ready work with explicit ownership and integrate through the coordinator. Continue to the next ready milestone while authorized; stop only for a concrete blocker or completed scope. End each session with a precise handoff and the next executable action.

## Review prompt

> Review the implementation against PRODUCT.md, CONTRACTS.md, and VALIDATION.md. Focus on replay, late data, idle expiry, monotonic feature writes, offline availability timestamps, training leakage, safe fallback, and reproducible latency evidence. Report actionable findings with file references. Distinguish unimplemented scope from regressions and verify fixes with meaningful tests.
