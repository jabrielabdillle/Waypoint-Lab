# Project memory

Updated: 2026-11-15

## Durable requirements

- User first requested autonomous-agent project context and a GitHub repository for a Kafka/Flink/Feast recommendation pipeline.
- User then selected robotics simulation curriculum and explicitly requested reinforcement learning plus updates to all context files.
- Current project: Adaptive Robotics Training Platform.
- Repository: https://github.com/jabrielabdillle/realtime-recommendation-pipeline (private; slug retained).
- Required RL: PPO robot navigation policy. Initial curriculum selector: performance-based rules, with random and fixed baselines. Learned teacher is optional.

## Current state

- Context migration: complete; initial consumer recommendation specification is superseded.
- Implementation, trained models and runtime validation: not started.
- Active implementation task/owner/branch: none.
- Next: M0 environment learnability, dependency compatibility, and Feast ordering spikes.
- Runtime versions and actual hardware capacity: unknown until M0.
- Performance and learning targets are proposals, not measured outcomes.
- Defaults: local CPU-capable 2D grid simulation, synthetic telemetry, Python training/serving and Java Flink. No real robot.

## Risks to resolve

- PPO must learn the simple task before infrastructure expansion.
- Training runs, evaluation splits, policy versions and resumed checkpoints must remain distinguishable.
- Adaptive distribution changes can destabilize learning; comparisons require equal environment-step budgets.
- Feast provider ordering/revision behavior needs executable proof.
- Transaction visibility and checkpoint cadence may exceed freshness target.
- Wall-clock rolling features depend on simulator speed; count windows drive curriculum and time windows support monitoring.

## Next agent handoff

Read AGENTS.md and execute M0 in docs/BACKLOG.md. Check Docker, Python, Java, build tools and Git. Choose and pin a compatible runtime matrix; do not invent installed tools or test results.

## Session log

| Date | Outcome | Evidence | Next |
|---|---|---|---|
| 2026-11-15 | Initial generic pipeline context published | Bootstrap docs only | Superseded domain |
| 2026-11-15 | All context revised for robotics and required PPO; environment and experiment specs added | Markdown/link/scope validation; no runtime tests | M0 |

## Maintenance

Replace stale current-state entries; append concise outcomes. Design rationale belongs in DECISIONS.md. Keep secrets and large logs out of memory.
