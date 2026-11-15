"""Small fully observed Gymnasium navigation environment."""
from collections import deque
import gymnasium as gym
import numpy as np
from gymnasium import spaces

SIZE = 12
ACTIONS = ((-1, 0), (0, 1), (1, 0), (0, -1))


def shortest_path(walls, start, goal):
    queue = deque([(tuple(start), [])])
    seen = {tuple(start)}
    while queue:
        position, path = queue.popleft()
        if position == tuple(goal):
            return path
        for action, (dr, dc) in enumerate(ACTIONS):
            nxt = (position[0] + dr, position[1] + dc)
            if 0 <= nxt[0] < SIZE and 0 <= nxt[1] < SIZE and not walls[nxt] and nxt not in seen:
                seen.add(nxt)
                queue.append((nxt, path + [action]))
    raise ValueError('Unreachable goal')


class WarehouseEnv(gym.Env):
    metadata = {'render_modes': ['rgb_array'], 'render_fps': 8}

    def __init__(self, *, walls=None, start=(1, 1), goal=(1, 4), max_steps=200, render_mode=None):
        super().__init__()
        self.walls = np.zeros((SIZE, SIZE), dtype=bool) if walls is None else np.array(walls, dtype=bool, copy=True)
        if self.walls.shape != (SIZE, SIZE):
            raise ValueError('walls must be 12x12')
        self.start, self.goal = tuple(start), tuple(goal)
        for pos in (self.start, self.goal):
            if len(pos) != 2 or any(not isinstance(x, int) or x < 0 or x >= SIZE for x in pos):
                raise ValueError('Invalid position')
            if self.walls[pos]:
                raise ValueError('Start/goal inside a wall')
        if self.start == self.goal or not isinstance(max_steps, int) or max_steps < 1:
            raise ValueError('Invalid task')
        shortest_path(self.walls, self.start, self.goal)
        if render_mode not in (None, 'rgb_array'):
            raise ValueError('Unsupported render mode')
        self.max_steps, self.render_mode = max_steps, render_mode
        self.action_space = spaces.Discrete(4)
        self.observation_space = spaces.Box(0, 1, (576,), dtype=np.float32)
        self.done = True

    def _observation(self):
        planes = np.zeros((4, SIZE, SIZE), dtype=np.float32)
        planes[0] = self.walls
        planes[1, self.position[0], self.position[1]] = 1
        planes[2, self.goal[0], self.goal[1]] = 1
        planes[3] = ~self.walls
        return planes.flatten()

    def reset(self, *, seed=None, options=None):
        super().reset(seed=seed)
        self.position = self.start
        self.steps = self.collisions = 0
        self.done = False
        return self._observation(), {'position': self.position}

    def step(self, action):
        if self.done:
            raise RuntimeError('Call reset before stepping a finished episode')
        if not self.action_space.contains(action):
            raise ValueError('Invalid action')
        dr, dc = ACTIONS[int(action)]
        nxt = (self.position[0] + dr, self.position[1] + dc)
        collision = not (0 <= nxt[0] < SIZE and 0 <= nxt[1] < SIZE) or self.walls[nxt]
        if not collision:
            self.position = nxt
        self.steps += 1
        self.collisions += int(collision)
        success = self.position == self.goal
        truncated = self.steps >= self.max_steps and not success
        self.done = success or truncated
        reward = -0.01 - 0.05 * int(collision) + float(success)
        return self._observation(), reward, success, truncated, {
            'success': success, 'collision_count': self.collisions,
            'episode_steps': self.steps, 'position': self.position,
        }

    def render(self):
        image = np.full((SIZE, SIZE, 3), (239, 242, 238), dtype=np.uint8)
        image[self.walls] = (53, 64, 58)
        image[self.goal] = (62, 145, 89)
        image[self.position] = (240, 155, 57)
        return np.repeat(np.repeat(image, 24, axis=0), 24, axis=1)
