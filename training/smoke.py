"""Bounded PPO easiest-task feasibility experiment, not a generalization claim."""
import argparse
import hashlib
import json
import time
from pathlib import Path
import numpy as np
import torch
from gymnasium.utils.env_checker import check_env
from stable_baselines3 import PPO
from stable_baselines3.common.monitor import Monitor
from simulation.environment import WarehouseEnv


def evaluate(policy, episodes=100, seed=1000):
    env = WarehouseEnv()
    rng = np.random.default_rng(seed)
    successes, steps = [], []
    trace = []
    for i in range(episodes):
        obs, _ = env.reset(seed=seed + i)
        positions = [list(env.position)]
        while True:
            action = int(rng.integers(4)) if policy is None else int(policy.predict(obs, deterministic=True)[0])
            obs, _, terminated, truncated, info = env.step(action)
            positions.append(list(env.position))
            if terminated or truncated:
                successes.append(info['success'])
                steps.append(info['episode_steps'])
                break
        if i == 0:
            trace = positions
    return {'success_rate': float(np.mean(successes)), 'mean_steps': float(np.mean(steps)), 'episodes': episodes, 'trace': trace}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--steps', type=int, default=16384)
    parser.add_argument('--seed', type=int, default=42)
    parser.add_argument('--output', default='artifacts/smoke')
    args = parser.parse_args()
    if args.steps < 2048 or args.steps > 100000 or args.steps % 2048:
        parser.error('steps must be a multiple of 2048 between 2048 and 100000')
    out = Path(args.output)
    out.mkdir(parents=True, exist_ok=True)
    if (out / 'policy.zip').exists():
        parser.error('Choose a new output directory; artifacts are immutable')
    torch.set_num_threads(1)
    check_env(WarehouseEnv(), skip_render_check=True)
    before = evaluate(None)
    model = PPO('MlpPolicy', Monitor(WarehouseEnv()), seed=args.seed, device='cpu',
                n_steps=2048, batch_size=64, learning_rate=3e-4, gamma=.99,
                gae_lambda=.95, clip_range=.2, n_epochs=10, ent_coef=.01, verbose=0)
    started = time.monotonic()
    model.learn(total_timesteps=args.steps)
    elapsed = time.monotonic() - started
    model.save(out / 'policy')
    after = evaluate(PPO.load(out / 'policy', device='cpu'))
    report = {'kind': 'fixed-task-feasibility-only', 'seed': args.seed, 'steps': model.num_timesteps,
              'seconds': round(elapsed, 2), 'random': before, 'ppo': after,
              'policy_sha256': hashlib.sha256((out / 'policy.zip').read_bytes()).hexdigest(),
              'improved': after['success_rate'] > before['success_rate'],
              'limitation': 'One fixed training layout and one seed; not held-out or curriculum evidence.'}
    (out / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2), flush=True)


if __name__ == '__main__':
    main()
