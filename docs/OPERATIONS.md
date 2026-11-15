# Operations plan

No commands below are implemented yet. M2/M8 must create and verify this interface before README claims a runnable quickstart.

## Planned command surface

| Command | Intended behavior |
|---|---|
| make doctor | Verify Docker, memory, tool versions, ports |
| make setup | Install pinned local dependencies |
| make up | Start infrastructure and wait for health |
| make seed | Seed deterministic catalog and fixture data |
| make demo | Run event-to-recommendation scenario with assertions |
| make test | Unit and contract checks |
| make integration | Container-based cross-service tests |
| make train | Train/evaluate versioned model artifacts |
| make load | Run fixed concurrent ingestion/API benchmark |
| make down | Stop services while preserving volumes |
| make reset | Explicitly destructive local test-data reset; never implicit |

Document actual ports, resource requirements, architecture support, and first-run download requirements after M0. Supply .env.example containing placeholders only; bind services to loopback and use synthetic identifiers.

## Metrics

Track Kafka consumer lag, DLQ/late counts, Flink checkpoint duration/failures, watermark lag, state size, adapter retries/rejected stale versions, online feature age, history lag, API latency/errors/fallback reason, and model version. Avoid unbounded labels such as user_id, item_id, event_id, or request_id.

## Recovery procedures to implement and rehearse

- Growing lag: identify saturated consumer or blocked store; inspect checkpoint/backpressure metrics; restore dependency before scaling. Do not reset offsets to latest.
- Redis unavailable: serve popularity; pause/retry adapter; resume from committed offsets. Verify snapshots advance monotonically.
- Flink failure: restore latest valid checkpoint with matching operator IDs; verify transactional recovery and oracle results.
- Lost online store: rebuild a separate namespace from retained snapshots/history, verify freshness and completeness, then switch readers. Record retention gaps explicitly.
- Bad model: switch active pointer to last validated version; confirm health and fallback metrics.
- Poison record: preserve reason and delivery identity; fix contract/producer or explicitly quarantine; replay into an isolated validation namespace first.
- Offline/online skew: compare snapshot identities, availability, and offsets; resolve missing consumer writes before training.

## Retention defaults

Raw events 7 days; feature-update topic 7 days with delete retention (do not compact away required training history); offline synthetic history 30 days; dedup state 48 hours. Model artifacts retain active and previous good versions. These defaults are for local synthetic data only.

Do not expose local services publicly or use real user data until authentication, encryption, deletion propagation across state/history/models, retention, and operational ownership are designed.
