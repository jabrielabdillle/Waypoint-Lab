# Reinforcement-learning environment

## Task and scope

A simulated mobile robot navigates a 12x12 warehouse grid from a start cell to a goal without entering walls. This is a robotics-inspired navigation abstraction, not a physical robot simulator. Implement a Gymnasium-compatible environment; run its checker and Stable-Baselines3 compatibility checks.

## MDP contract

- Observation: flattened float32 vector of four 12x12 binary planes: walls, robot position, goal position, traversable cells. Fixed shape 576, values 0 or 1. Full observability avoids a recurrent-policy requirement.
- Actions: Discrete(4), north/east/south/west. An attempted wall or boundary entry leaves position unchanged and increments collision_count.
- Reward per action: -0.01 step cost; an additional -0.05 for collision; +1.0 for reaching the goal. No progress shaping in the baseline. Freeze this reward across curriculum comparisons.
- Success: reaching the goal ends the episode with terminated=true.
- External cap: 200 steps, truncated=true if the goal has not been reached; terminated=false. If the goal is reached on the final allowed step, report termination, not a timeout.
- Preserve final observations and correct time-limit bootstrapping through wrappers. Never collapse terminated and truncated before PPO handling.
- Start and goal must be distinct free cells with a verified path. No illegal or unsolvable map may enter a training catalog.

## Scenario registry

Three families: open_floor, narrow_corridor, cluttered_aisles. Each has difficulty 1..3, giving nine buckets. Registry entries contain scenario_id, bucket_id, family, difficulty, layout_seed, grid hash, shortest_path_length, environment_version, registry_version and split.

Generate 100 distinct validated layouts per bucket: 60 train, 20 validation, 20 test (900 total). Reject duplicate grid/start/goal hashes across splits. Increasing difficulty uses path length and obstacle density constraints defined and frozen in M1; family names alone are not measurable difficulty. Store the generator parameters and generated manifest.

Scenario selectors choose a bucket distribution and then uniform layouts within eligible training buckets. Evaluation follows a fixed balanced manifest, never the adaptive selector.

## Reproducibility

Separate RNG streams for policy initialization, scenario/layout selection, environment transitions and evaluation. Reset with an explicit seed. Log versions and hashes for every run. Deterministic same-host fixtures are required; do not promise identical floating-point training across hardware.

## Feasibility gate

Before building the full platform, show PPO improves on the easiest fixed task within a bounded M0 budget (initially 100,000 environment steps). Failure triggers environment/reward/implementation diagnosis and a documented design revision, not an indefinite training loop. Any approved reward revision changes environment_version and restarts all comparison arms.
