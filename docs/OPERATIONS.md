# Operations plan

The command surface below is planned, not implemented. Agents must verify commands before presenting a runnable quickstart.

| Command | Intended behavior |
|---|---|
| make doctor | Check runtime versions, CPU/memory, Docker and ports |
| make setup | Install pinned dependencies |
| make up | Start pipeline and wait for readiness |
| make seed | Generate and validate scenario registry/splits |
| make train-smoke | Bounded PPO easiest-task test |
| make train | Explicit configured training run with step budget |
| make evaluate | Frozen-policy evaluation without training side effects |
| make experiment | Full paired-seed curriculum comparison |
| make demo | Actual RL episode -> feature -> next-scenario loop |
| make test | Environment, unit and contract checks |
| make integration | Cross-service and closed-loop checks |
| make load | Separate synthetic telemetry/API capacity run |
| make down | Stop while preserving state |
| make reset | Explicitly destructive local reset; never implicit |

CPU-first, one environment; record actual training time and supported architectures. No implicit GPU rentals or endless training. Keep dependency/service ports local and credentials out of configuration examples.

## Metrics and logs

Track Kafka lag, late/DLQ counts, checkpoints, state size, feature age, adapter retries, API latency/fallback, decision export lag, outbox occupancy and model-load failures. Track training steps/s, success, collisions, return, difficulty distribution, coverage and evaluation checkpoints in experiment logs. Do not place run, learner, episode or scenario IDs in unbounded Prometheus labels; use structured logs and run artifacts.

## Rehearsable recovery

- Kafka outage: retain bounded outbox; pause at next episode boundary if full. Never silently drop experiment evidence.
- Redis outage: uniform curriculum fallback, logged explicitly; retry feature publishing without committing failed writes.
- Flink crash: restore valid checkpoint with stable operator IDs; compare snapshots to oracle.
- Lost online state: rebuild isolated namespace, verify identity/freshness before switching.
- Training interruption: load validated checkpoint into a new child run; document incomplete episode and lost progress. Do not fabricate exact resume.
- Corrupt PPO artifact: stop that training/evaluation run or load a validated checkpoint into a child run. Random actions are not a silently equivalent trained policy.
- Decision ledger outage: API fails 503; runner records local fallback. Reconcile decisions before experimental analysis.
- Poison input: quarantine with reason and source identity; repair and validate replay in a separate namespace.
- Learning collapse: preserve evidence, compare reward/version/distribution changes; stop at configured budget and diagnose.

## Retention

Episode and feature Kafka topics: 7 days, delete retention. Dedup state: 48 h. Run state: expires after 48 h inactivity with explicit reset marker. Local history/logs: 30 days default, but preserve all manifests/evidence needed for an active experiment before cleanup. Keep active/previous good checkpoints; never auto-delete active research artifacts.

No real robots, public endpoints or real personal data in this scope.
