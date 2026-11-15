# Real-time recommendation pipeline

An agent-ready blueprint for streaming user clicks, plays, and purchases through Kafka and Flink, publishing fresh features through Feast, and serving low-latency model recommendations.

**Status: planning complete; implementation has not started.** No runnable services or measured performance are included yet.

## Start here

Read [AGENTS.md](AGENTS.md), [project memory](MEMORY.md), and the [ordered backlog](docs/BACKLOG.md). The first implementation task is M0: prove the version-compatible integration before building the full stack.

## Intended outcome

A reproducible local demo emits synthetic activity, updates user features, and changes recommendations. Duplicate events, late arrivals, restarts, stale features, and missing users have explicit behavior.

| Context | Purpose |
|---|---|
| [Product requirements](docs/PRODUCT.md) | Scope, assumptions, acceptance criteria |
| [Architecture](docs/ARCHITECTURE.md) | Components and reliability boundaries |
| [Contracts](docs/CONTRACTS.md) | Events, features, API, temporal rules |
| [Model plan](docs/MODEL.md) | Candidates, training, evaluation, fallback |
| [Backlog](docs/BACKLOG.md) | Dependencies and executable work packages |
| [Validation](docs/VALIDATION.md) | Correctness, load, recovery, release gates |
| [Operations](docs/OPERATIONS.md) | Local workflow and incident procedures |
| [Agent workflow](docs/AGENT_WORKFLOW.md) | Ownership, handoff, integration |
| [Decisions](docs/DECISIONS.md) | Accepted defaults and unresolved choices |
| [Sources](docs/SOURCES.md) | Official references and verification notes |
| [Agent kickoff](prompts/BUILD.md) | Copyable implementation prompt |

## Target stack

Kafka; Java Flink DataStream job; Python Feast adapter and FastAPI service; Redis online store; Parquet offline feature history; scikit-learn baseline ranker; Docker Compose; Prometheus/Grafana. Versions are deliberately unpinned until M0 validates compatibility.

All data is synthetic by default. Cloud deployment, real user data, and paid resources are outside the initial build. This repository currently has no license grant; choose a license before public distribution.
