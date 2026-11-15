# Agent instructions

## Mission

Build the Adaptive Robotics Training Platform specified in README.md. The user selected robotics curriculum recommendation and explicitly added reinforcement learning. Implement an actual PPO-trained navigation policy; scripted episode telemetry alone cannot satisfy the project.

Treat specifications as intended behavior, not evidence of implementation. Reversible local implementation and tests are in scope. Paid resources, real robot control, public deployment, credentials, and destructive operations require separate authorization.

## Read order

1. README.md and MEMORY.md.
2. docs/PRODUCT.md, docs/ARCHITECTURE.md, docs/CONTRACTS.md.
3. docs/RL_ENVIRONMENT.md, docs/MODEL.md, docs/EXPERIMENTS.md.
4. docs/BACKLOG.md, docs/DECISIONS.md, relevant validation/operations guidance.

Inspect existing code before editing. Resolve conflicts explicitly rather than silently changing acceptance criteria.

## Work loop

Claim the first unblocked task with owner, branch and scope in MEMORY.md. Implement a small tested slice. Record exact commands, environment, outcomes and evidence paths. Update affected specifications, decisions, backlog and memory. Hand off the next executable action. Never mark unrun tests as passing.

## Engineering and science rules

- Separate robot action policy from curriculum selection; PPO is required, a learned teacher is optional.
- Keep simulation actions local. Select scenarios at reset boundaries; never call Kafka/Feast for each action.
- Preserve Gymnasium terminated/truncated semantics and terminal observations through wrappers.
- PPO learns from its current local rollouts, not Kafka-replayed trajectories.
- Isolate features by experiment run and learner; do not mix independent seeds or evaluation episodes.
- Freeze reward, scenario splits and experimental budgets before comparing curricula.
- Never tune on held-out test results or claim simulator results demonstrate physical robot performance.
- Bound queues, state, retry budgets, API deadlines and training runs.
- Pin compatible libraries and image digests after M0, commit locks, seed fixtures, use UTC wall-clock timestamps separately from simulator steps.
- Do not claim end-to-end exactly-once Feast writes. Prove monotonicity and replay behavior.
- Keep feature definitions and history consistent, preserving availability times and actual decision inputs.
- CI uses no personal credentials. Never commit secrets, checkpoints, videos or large training outputs.
- Avoid additional infrastructure without a measured requirement and decision record.

## Coordination and completion

Use docs/AGENT_WORKFLOW.md when delegation is authorized. One coordinator owns shared contracts; writers must have disjoint scopes. A task is done only when its tests and acceptance checks pass and evidence is recorded. Report failed learning hypotheses honestly: a correct experiment can fail to show a curriculum benefit. Identify concrete blockers and continue independent ready work.
