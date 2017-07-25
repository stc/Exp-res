class Environment():
    def __init__(self, grid):
        self.grid = grid
        self.n_rows = len(grid)
        self.n_cols = len(grid[0])
        self.positions = self._positions()
        self.filteredpositions = self._filteredpositions()
        self.starting_positions = [p for p in self.filteredpositions
                                   if not self.is_terminal_state(p)]

    def actions(self, pos):
        """possible actions for a state (position)"""
        r, c = pos
        actions = []
        if r > 0:
            actions.append('up')
        if r < self.n_rows - 1:
            actions.append('down')
        if c > 0:
            actions.append('left')
        if c < self.n_cols - 1:
            actions.append('right')
        return actions

    def value(self, pos):
        """retrieve the reward value for a position"""
        r, c = pos
        return self.grid[r][c]

    def _positions(self):
        """all positions"""
        positions = []
        for r, row in enumerate(self.grid):
            for c, _ in enumerate(row):
                positions.append((r,c))
        return positions

    def _filteredpositions(self):
        """all positions"""
        fp = []
        for row in range(0,self.n_rows-5):
            for col in range(0, self.n_cols):
                fp.append((row,col))
        return fp
    def is_terminal_state(self, state):
        """tell us if the state ends the game"""
        val = self.value(state)
        return val is None or val > 0

    def reward(self, state):
        """the reward of a state:
        -1 if it's a hole,
        -1 if it's an empty space (to penalize each move),
        otherwise, the value of the state"""
        val = self.value(state)
        if val is None or val == 0:
            return -1
        return val

env = Environment([
    [   0,    0,    0,    0,    0,    0,    0,    0,    0,    0],
    [   0,    0,    0,    0,    0,    0,    0,    0,    0,    0],
    [   0,    0,    0,    0,    0,    0,    0,    0,    0,    0],
    [   0,    0,    0,    0,    0,    0,    0,    0,    0,    0],
    [   0,    0,    0,    0,    0,    0,    0,    0,    0,    0],
    [   0, None,    0, None,    0, None,    0, None,    0, None],
    [   0,    0,    0,    0,    0,    0,    0,    0,    0,    0],
    [   5,   10,    5,   10,    5,   10,    5,   10,    5,   10]
])

class QLearner():
    def __init__(self, state, environment, rewards, discount=0.5, explore=0.5, learning_rate=1):
        """
        - state: the agent's starting state
        - rewards: a reward function, taking a state as input, or a mapping of states to a reward value
        - discount: how much the agent values future rewards over immediate rewards
        - explore: with what probability the agent "explores", i.e. chooses a random action
        - learning_rate: how quickly the agent learns. For deterministic environments (like ours), this should be left at 1
        """
        self.discount = discount
        self.explore = explore
        self.learning_rate = learning_rate
        self.R = rewards.get if isinstance(rewards, dict) else rewards

        # our state is just our position
        self.state = state
        self.reward = 0
        self.env = environment

        # initialize Q
        self.Q = {}

    def reset(self, state):
        self.state = state
        self.reward = 0

    def actions(self, state):
        return self.env.actions(state)

    def _take_action(self, state, action):
        r, c = state
        if action == 'up':
            r -= 1
        elif action == 'down':
            r += 1
        elif action == 'right':
            c += 1
        elif action == 'left':
            c -= 1

        # return new state
        return (r,c)

    def step(self, action=None):
        """take an action"""
        # check possible actions given state
        actions = self.actions(self.state)

        # if this is the first time in this state,
        # initialize possible actions
        if self.state not in self.Q:
            self.Q[self.state] = {a: 0 for a in actions}

        if action is None:
            if random.random() < self.explore:
                action = random.choice(actions)
            else:
                action = self._best_action(self.state)
        elif action not in actions:
            raise ValueError('unrecognized action!')

        # remember this state and action
        # so we can later remember
        # "from this state, taking this action is this valuable"
        prev_state = self.state

        # update state
        self.state = self._take_action(self.state, action)

        # update the previous state/action based on what we've learned
        self._learn(prev_state, action, self.state)
        return action

    def _best_action(self, state):
        """choose the best action given a state"""
        actions_rewards = list(self.Q[state].items())
        return max(actions_rewards, key=lambda x: x[1])[0]

    def _learn(self, prev_state, action, new_state):
        """update Q-value for the last taken action"""
        if new_state not in self.Q:
            self.Q[new_state] = {a: 0 for a in self.actions(new_state)}
        reward = self.R(new_state)
        self.reward += reward
        self.Q[prev_state][action] = self.Q[prev_state][action] + self.learning_rate * (reward + self.discount * max(self.Q[new_state].values()) - self.Q[prev_state][action])

import time
import random

# try discount=0.1 and discount=0.9
pos = random.choice(env.starting_positions)
agent = QLearner(pos, env, env.reward, discount=0.9, learning_rate=1)

print('before training...')
agent.explore = 0
for i in range(10):
    game_over = False
    # start at a random position
    pos = random.choice(env.starting_positions)
    agent.reset(pos)
    while not game_over:
        agent.step()
        game_over = env.is_terminal_state(agent.state)
    print('reward:', agent.reward)

print('training for 1000 episodes...')
episodes = 1000
agent.explore = 0.5
for i in range(episodes):
    #print('episode:', i)
    game_over = False
    steps = 0

    # start at a random position
    pos = random.choice(env.starting_positions)
    agent.reset(pos)
    while not game_over:
        agent.step()
        steps += 1
        game_over = env.is_terminal_state(agent.state)

# print out the agent's Q table
# print('learned Q table:')
# for pos, vals in agent.Q.items():
#     print('{} -> {}'.format(pos, vals))

# let's see how it does
print('after training 1000 episodes...')
agent.explore = 0
for i in range(10):
    # start at a random position
    pos = random.choice(env.starting_positions)
    agent.reset(pos)
    game_over = False
    while not game_over:
        agent.step()
        game_over = env.is_terminal_state(agent.state)
        print(agent.state)
    print('reward:', agent.reward)


