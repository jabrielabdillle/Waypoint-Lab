# Validation strategy

## Evidence requirements

Every result records commit, exact command, versions, seeds, machine resources, config/registry hashes, run IDs, elapsed time, pass/fail and artifact locations. Planning documents are not runtime evidence.

## Test layers

- Environment: correct observations/actions, valid paths, deterministic reset, reward math, collision counting, termination versus timeout.
- RL: finite updates, observation compatibility, checkpoint metadata, budget enforcement, RNG isolation, no Kafka replay as PPO experience.
- Curriculum: normalized probabilities, eligibility, under-sampled exploration, reset-only application and block freezing.
- Streaming: duplicates, conflicts, latest-100 ordering, rolling boundaries, out-of-order corrections, idle expiry, run isolation.
- Store/API: ordered writes, retries, revisions, decision idempotency, exact feature provenance, fallback deadlines.
- Scientific evaluation: locked splits, no evaluation-fed features, equal step budgets, matched seeds, correct censoring and seed-level statistics.
- Infrastructure: consumer/worker crashes, Redis/Kafka outages, poisoned records, corrupt artifacts and load.

## Required acceptance scenarios

1. A reset produces a valid reproducible layout; hand-computed actions produce expected reward and success.
2. Collision leaves position fixed; the 200-step cap truncates without masquerading as success.
3. PPO learns the easiest task beyond random actions; report actual seed/budget.
4. Uniform, fixed and adaptive curricula run with the same robot and reward.
5. Repeated episode telemetry does not inflate statistics; conflicting payload is quarantined.
6. Late/permitted corrections agree with oracle; older data goes to late topic.
7. Separate runs with identical learner IDs remain isolated; evaluation records cannot affect selection.
8. Latest-100 metrics use episode_index rather than arrival order; time-window expiry works during silence.
9. Feature adapter crash before/after write/offset commit preserves monotonic values.
10. Repeated decision requests survive API restart; payload conflict returns 409.
11. Redis/API outage leads to logged eligible uniform fallback, with no per-action network stall.
12. A scenario recommendation takes effect only at reset; an episode spanning a PPO block retains provenance.
13. Restoring an older checkpoint creates new run lineage rather than blending statistics.
14. Evaluation changes no training weights, normalizers, feature rows or curriculum decisions.
15. Synthetic load remains in its own namespace and is excluded from learning curves.
16. The full experiment reports non-attainment and negative results honestly.
17. Clean-environment setup and actual trained-policy demo reproduce documented outcomes.

## Performance and release

Use PRODUCT.md for pipeline load and EXPERIMENTS.md for RL budgets; do not conflate the two. Keep per-seed learning results distinct from aggregate API latency. Functional MVP requires M0..M8 deliverables and scientific integrity, not a forced positive adaptive-curriculum result. Operational target failures remain visible and prevent claiming those targets met. Production readiness is not implied.
