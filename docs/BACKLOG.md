# Implementation backlog

M0a is complete; remaining tasks are pending. Dependencies are gates; update status here and active claims in MEMORY.md. Scope is simulation plus actual PPO training, not just generated telemetry.

| ID | Deliverable | Depends on | Status |
|---|---|---|---|
| M0a | Fixed-task RL learnability | none | DONE |
| M0b | Kafka/Feast integration feasibility | M0a | TODO |
| M0 | Combined feasibility gate | M0a, M0b | IN PROGRESS |
| M1 | Environment, scenario and telemetry contracts | M0 | TODO |
| M2 | Local platform and durable telemetry | M1 | TODO |
| M3 | Run-isolated streaming features | M2 | TODO |
| M4 | Feast adapter, history and decision ledger | M3 | TODO |
| M5 | PPO runner, checkpoints and baseline curricula | M1 | TODO |
| M6 | Adaptive curriculum API and closed loop | M4, M5 | TODO |
| M7 | Reliability, observability and load evidence | M6 | TODO |
| M8 | Full learning comparison and reproducible demo | M7 | TODO |

## M0 — Validate the risky assumptions

Inventory hardware/tools. Pin a supported Python/Gymnasium/PyTorch/Stable-Baselines3 set and Java/Flink/Kafka/Feast/Redis set using official docs. Build a minimal environment and show easiest-task PPO improvement versus random actions within 100k steps. Record results and diagnose failures before expansion.

Separately prove Feast push/read, identical retry, older writes, equal-as_of revisions, consumer ownership changes and Redis outages. Measure transaction visibility. Validate restart-safe local decision idempotency. Exit: reproducible evidence, version matrix and a viable ordering/learnability design.

## M1 — Freeze executable contracts

Implement Gymnasium environment checks, reward/termination tests, valid layout generation, nine-bucket registry and split-hash checks. Define difficulty bounds. Create episode/decision/feature JSON schemas and OpenAPI. Build a pure oracle for count windows, time windows, deduplication and corrections.

Exit: deterministic fixtures pass, no train/test overlap, no ambiguous temporal or decision semantics.

## M2 — Platform and event publication

Implement Compose health checks, persistent volumes, three episode-topic partitions, local outbox and publisher. Replay generator is explicitly labeled synthetic. Bind ports to loopback and add secret-free CI.

Exit: clean startup, schema-valid simulated episodes, retry after broker outage without silent loss, and safe stop/restart. Document capacity and dependencies.

## M3 — Streaming features

Implement bounded dedup, latest-100 episode statistics, rolling-five-minute counts, correction routing, silence/expiry handling, stable operator IDs, checkpoints and Kafka transactions.

Exit: oracle parity, duplicate and restore correctness, no cross-run or evaluation contamination, bounded state and metrics.

## M4 — Store and serve feature context

Register Feast composite entities and views. Implement ordered push consumer, idempotent Parquet history and availability records. Implement durable single-instance decision ledger and export.

Exit: push/read and historical round trips; crash/rebalance/stale-write tests; first-availability preservation; repeated request IDs stable after restart.

## M5 — Required PPO learning system

Implement trainer from MODEL.md, isolated RNGs, environment-step budget enforcement, uniform/fixed curricula, immutable checkpoint metadata and resumed-run lineage. Implement evaluation that cannot change training state.

Exit: genuine learned policy beats random actions on a held-out smoke suite with results labeled preliminary; checkpoint load and isolation tests pass. Full statistical evidence remains M8.

## M6 — Close the curriculum loop

Implement adaptive rules, retrieval deadlines, fallback distribution, idempotent API, decision provenance and block-frozen selection at resets. Wire actual PPO episodes through Kafka/Flink/Feast.

Exit: performance changes alter eligible selection probabilities; no mid-episode switches; all probabilities valid; outages trigger logged fallback; actual rollout/feature/decision chain is traceable.

## M7 — Reliability and capacity

Run VALIDATION.md fault scenarios and simultaneous pipeline load. Add dashboards for feature freshness, lag, fallback, collisions, success and training throughput without unbounded metric labels.

Exit: measured operational targets or explicit failures; restored values match oracle; no stale rollback; documented recovery rehearsed.

## M8 — Experiments and final demo

Run the frozen five-seed, three-curriculum experiment in EXPERIMENTS.md. Produce learning curves, uncertainty, censored-run reporting and final test results. Implement all documented commands and repeat clean-start demo.

Exit: functional gates pass, robot learning evidenced, curriculum comparison complete even if the benefit hypothesis fails, README and memory reflect actual results. Do not label a smoke run as the full experiment.

## Parallel work

After M1, M2 and M5 may proceed independently with separate owners if delegation is authorized. The coordinator owns shared schemas. M6 completion requires both the real feature path and actual PPO runner; mocks cannot satisfy its gate.

## W1 — Free hosted dashboard

Added from user request: static dashboard, browser SQLite with 18,000 labeled mock episodes, measured PPO replay, Playwright production-build checks and Pages workflow. Implementation/tests complete; deployment waits for GitHub identity verification and Pages configuration. Delivered separately from M0b and scientific pipeline milestones.
