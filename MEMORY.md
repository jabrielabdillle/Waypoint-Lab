# Project memory

Updated: 2026-11-15

## Durable facts

- User requested project context for autonomous agents plus a GitHub repository.
- Core requirements: Kafka events, Flink real-time features, Feast-like feature storage, low-latency model recommendations.
- Initial delivery contains specifications only. No services, tests, benchmarks, or deployment exist yet.
- Working assumptions: private repository, synthetic data, local Docker Compose MVP, Python serving/training and Java Flink.
- These assumptions are defaults, not additional user requirements.

## Current state

- Context bootstrap: complete.
- Implementation: not started.
- Active task / owner / branch: none.
- Next task: M0 compatibility and Feast adapter reliability spike.
- Runtime versions: unselected; M0 must record and pin them.
- Performance numbers in PRODUCT.md are targets, not results.

## Known risks

- Feast online provider ordering and timestamp behavior require executable verification.
- Transaction visibility and checkpoint duration affect freshness.
- Local hardware capacity is unknown.
- Event-time aggregates need expiry updates even when a user stops sending events.
- Offline history must retain availability timestamps to prevent training leakage.

## Next agent handoff

Read AGENTS.md and execute M0 from docs/BACKLOG.md. Start by checking available Docker, Python, Java, build tools, and Git. Do not mistake the bootstrap host's missing Git CLI for a project dependency decision.

## Session log

| Date | Work | Evidence | Next |
|---|---|---|---|
| 2026-11-15 | Authored planning and agent context | Markdown package; no runtime claims | M0 |

## Update discipline

Keep this file concise. Replace stale current-state entries; append concise session outcomes. Store design rationale in DECISIONS.md and large logs in ignored artifacts. Never store credentials or private personal data here.
