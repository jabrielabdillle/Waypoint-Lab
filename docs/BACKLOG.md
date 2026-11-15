# Ordered implementation backlog

All items are TODO. Dependencies are gates. Record actual status in this table and active ownership in MEMORY.md. Each item should be one or several focused PRs, not one giant build.

| ID | Work package | Depends on | Status |
|---|---|---|---|
| M0 | Compatibility and adapter spike | none | TODO |
| M1 | Contracts and deterministic oracle | M0 | TODO |
| M2 | Local infrastructure and generator | M1 | TODO |
| M3 | Stateful streaming features | M2 | TODO |
| M4 | Feast bridge and offline history | M3 | TODO |
| M5 | Baseline training and artifacts | M4 | TODO |
| M6 | Recommendation API and fallback | M4, M5 | TODO |
| M7 | Recovery, load, and observability | M6 | TODO |
| M8 | Reproducible demo and release evidence | M7 | TODO |

## M0 — Resolve highest-risk integration

Inventory prerequisites. Select a supported Java/Flink/Kafka connector combination and Python/Feast/Redis combination using official docs. Create a minimal Compose spike, pin versions, and record the matrix in docs/DECISIONS.md. Push one registered Feast feature and retrieve it. Test same-snapshot retry, older-after-newer writes, equal timestamp revisions, consumer restart/rebalance, and provider behavior under unavailable Redis.

Exit: reproducible commands plus actual output; a documented implementation for monotonic writes; measured transaction visibility/freshness feasibility. If ordering cannot be guaranteed, resolve the design before M4.

## M1 — Make the contracts executable

Create JSON schemas, OpenAPI skeleton, valid/invalid fixtures, catalog schema, impression schema, and a pure batch oracle. Resolve event-time/idle expiry and snapshot revision details. Test exact window boundaries, duplicates, conflicting IDs, late input, expiry, and availability-aware training joins.

Exit: contract tests and oracle pass with deterministic fixtures; no ambiguous field types or timing semantics.

## M2 — Create the local platform

Implement Compose, health checks, topic creation, persistent volumes, generator, and pinned dependency manifests. Start with three user-event partitions. Expose local services on loopback. Add CI for schema/unit checks without secrets.

Exit: clean start produces schema-valid seeded events; readiness waits work; restart preserves test data; documented shutdown preserves volumes unless explicitly resetting.

## M3 — Stream features

Implement Java Flink job with stable operator IDs, checkpointing, transactional output, deduplication, late/DLQ routes, bounded state, and periodic expiry. Set checkpoint cadence from M0 evidence.

Exit: Flink snapshots match oracle on all edge fixtures; restore/replay does not double-count within retention; inactive users expire correctly; lag and checkpoint metrics exist.

## M4 — Publish and archive features

Implement ordered adapter, registered Feast feature service, Redis lookup, idempotent history writer, manifests and availability timestamps. Add source-offset reconciliation and retry tests.

Exit: push/read and training-history round trip pass; crash before/after push or offset commit is safe; stale write and rebalance tests pass; duplicate history records do not change first availability.

## M5 — Train and export baseline

Implement impression generator, temporal joins/splits, popularity baseline, learned ranker, immutable artifacts, and evaluation report per MODEL.md.

Exit: reproducible fit/evaluate/export; leakage tests pass; measured quality comparison and promotion decision recorded.

## M6 — Serve recommendations

Implement request validation, bounded vectorized scoring, feature retrieval, eligibility filtering, deadlines, readiness, model loading, and fallback. Log request/trace IDs with no personal data.

Exit: API contract tests pass; unknown/stale/missing/offline-store/model failures behave as specified; healthy path uses fresh features and trained artifact.

## M7 — Prove reliability and performance

Implement metrics/dashboards and VALIDATION.md scenarios. Run simultaneous load and controlled process failures. Persist machine configuration and raw benchmark summaries.

Exit: targets met or explicitly reported as unmet; no silent relaxation; no duplicate aggregation or stale rollback; recovery procedures rehearsed.

## M8 — Deliver the reproducible demo

Implement documented command surface from OPERATIONS.md, fresh-environment setup, end-to-end demo, architectural diagram, final limitations and evidence index.

Exit: a second clean run reproduces outcomes; all preceding gates pass; no claimed result lacks an artifact; MEMORY.md accurately describes completion and next production gaps.

## Parallelism after gates

After M1, infrastructure and pure streaming logic can be developed independently behind shared fixtures. After M3, the adapter and history writer can be separate tasks. During M5, API scaffolding may proceed against contract fixtures, but M6 completion waits for real artifacts. One coordinator integrates and edits shared contracts.
