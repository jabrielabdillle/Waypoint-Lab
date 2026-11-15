# Product requirements

## End-state demo

A simulated robot learns warehouse navigation with PPO. After a block of episodes, its collision and success statistics reach Feast through Kafka/Flink. The curriculum service selects further practice, balancing weaknesses, exploration and skill retention. The next resets use those scenarios. A developer can inspect learning curves, decisions and feature versions.

The demo includes an actual trained policy and actual simulator episodes. Synthetic replay is reserved for infrastructure stress tests.

## Required MVP

- Fully observed 2D warehouse navigation with three scenario families and three difficulty levels.
- Gymnasium environment, local PPO trainer, checkpoints and evaluation harness.
- Episode-summary events, Kafka/Flink feature computation, Feast retrieval and Parquet history.
- Versioned rule-based adaptive curriculum, random curriculum and fixed curriculum.
- Bounded-latency selection API; fallback to a seeded eligible uniform distribution.
- Decision provenance, training-run isolation, learning curves, recovery tests and operational metrics.
- Reproducible local workflow without paid services.

## Proposed targets, not results

| Signal | Target | Evidence |
|---|---|---|
| Curriculum API latency | p95 <=100 ms, p99 <=200 ms | 100 requests/s, concurrency <=32, 2-minute warmup plus 10-minute run |
| Feature visibility | p95 <=5 seconds after ingestion | Includes Flink transaction visibility and adapter |
| Replay ingestion capacity | 1,000 episode summaries/s for 10 minutes | Synthetic stress fixture; not claimed simulator throughput |
| API success | >=99.9% of valid requests | Report fallback separately |
| Stream restart recovery | <=60 seconds | Worker failure and oracle comparison |
| Stream correctness | Exact counts and rates within 1e-6 | Duplicate, late, expiry, restart, run-isolation fixtures |
| Robot learns | Beats random actions on held-out navigation | Equal evaluation protocol and seed-level uncertainty |
| Curriculum research goal | >=20% fewer training steps to 80% validation success versus uniform curriculum | Fixed suite and budgets in EXPERIMENTS.md; unmet/censored runs reported |

Run pipeline load concurrently on a documented reference machine with at least 8 logical CPUs and 16 GiB available memory. Measure RL training separately so simulated throughput is not confused with Kafka capacity. CPU-first is a target; document actual training duration.

Functional MVP completion requires a learning robot, working feedback loop and scientifically valid comparison. A positive curriculum effect is a research goal, not something agents may fabricate or make a prerequisite for reporting a completed experiment.

## Out of scope

Physical robot control, high-fidelity dynamics, sim-to-real transfer, multi-agent robot coordination, learned curriculum teacher in MVP, cloud deployments and production HA. Large simulator/video payloads do not travel through Kafka.
