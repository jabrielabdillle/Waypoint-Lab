# Adaptive Robotics Training Platform

A real-time curriculum recommendation system for a reinforcement-learning robot in simulated warehouse navigation. Episode results flow through Kafka and Flink into Feast; a low-latency service recommends the robot's next practice scenario.

**Status: specifications only; implementation has not started.** No trained policy, runnable services, benchmarks, or learning improvements are claimed.

## Two learning loops

- **Robot policy (required RL):** PPO learns navigation actions from observations and rewards in a Gymnasium-compatible simulator.
- **Curriculum selector:** reads recent performance and chooses practice scenarios between episodes. The MVP uses explicit rules; a learned selector is a later experiment, not a requirement for the robot to use RL.

The robot's action policy runs locally in the simulator. Kafka and the curriculum API are not in its per-action control loop.

## Start here

Read [AGENTS.md](AGENTS.md), [MEMORY.md](MEMORY.md), and [the backlog](docs/BACKLOG.md). Begin with M0 compatibility and learnability spikes.

| Context | Purpose |
|---|---|
| [Product](docs/PRODUCT.md) | Demo, scope, success targets |
| [Architecture](docs/ARCHITECTURE.md) | Training and streaming feedback loops |
| [Contracts](docs/CONTRACTS.md) | Episodes, features, decisions, API |
| [RL environment](docs/RL_ENVIRONMENT.md) | Observations, actions, rewards, scenarios |
| [Model and curriculum](docs/MODEL.md) | PPO lifecycle, selection rules, optional extensions |
| [Experiment protocol](docs/EXPERIMENTS.md) | Fair comparisons and scientific evidence |
| [Backlog](docs/BACKLOG.md) | Ordered work and completion gates |
| [Validation](docs/VALIDATION.md) | Correctness, recovery, learning, performance |
| [Operations](docs/OPERATIONS.md) | Planned commands and recovery |
| [Agent workflow](docs/AGENT_WORKFLOW.md) | Ownership and handoff |
| [Decisions](docs/DECISIONS.md) | Rationale and unresolved choices |
| [Sources](docs/SOURCES.md) | Official technical references |
| [Build prompt](prompts/BUILD.md) | Implementation kickoff |

## Target stack and limits

Python, Gymnasium, PyTorch, Stable-Baselines3 PPO; Java Flink; Kafka; Feast with Redis; Parquet history; FastAPI; Docker Compose; Prometheus/Grafana. Pin compatible versions in M0.

The default simulator is a small custom fully observed 2D grid warehouse, not a physical dynamics simulator. MiniGrid is a reference/alternative requiring an explicit decision. Everything is local and simulated. Real robots, cloud spending, production HA, and sim-to-real claims are out of scope.

The existing repository slug, realtime-recommendation-pipeline, is retained. The project has no license grant yet.
