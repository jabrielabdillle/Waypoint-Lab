# Data and API contracts

M1 turns this specification into executable schemas and fixtures. All timestamps are UTC wall-clock milliseconds; simulator steps are separate integers. JSON messages <=16 KiB. IDs are nonempty strings <=128 characters, versions explicit, numeric metrics finite.

## Episode summary

Topic robot-episodes.v1; key is a canonical encoding of (run_id, learner_id). One immutable record per completed training or evaluation episode.

```json
{
  "schema_version": 1,
  "event_id": "79170b31-f2b2-4c12-88ac-2cb9ef7f37aa",
  "run_id": "run_001",
  "learner_id": "robot_001",
  "episode_id": "ep_001",
  "episode_index": 1,
  "split": "train",
  "scenario_id": "corridor_2_train_001",
  "bucket_id": "narrow_corridor:2",
  "registry_version": "warehouse-v1",
  "environment_version": "grid-v1",
  "policy_version": "ppo_run001_update000",
  "policy_versions": ["ppo_run001_update000"],
  "curriculum_version": "adaptive-rules-v1",
  "decision_id": "decision_001",
  "rollout_block_id": "block_001",
  "seed": 42,
  "started_at": "2026-11-15T18:00:00.000Z",
  "ended_at": "2026-11-15T18:00:01.000Z",
  "ingested_at": "2026-11-15T18:00:01.100Z",
  "episode_steps": 40,
  "total_env_steps": 40,
  "episode_return": 0.6,
  "collision_count": 0,
  "success": true,
  "terminated": true,
  "truncated": false
}
```

All fields above are required. policy_version is the version at episode start; policy_versions lists distinct versions used in encounter order if PPO updates occur across rollout boundaries during the episode. event_id is UUID; episode_index strictly increases for a learner within a run; episode_steps in 1..200; collision_count in 0..episode_steps; success/termination/timeout obey RL_ENVIRONMENT.md. ingested_at is assigned by the trusted publisher. Validate registry membership, split, versions, ended_at >= started_at and event time no more than 60 s ahead of ingestion. Unknown/malformed data goes to robot-episodes.dlq.v1 with reason codes. Evaluation records are archived but cannot update curriculum features.

## Deduplication and temporal behavior

Deduplicate (run_id, learner_id, episode_id) for 48 hours; retry uses the same event_id and payload. Conflicting payloads are quarantined. Do not promise suppression beyond retention. Watermark: ended_at minus 10 s; idle partition timeout 30 s; allow corrections up to 60 s behind watermark, otherwise route robot-episodes.late.v1 for offline analysis only.

Rolling event-time interval is (as_of-duration, as_of]. Emit full provisional snapshots at most once/second per key and on necessary expiry. M1 must implement monotonic as_of ticks during source silence, not assume watermarks advance without events. Rebuild/replay goes into a separate namespace.

## Feature snapshot

Topic learner-features.v1. Feast composite entity: run_id, learner_id, bucket_id. Metadata: feature_schema_version, feature_definition_version, registry_version, snapshot_id, as_of, revision, emitted_at, max_episode_index. Ordering is (as_of, revision), with revision increasing for same-as_of corrections. Identity is deterministic for entity/version/as_of/revision.

Only training episodes in that run/bucket contribute. Sort by episode_index, not delivery time. Count windows are based on the latest accepted episodes and include multiple recent policy updates intentionally; retain policy-version provenance.

| Feature | Definition |
|---|---|
| episodes_seen | Unique accepted training episodes in retained run state |
| n_recent | Count of latest up to 100 episodes |
| success_rate_100 | Successes / n_recent; null when empty |
| collision_rate_100 | Sum collisions / sum steps of those episodes; null when empty |
| mean_return_100 | Mean episode_return over those episodes; null when empty |
| mean_steps_100 | Mean steps over those episodes; null when empty |
| learning_progress_100 | Success rate of latest 50 minus preceding 50; null until 100 observations |
| episodes_5m | Unique completions in rolling five wall-clock minutes |
| last_episode_at | Latest accepted ended_at; nullable |

Keep latest 100 contributions per bucket plus bounded five-minute state and dedup state. Run state expires after 48 h inactivity; snapshot metadata declares history reset and consumers treat it as cold start. Snapshot heartbeat is distinct from last_episode_at. A fresh heartbeat does not make old performance evidence current.

Freshness checks: snapshot as_of <=30 s old and last_episode_at <=10 min old. Missing or stale evidence invokes fallback; n_recent <20 is under-sampled and eligible for exploration. Retain first history_available_at and online_available_at acknowledgements without rewriting them on retry. Log exact retrieved snapshot IDs/values at decisions; never assume history availability equals online visibility.

## Curriculum API

POST /v1/curriculum/decisions with run_id, learner_id, rollout_block_id, registry_version, request_id (idempotency key). Returns decision_id, curriculum_version, registry_version, mode, bucket_probabilities (nine named buckets, nonnegative finite values summing to 1), feature_snapshot_ids, feature_as_of and fallback_reason.

Same request_id and identical payload returns the same durable decision; different payload returns 409. Scope keys by run and learner, retain for 48 h. Invalid input 422, unknown registry 404, no eligible scenarios or durable decision storage unavailable 503. The response specifies training buckets only. The local runner samples layouts with its logged RNG and applies selections only at reset. Evaluation never calls this API.

Fallback reasons: unknown_learner, missing_features, stale_features, feature_store_timeout, selector_unavailable. Fallback distribution is uniform across eligible training buckets, with explicit mode=uniform_fallback; feature_as_of may be null. Budget retrieval <=40 ms and rule computation <=10 ms, with bounded overall timeout <=100 ms at the runner. On network failure the runner logs its own fallback decision in the outbox before proceeding.

Decision records include request/decision identity, effective feature values and IDs, policy version, selection probabilities, selected scenario per episode, RNG seed/state reference, timing and fallback reason. Store a durable local decision ledger for the single-instance MVP; M0 must validate idempotency across API restart. Export records to curriculum-decisions.v1 for analysis.

Health: /health/live process; /health/ready registry, selector or fallback, and decision ledger; /metrics aggregate operational signals. Never label metrics by run_id, learner_id or episode_id.
