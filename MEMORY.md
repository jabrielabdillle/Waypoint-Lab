# Project memory

Updated: 2026-11-15

## Durable requirements

- User first requested autonomous-agent project context and a GitHub repository for a Kafka/Flink/Feast recommendation pipeline.
- User then selected robotics simulation curriculum and explicitly requested reinforcement learning plus updates to all context files.
- Current project: Adaptive Robotics Training Platform.
- Repository: https://github.com/jabrielabdillle/realtime-recommendation-pipeline (public visibility authorized; slug retained).
- Required RL: PPO robot navigation policy. Initial curriculum selector: performance-based rules, with random and fixed baselines. Learned teacher is optional.

## Current state

- Context migration: complete; initial consumer recommendation specification is superseded.
- M0a implemented: Gymnasium environment, seven passing tests, PPO fixed-task feasibility at 16,384 steps. See reports/m0a-smoke.json.
- M0b Kafka/Feast verification remains pending; Docker/Java are not available on the bootstrap host.
- User authorized milestone commits, PRs and merges. User selected free GitHub Pages hosting and a free database with substantial mock data.
- Public demo will use browser SQLite; training and distributed streaming remain local. Mock data must be labeled.
- Active implementation task/owner/branch: none.
- W1 dashboard implemented and tested: 18,000 mock SQLite episodes, measured PPO replay, seven passing production-build Playwright checks.
- M0a merged via PR #1.
- Public visibility change is waiting for GitHub email identity verification; user has explicitly authorized it.
- Next: merge W1 PR, enable GitHub Actions Pages, verify live site, then resolve M0b runtime prerequisites.
- Tested Python 3.12, Gymnasium 1.2.3, Stable-Baselines3 2.7.1 and PyTorch 2.9.1 on macOS arm64; requirements.lock records installed dependencies.
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
