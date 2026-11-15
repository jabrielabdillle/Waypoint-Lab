# Technical sources

Checked 2026-11-15. Pin exact compatible versions and versioned documentation in M0. Stable/master references can change; do not infer a tested release matrix from these links.

## Reinforcement learning and simulation

- [Stable-Baselines3 PPO](https://stable-baselines3.readthedocs.io/en/master/modules/ppo.html): PPO interface and supported action spaces. Project hyperparameters are proposals, not documented performance guarantees.
- [Gymnasium handling time limits](https://gymnasium.farama.org/tutorials/gymnasium_basics/handling_time_limits/): termination and truncation need distinct treatment for value bootstrapping.
- [Gymnasium environment usage](https://gymnasium.farama.org/introduction/basic_usage/): reset/step interaction and episode lifecycle.
- [MiniGrid environments](https://minigrid.farama.org/v3.0.0/environments/minigrid/): reference navigation environments; not a required dependency under the custom-grid decision.

## Streaming and features

- [Feast push sources](https://docs.feast.dev/reference/data-sources/push): registered features and provider-specific destinations.
- [Flink Kafka connector](https://nightlies.apache.org/flink/flink-docs-stable/docs/connectors/datastream/kafka/): checkpoint-backed transactional output.
- [Flink fault tolerance](https://nightlies.apache.org/flink/flink-docs-stable/docs/learn-flink/fault_tolerance/): state and source-position recovery.
- [Flink checkpointing](https://nightlies.apache.org/flink/flink-docs-stable/docs/dev/datastream/fault-tolerance/checkpointing/): configuration constraints.

The warehouse reward, curriculum formulas, research targets, budgets and architecture are project designs. No cited source establishes that this adaptive curriculum will improve learning, or that transactional Flink output makes Feast writes exactly-once.
