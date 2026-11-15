# Robot policy and curriculum

## Required robot reinforcement learning

Use Stable-Baselines3 PPO with an MLP policy and the fully observed vector from RL_ENVIRONMENT.md. One CPU environment initially. PPO updates from freshly collected local trajectories; summaries replayed through Kafka are never training experiences.

Initial configuration to validate and then freeze: rollout length 2,048 steps, batch size 64, learning rate 3e-4, gamma 0.99, GAE lambda 0.95, clip range 0.2, 10 epochs/update, entropy coefficient 0.01. These are proposed starting settings, not tuned results. Smoke tests use smaller bounded budgets and cannot establish learning efficacy.

Keep policy weights fixed during rollout collection. Refresh the curriculum distribution once per rollout block and apply sampled scenarios at the next reset, never mid-episode. If an episode spans a block boundary, keep its original scenario decision and record every policy version used. A PPO update at a rollout boundary can change the action policy during a continuing episode; do not mislabel all its actions with the starting version.

Save immutable checkpoints with optimizer state, training step, policy version, observation/action/reward versions, dependency versions, registry hash, RNG states, curriculum config and normalization state if introduced. Do not promise bitwise resume without simulator state capture. A rollback/restart from a checkpoint begins a new run_id with parent_run_id and parent_checkpoint metadata; its statistics start cold.

## Required curriculum methods

All methods share the same eligible train layouts, robot model, reward, training budget and evaluation suite.

1. Uniform: equal bucket probabilities and uniform layouts within each bucket.
2. Fixed schedule: difficulty 1 for first 20% of budget, 1..2 for next 30%, all difficulties for remaining 50%; uniform over eligible buckets.
3. Adaptive rules: combine practice, exploration and retention using current per-bucket features.

Adaptive scoring with n_recent >=20: weight = max(0.01, 1 - abs(success_rate_100 - 0.6)) + max(0, learning_progress_100 or 0). Normalize across observed buckets. With probability 0.70 use those weights; 0.20 samples uniformly over all eligible buckets; 0.10 samples mastered buckets (success >=0.8 and n_recent >=20). If practice or mastered sets are empty, redirect that component to uniform. Under-sampled buckets remain reachable through exploration. Missing/stale required feature rows trigger the explicit uniform fallback in CONTRACTS.md. Test probability sums, eligibility and starvation behavior.

This selector is a transparent recommendation policy, not a second reinforcement-learning agent. Its weights are heuristics and must be judged against baselines.

## Evaluation and promotion

EXPERIMENTS.md governs all learning claims. Reward improvement alone is insufficient: inspect success, collisions, coverage and learning curves. Do not substitute click-ranking metrics for sample efficiency.

Validate policy artifact hash and schema before loading; never execute untrusted serialized artifacts. Retain last good policy and do not hot-swap an active PPO learner mid-rollout. Selector versions and robot policy versions are different fields and evolve independently.

## Optional extension after MVP

A contextual bandit can choose curriculum buckets using recent performance and validation-probe improvement as delayed reward. Log action probabilities and attribution windows; never reward it with held-out test performance. A full RL teacher would additionally model long-horizon effects of curriculum decisions and is a separate experiment. Neither extension is required to deliver the PPO-based MVP.
