# Contracts

This document is the initial contract. M1 converts it into executable schemas and fixtures without changing semantics silently.

## Event v1

Topic: user-events.v1. Kafka key: user_id. JSON UTF-8, maximum 16 KiB.

```json
{
  "schema_version": 1,
  "event_id": "79170b31-f2b2-4c12-88ac-2cb9ef7f37aa",
  "user_id": "u_00001",
  "item_id": "i_00042",
  "event_type": "play",
  "event_time": "2026-11-15T18:00:00.000Z",
  "ingested_at": "2026-11-15T18:00:00.100Z",
  "play_duration_ms": 12000
}
```

Required: schema_version, event_id (UUID), user_id, item_id, event_type, event_time, ingested_at. Identifiers are nonempty strings <= 128 characters. Types: click, play, purchase. play_duration_ms is a nonnegative integer required for plays and absent otherwise. Purchase amount_minor is a nonnegative integer with a three-letter currency code, required together for purchases and absent otherwise. MVP counts purchases; it does not sum different currencies.

The trusted ingestion boundary assigns ingested_at. Reject unsupported versions, invalid IDs, malformed timestamps, and event_time more than 60 seconds ahead of ingestion time. Category comes from the versioned catalog, not a client field. Unknown items go to DLQ. Reason codes and event_id are sufficient for ordinary logs; raw event payloads belong only in restricted local debug/DLQ storage.

## Event-time and deduplication

- UTC milliseconds throughout. Rolling windows are (as_of - duration, as_of].
- Deduplicate (user_id, event_id); duplicate IDs must preserve user and payload. Conflicts go to DLQ.
- Dedup retention: 48 hours, explicitly bounded. No promise for duplicate suppression beyond this horizon.
- Bounded out-of-order watermark target: 10 seconds; idle partition timeout: 30 seconds.
- Accept corrections up to 60 seconds behind the watermark. Older events go to user-events.late.v1 for offline repair and do not mutate current online values.
- Emit provisional snapshots at most once per second per active user, plus expiry updates. Timers remove expired contributions even without new user events.
- M1 must specify and test how wall-clock ticks advance rolling as_of for inactive keys without pretending watermarks advance during source silence. Use a monotonic per-key as_of and retain event_time filtering.
- Rebuilds use a separate feature namespace and consumer group. Never replay historical snapshots over the live namespace.

## Feature snapshot v1

Topic: user-features.v1. Key: user_id. Full values, never increment operations.

Required metadata: user_id, feature_schema_version, snapshot_id, as_of, emitted_at, feature_definition_version, catalog_version. snapshot_id is deterministic for a given feature version, key, as_of, and revision. Revisions increase on same-as_of corrections; the adapter compares (as_of, revision). Kafka partition/offset supplies delivery identity, not business time.

| Feature | Type | Definition |
|---|---|---|
| clicks_5m | int64 | Unique clicks in last 5 minutes |
| plays_1h | int64 | Unique plays in last hour |
| purchases_24h | int64 | Unique purchases in last 24 hours |
| play_duration_ms_1h | int64 | Sum of play durations in last hour |
| category_affinity_1h | fixed float vector length 20 | Per-category weighted count: click 1, play 2, purchase 5; divide by total, all zeros when total is zero |
| last_event_time | nullable UTC timestamp | Latest accepted activity timestamp |

Serving freshness uses snapshot as_of and adapter availability, not last_event_time: an inactive user's correctly expired features can still be current. Feature freshness threshold: 30 seconds. Features absent or older than that are missing/stale, not silently fresh zeros. Numerical zeros are valid values for an existing current row.

History records first available_at after the transactional snapshot becomes readable, persisted idempotently; retries must not rewrite it. This is the earliest declared availability boundary for training. If modeling actual serving visibility, also retain online_available_at acknowledgements and use that later timestamp.

## Recommendation API v1

GET /v1/recommendations?user_id=u_00001&k=10; k integer 1..50. Valid unknown user returns fallback. Invalid input returns 422. No eligible catalog items returns 200 with empty items. No safe fallback artifact returns 503.

```json
{
  "request_id": "req_001",
  "user_id": "u_00001",
  "items": [{"item_id": "i_00042", "score": 0.82}],
  "model_version": "baseline-v1",
  "feature_schema_version": 1,
  "feature_as_of": "2026-11-15T18:00:01.000Z",
  "fallback_reason": null
}
```

Fallback reasons: unknown_user, missing_features, stale_features, feature_store_timeout, model_unavailable. Fallback may use null feature_as_of and a popularity artifact model_version. Return unique eligible items, stable tie-break by item_id, and request_id in logs. Set explicit feature retrieval and scoring deadlines within the 100 ms p95 budget; never retry indefinitely on the request path.

GET /health/live checks the process. GET /health/ready verifies usable model OR safe fallback plus catalog; Redis degradation is reported separately and does not disable a working fallback. GET /metrics exposes aggregate metrics without user IDs as labels.
