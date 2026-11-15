# Technical references

Checked 2026-11-15. Official documentation guides implementation; references to stable/latest may change. M0 must record the exact versioned documentation used with its pinned matrix.

- [Feast push sources](https://docs.feast.dev/reference/data-sources/push): registered feature views can consume pushed feature values. Verify selected provider support for each destination.
- [Feast push model](https://docs.feast.dev/getting-started/architecture/push-vs-pull-model): conceptual online feature publication.
- [Flink Kafka connector](https://nightlies.apache.org/flink/flink-docs-stable/docs/connectors/datastream/kafka/): transactional output requires checkpointing; visibility follows committed transactions.
- [Flink fault tolerance](https://nightlies.apache.org/flink/flink-docs-stable/docs/learn-flink/fault_tolerance/): checkpoint state and source positions enable recovery.
- [Flink checkpointing](https://nightlies.apache.org/flink/flink-docs-stable/docs/dev/datastream/fault-tolerance/checkpointing/): configuration and state recovery constraints.

The adapter design, latency budgets, model choices, and workload sizes are project proposals, not claims made by these sources. Do not infer that Flink's guarantee extends through a nontransactional external write.
