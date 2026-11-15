# Agent instructions

## Mission and authority

Implement the real-time recommendation pipeline described in README.md. Treat the documents as a specification, not evidence of implemented behavior. Work autonomously on reversible local implementation and tests. Do not infer permission for paid infrastructure, real personal data, production deployments, credential changes, or destructive operations.

## Read order

1. README.md and MEMORY.md.
2. docs/PRODUCT.md, docs/ARCHITECTURE.md, docs/CONTRACTS.md.
3. docs/BACKLOG.md and docs/DECISIONS.md.
4. The validation, model, and operations documents relevant to the task.

Use actual source code and test results to establish implementation status. If documents disagree, record and resolve the discrepancy; do not silently redefine acceptance criteria.

## Work loop

- Select the first unblocked backlog item. Record owner, branch, scope, and status in MEMORY.md.
- Inspect existing code before editing. Never overwrite another agent's changes.
- Implement a small vertical slice with meaningful tests.
- Run the applicable checks. Record exact commands, outcomes, environment, and artifact paths.
- Update affected contracts, decisions, backlog status, and memory in the same change.
- Finish with a handoff naming the next task and remaining risks. Never mark unrun checks as passing.

## Engineering rules

- Keep business logic separate from transport and infrastructure.
- Pin dependency versions and container digests after compatibility verification; commit lockfiles.
- Validate untrusted input. Never log secrets or raw user identifiers.
- Use UTC timestamps, explicit units, seeded fixtures, bounded state, and bounded retries.
- Do not claim end-to-end exactly-once behavior for the Feast adapter.
- Preserve monotonic feature versions, prevent training leakage, and test missing/stale feature fallback.
- Keep online/offline feature definitions aligned; schema changes require migration and compatibility tests.
- CI must not need personal credentials. Commit only placeholders in environment examples.
- Do not introduce Kubernetes, vector databases, or a distributed model-serving platform without a demonstrated requirement and decision record.

## Multi-agent coordination

Parallel agents may own independent ready tasks when the execution environment and user authorize delegation. Follow docs/AGENT_WORKFLOW.md. A coordinator owns shared contracts and integrates changes. Do not run concurrent writers against the same files or deployment.

## Completion

An item is done only when its acceptance criteria pass, evidence is recorded, docs reflect reality, and no placeholders remain in the delivered scope. A blocked item must identify the exact blocker and the smallest next action; work on independent ready tasks when possible.
