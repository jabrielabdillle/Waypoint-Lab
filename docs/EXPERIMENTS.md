# Scientific experiment protocol

## Questions

Does PPO learn navigation beyond random actions? Does the streaming adaptive curriculum improve sample efficiency compared with uniform and fixed curricula? Does simulated benefit persist across scenario families and training seeds?

## Freeze before running

Version the registry and disjoint train/validation/test layouts from RL_ENVIRONMENT.md. Freeze reward, PPO parameters, curriculum rules, environment wrappers, training budget and analysis code before comparisons. Hyperparameter development uses train/validation only; record all changes. Test layouts stay locked until final evaluation.

Default full experiment: three curricula x five paired training seeds, each up to 1,000,000 environment steps. Use matching initialization seeds across arms, separate deterministic RNG streams, and identical evaluation manifests. Report training wall time and hardware in addition to environment steps. Revisions to the budget require a decision before examining comparison outcomes.

## Evaluation schedule

Every 20,000 training steps (at the next completed PPO update), evaluate a frozen policy with deterministic actions on the 180 validation layouts (20/bucket), one episode per layout. Evaluation does not update policy, normalization, features or curriculum. Record the actual step count. Run final held-out test evaluation on all 180 test layouts for the final checkpoint of every seed and method. Also evaluate random actions on those layouts with five action seeds.

Metric aggregation gives equal weight to the nine buckets; report per-family/difficulty breakdowns. Primary metric: training steps to >=80% balanced validation success at two consecutive evaluation checkpoints. If a run never reaches it, mark it right-censored at the training budget; do not discard it or invent an attainment time.

## Reporting

Report threshold attainment counts and curves, area under validation-success curve normalized by step budget, final test success, collisions per 100 steps, return, episode length, scenario coverage, fallback frequency and wall time. When all paired runs attain the threshold, report per-seed percentage reduction versus uniform and a bootstrap interval across paired seeds. With censored runs, do not use a naive mean steps reduction; report attainment/censoring and AUC instead. Five seeds yield limited precision; say so.

Bootstrap training seeds, not individual correlated episodes, for curriculum-effect uncertainty. A >=20% step reduction is a target, not a guaranteed outcome. Publish negative results. A full protocol execution with no gain can complete the research comparison, while leaving the benefit hypothesis unsupported.

## Leakage and provenance

Test/evaluation episodes never feed training features. Record each decision's observed features and availability, not reconstructed future snapshots. Runs and seeds have isolated entities. Do not retrospectively change scenario labels or reward definitions within an experiment. Telemetry load fixtures use separate namespaces and never count toward learning results.

## Required artifacts

Small committed report with configuration hashes, commit, versions, seeds, run manifests, method comparisons, limitations and links to locally reproducible commands. Ignore large checkpoints, rollouts, videos and raw logs. Optional videos illustrate behavior but cannot replace metrics.

## Scope of claims

This experiment concerns a grid-world navigation policy and its curriculum. It establishes neither physical robot safety nor sim-to-real transfer. A short smoke test proves wiring only; a pre-trained checkpoint demo must disclose its source and cannot replace the training comparison.
