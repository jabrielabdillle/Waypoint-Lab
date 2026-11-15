# Product requirements

## Working backwards from the demo

A developer starts the stack, seeds a catalog, requests recommendations for a new user, streams activity for that user, and observes changed scores driven by fresh features. The same demo proves that duplicate input does not inflate aggregates and that serving remains useful when the feature store is unavailable.

## MVP scope

- Synthetic catalog of 1,000 items across 20 categories and 10,000 synthetic users.
- Click, play, and purchase events with deterministic generation.
- Kafka ingestion, stateful Flink aggregation, versioned feature updates, Feast online retrieval.
- Deterministic popularity fallback and a trained baseline ranker.
- Historical feature snapshots, leakage-safe training, evaluation, API, metrics, and recovery tests.
- One-command workflow after prerequisites are installed.

## Proposed acceptance targets

These are design targets to validate, not guarantees or measured results.

| Signal | Target | Measurement |
|---|---|---|
| Recommendation latency | p95 <= 100 ms, p99 <= 200 ms | 100 requests/s, concurrency cap 32, 10-minute steady run after 2-minute warmup |
| Event acceptance to visible feature | p95 <= 5 seconds | Ingestion receipt to successful online read, including checkpoint visibility |
| Ingestion | 1,000 events/s for 10 minutes | Fixed seeded workload, report loss, lag, CPU and memory |
| API success | >= 99.9% | Valid requests, include successful fallback responses, report fallback separately |
| Restart recovery | <= 60 seconds | Inject one Flink worker failure; compare recovered values against oracle |
| Correctness | Exact integer aggregates on deterministic fixture | Duplicates, out-of-order events, expiry, replay, and boundary cases |
| Recommendation quality | Beat popularity on held-out NDCG@10 | Report bootstrap interval; synthetic result demonstrates mechanics only |

Run ingestion and serving load concurrently on a documented reference machine with at least 8 logical CPUs and 16 GiB available memory. If hardware is insufficient, report results as capacity-limited and propose revised targets; never quietly relax criteria.

## Non-goals

Production HA, billing, real personal data, online experiments, automatic retraining/promotion, cloud deployment, large-scale candidate search, and causal business-lift claims. A launch beyond the local MVP requires a separate readiness review.
