# Decision log

Updated 2026-11-15. Entries below describe the current scope; superseded decisions remain explicit.

## D001 — Local simulation MVP

Accepted default; revised for robotics. Use local Docker Compose and a small simulated environment. No physical robot, cloud account or personal data.

## D002 — Preserve the streaming platform

Accepted user requirement. Kafka events, Java Flink features, Feast/Redis retrieval and Python serving remain core. Partition/isolate by experiment run and learner instead of consumer user identity.

## D003 — Supported Feast adapter

Proposed pending M0 evidence. Emit full snapshots and push through Feast's supported interface. Verify revision ordering, retry and consumer-fencing behavior before claiming monotonicity. Adapter boundary is at-least-once.

## D004 — Separate history and decision provenance

Accepted default. Archive snapshots to Parquet with first availability. Log exact decision inputs because feature history does not prove what a request observed. Preserve episode, policy and curriculum provenance.

## D005 — Consumer ranker design superseded

Superseded by D007/D008 at user request. The initial generic catalog/implicit-feedback ranking design is no longer in scope. Do not implement its event contracts or evaluation metrics.

## D006 — Targets are not outcomes

Accepted. Pipeline capacity, robot learnability and curriculum benefit require separate measured evidence. Negative research results must remain visible.

## D007 — Required robot RL

Accepted scope from user; PPO/Gymnasium/Stable-Baselines3 are implementation defaults pending M0. The robot learns actions; curriculum selection runs between episodes. No Kafka-backed off-policy training of PPO.

## D008 — Transparent curriculum first

Accepted implementation default. Uniform, fixed and adaptive rule curricula are required. A learned bandit/RL teacher is optional after MVP. Required RL is already provided by the robot policy.

## D009 — Small fully observed warehouse

Accepted default. Custom 12x12 grid, fixed-size observation and four actions. This controls local compute and avoids physics/recurrent-policy complexity. MiniGrid is an alternative only after a documented compatibility/design decision.

## D010 — Experimental rigor

Accepted. Disjoint layout splits, equal environment-step budgets, five paired seeds, locked test data and separate evaluation telemetry. Curriculum improvement is a hypothesis; valid negative results can complete the comparison.

## D011 — Preserve repository identity

Accepted default. Retain realtime-recommendation-pipeline URL; README names the Adaptive Robotics Training Platform. No repository rename is required for the scope change.

## M0/M1 open decisions

Exact runtime/image versions; Feast ordering and same-time revisions; API ledger implementation; monotonic wall-clock expiry; difficulty generation constraints; measured CPU training feasibility and checkpoint cadence. Record rationale and evidence before closing.

## New decision format

ID/title; date/status; context/options; decision/tradeoffs; executable verification; affected contracts; superseded entries.
