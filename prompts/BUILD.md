# Autonomous build kickoff

> Read AGENTS.md and MEMORY.md, then product, architecture, contracts, RL environment, model and experiment specifications. Build the Adaptive Robotics Training Platform starting with the first unblocked backlog item. Required reinforcement learning is a real PPO navigation policy; do not substitute scripted telemetry. Start with bounded learnability and compatibility spikes. Keep action inference local and curriculum selection at resets. Implement reversible local work autonomously within simulation scope. Pin verified versions, test meaningful behavior, record exact commands/seeds/budgets/results, and update memory, decisions and backlog. If delegation is authorized, assign disjoint ready tasks. Continue through authorized ready work; stop for concrete blockers or completed scope. End with a precise handoff. Never invent benchmark or learning results.

## Review prompt

> Review against PRODUCT.md, CONTRACTS.md, RL_ENVIRONMENT.md, MODEL.md, EXPERIMENTS.md and VALIDATION.md. Check terminated/truncated semantics, on-policy rollout integrity, episode-boundary selection, run/test isolation, checkpoint lineage, feature ordering/replay, decision idempotency, fallback, equal training budgets and honest statistics. Distinguish a functional demonstration from full experimental evidence. Report actionable findings with file references.

## Experiment prompt

> Run the frozen experiment configuration only after prerequisite gates pass. Keep methods, seeds, step budgets and registry identical across arms. Preserve censored runs and negative results; never tune on test outcomes. Produce a reproducible report separating RL learning, curriculum benefit and pipeline performance. If available resources cannot complete the full protocol, report the exact completed subset and remaining work without labeling it complete.
