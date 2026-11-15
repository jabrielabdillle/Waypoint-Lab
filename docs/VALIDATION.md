# Validation strategy

## Required evidence

Record commit, exact command, runtime versions, dataset seed, workload size, machine resources, start/end UTC, pass/fail, and artifact path. CI checks are required once executable code exists. Planning documents themselves are not test evidence.

## Test layers

- Unit: aggregate math, time boundaries, dedup TTL, affinity normalization, candidate filtering, feature ordering, fallback selection.
- Contract: JSON schemas, API responses, feature names/types, backward-compatible optional fields, unknown version rejection.
- Integration: Kafka -> Flink -> Kafka -> Feast -> Redis -> API; Kafka -> history -> training.
- Temporal correctness: late corrections, idle expiry, future timestamps, equal-time revisions, training cutoff and availability joins.
- Fault injection: kill/restart Flink, adapter crash around offset commit, rebalance, Redis outage, Kafka outage, malformed event, corrupted model, checkpoint restore.
- Performance: concurrent ingestion and recommendation workload from PRODUCT.md. Record distributions, error counts, fallback rates, queue growth, state size, and resource saturation.

## Deterministic acceptance scenarios

1. Seed catalog and unknown user; API returns stable eligible popularity recommendations.
2. Emit category-focused events; online values match oracle and ranker scores change. Assert scores/features, not a brittle requirement that one item always becomes first.
3. Re-send identical events; counts do not increase.
4. Submit permitted out-of-order input; correction appears without rollback by an older snapshot.
5. Advance time without user input; rolling values expire.
6. Submit beyond-lateness input; late topic receives it and current values remain unchanged.
7. Crash and restore within retained input; output equals uninterrupted oracle.
8. Crash adapter after write before commit; retry preserves values and history availability.
9. Disable Redis; API returns bounded-latency fallback and emits degradation metrics.
10. Supply an incompatible model; retain last good artifact or safe fallback.
11. Inject future-only feature rows; training join excludes them.
12. Fresh-environment demo completes using documented commands only.

## Release gate

M0..M8 criteria must pass for an MVP-complete claim. Publish unresolved limitations and failed targets alongside successful results. Keep raw large outputs ignored; commit small redacted reports and reproducible scripts. Production readiness is separate from MVP completeness.
