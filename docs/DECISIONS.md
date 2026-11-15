# Decision log

## D001 — Local-first synthetic MVP

Status: accepted default, 2026-11-15.
Use Docker Compose and synthetic data to make the system reproducible without cloud access or personal information. Production infrastructure is deferred.

## D002 — Kafka and Flink remain core

Status: accepted from user requirement.
Use Kafka for durable events and Flink for stateful feature computation. Java DataStream is the default for explicit state/timers; Python is used for Feast, training, and serving. Pin a compatible release set in M0.

## D003 — Feast through a Python adapter

Status: proposed; verification required in M0.
Emit versioned complete snapshots to Kafka and push through Feast's supported interface. This isolates Java streaming from Python integration, but creates an at-least-once boundary requiring replay and ordering tests.

## D004 — Separate offline snapshot writer

Status: accepted design default.
Archive Kafka feature snapshots to Parquet with stable identities and availability timestamps. Do not assume every Feast offline provider supports streaming pushes. Use the resulting files for historical features.

## D005 — Small learned ranker with popularity fallback

Status: accepted default.
Score a bounded 1,000-item catalog; use logistic regression before introducing complex retrieval/model-serving infrastructure. Unknown/stale/unavailable features trigger explicit fallback.

## D006 — Performance numbers are proposed targets

Status: accepted default.
PRODUCT.md defines a reproducible benchmark profile. No performance claim is valid before actual measurement. Hardware and quality targets may be revised only in an explicit decision with rationale and evidence.

## Open decisions assigned to M0/M1

- Exact pinned runtime, connector, image, and dependency versions.
- Feast provider ordering semantics and revision representation.
- Timer/clock strategy for provisional windows and idle expiry.
- Checkpoint cadence that meets freshness under transactional Kafka.
- Supported local CPU architectures and resource requirements.

## New decision template

ID and title; date; status (proposed/accepted/superseded); context; options; decision; tradeoffs; verification; affected contracts; supersedes.
