import numpy as np
import pytest
from gymnasium.utils.env_checker import check_env
from simulation.environment import WarehouseEnv, shortest_path


def test_gym_contract():
    check_env(WarehouseEnv(), skip_render_check=True)


def test_exact_reward_and_goal():
    env = WarehouseEnv()
    obs, _ = env.reset(seed=42)
    assert obs.shape == (576,) and obs.dtype == np.float32
    total = 0
    for _ in range(3):
        _, reward, terminated, truncated, info = env.step(1)
        total += reward
    assert total == pytest.approx(.97)
    assert terminated and not truncated and info['success']
    with pytest.raises(RuntimeError):
        env.step(1)


def test_collision_and_timeout():
    env = WarehouseEnv(start=(0, 0), max_steps=1)
    env.reset()
    _, reward, terminated, truncated, info = env.step(0)
    assert reward == pytest.approx(-.06)
    assert not terminated and truncated
    assert info['position'] == (0, 0) and info['collision_count'] == 1


def test_last_step_success_is_not_timeout():
    env = WarehouseEnv(max_steps=3)
    env.reset()
    for _ in range(3):
        _, _, terminated, truncated, _ = env.step(1)
    assert terminated and not truncated


def test_unreachable_rejected():
    walls = np.zeros((12, 12), dtype=bool)
    walls[:, 3] = True
    with pytest.raises(ValueError, match='Unreachable'):
        WarehouseEnv(walls=walls)


def test_path_and_reset_reproducibility():
    env = WarehouseEnv()
    first, _ = env.reset(seed=7)
    for action in shortest_path(env.walls, env.start, env.goal):
        env.step(action)
    second, _ = env.reset(seed=7)
    np.testing.assert_array_equal(first, second)


def test_render_and_invalid_action():
    env = WarehouseEnv(render_mode='rgb_array')
    env.reset()
    assert env.render().shape == (288, 288, 3)
    with pytest.raises(ValueError):
        env.step(4)
