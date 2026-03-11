import { Lane, LaneType, Obstacle, LANE_SLOTS, CELL_SIZE } from './types';

let laneIdCounter = 0;
let obstacleIdCounter = 0;

export function resetCounters() {
  laneIdCounter = 0;
  obstacleIdCounter = 0;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getLaneType(laneIndex: number): LaneType {
  if (laneIndex < 3) return 'GRASS'; // first 3 lanes always safe
  const rand = Math.random();
  if (rand < 0.25) return 'GRASS';
  if (rand < 0.55) return 'ROAD';
  if (rand < 0.75) return 'RAIL';
  return 'WATER';
}

const CAR_COLORS = ['#e74c3c', '#3498db', '#f39c12', '#2ecc71', '#9b59b6', '#e67e22'];
const TRAIN_COLOR = '#555555';

function generateObstacles(type: LaneType, level: number): Obstacle[] {
  const totalHeight = LANE_SLOTS * CELL_SIZE;
  const speed = (1 + level * 0.3) * (Math.random() > 0.5 ? 1 : -1);
  const obstacles: Obstacle[] = [];

  if (type === 'ROAD') {
    const count = 2 + Math.floor(Math.random() * 2);
    const gap = totalHeight / count;
    for (let i = 0; i < count; i++) {
      obstacles.push({
        id: `obs_${obstacleIdCounter++}`,
        y: i * gap + Math.random() * 30,
        height: CELL_SIZE * (1 + Math.random() * 0.5),
        speed: speed * (1.5 + Math.random()),
        color: randomChoice(CAR_COLORS),
      });
    }
  } else if (type === 'RAIL') {
    obstacles.push({
      id: `obs_${obstacleIdCounter++}`,
      y: -totalHeight * 2,
      height: CELL_SIZE * 5,
      speed: speed * 4,
      color: TRAIN_COLOR,
    });
  }

  return obstacles;
}

function generateSafeSlots(level: number): number[] {
  const slots: number[] = [];
  const minPads = Math.max(2, 5 - Math.floor(level / 3));
  const allSlots = Array.from({ length: LANE_SLOTS }, (_, i) => i);
  // Always include center
  slots.push(Math.floor(LANE_SLOTS / 2));
  while (slots.length < minPads) {
    const s = randomChoice(allSlots);
    if (!slots.includes(s)) slots.push(s);
  }
  return slots.sort((a, b) => a - b);
}

export function generateLane(laneIndex: number, level: number): Lane {
  const type = getLaneType(laneIndex);
  return {
    id: laneIdCounter++,
    type,
    obstacles: type === 'GRASS' ? [] : type === 'WATER' ? [] : generateObstacles(type, level),
    safeSlots: type === 'WATER' ? generateSafeSlots(level) : undefined,
  };
}

export function generateInitialLanes(count: number): Lane[] {
  resetCounters();
  return Array.from({ length: count }, (_, i) => generateLane(i, 1));
}

// Old aliases
export const generateRow = generateLane;
export const generateInitialRows = generateInitialLanes;
