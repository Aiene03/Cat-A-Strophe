import { GameState, LANE_SLOTS, CELL_SIZE, VISIBLE_LANES, STEPS_PER_LEVEL, IDLE_TIMEOUT } from './types';
import { generateLane, generateInitialLanes } from './procedural';
import { checkCollision } from './collision';

export function createInitialGameState(): GameState {
  return {
    catLane: 0,
    catSlot: Math.floor(LANE_SLOTS / 2),
    lanes: generateInitialLanes(VISIBLE_LANES + 5),
    score: 0,
    level: 1,
    isPlaying: true,
    isDead: false,
    lastTapTime: Date.now(),
  };
}

export function stepForward(state: GameState): GameState {
  if (!state.isPlaying || state.isDead) return state;

  const newLane = state.catLane + 1;
  const newScore = state.score + 1;
  const newLevel = Math.floor(newScore / STEPS_PER_LEVEL) + 1;

  // Generate more lanes if needed
  let lanes = [...state.lanes];
  while (lanes.length <= newLane + VISIBLE_LANES) {
    lanes.push(generateLane(lanes.length, newLevel));
  }

  const newState: GameState = {
    ...state,
    catLane: newLane,
    score: newScore,
    level: newLevel,
    lanes,
    lastTapTime: Date.now(),
  };

  // Check collision at new position
  const lane = lanes[newLane];
  if (lane) {
    const result = checkCollision(lane, state.catSlot);
    if (result.dead) {
      return { ...newState, isDead: true, isPlaying: false };
    }
  }

  return newState;
}

export function updateObstacles(state: GameState): GameState {
  if (!state.isPlaying || state.isDead) return state;

  const totalHeight = LANE_SLOTS * CELL_SIZE;
  const lanes = state.lanes.map((lane) => {
    if (lane.type === 'GRASS' || lane.type === 'WATER') return lane;
    return {
      ...lane,
      obstacles: lane.obstacles.map((obs) => {
        let newY = obs.y + obs.speed;
        // Wrap around vertically
        if (obs.speed > 0 && newY > totalHeight + obs.height) {
          newY = -obs.height;
        } else if (obs.speed < 0 && newY + obs.height < -obs.height) {
          newY = totalHeight + obs.height;
        }
        return { ...obs, y: newY };
      }),
    };
  });

  // Re-check collision on current lane after obstacle movement
  const currentLane = lanes[state.catLane];
  if (currentLane) {
    const result = checkCollision(currentLane, state.catSlot);
    if (result.dead) {
      return { ...state, lanes, isDead: true, isPlaying: false };
    }
  }

  return { ...state, lanes };
}


export function checkIdleTimeout(state: GameState): boolean {
  return Date.now() - state.lastTapTime > IDLE_TIMEOUT;
}
