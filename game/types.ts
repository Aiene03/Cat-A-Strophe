export type LaneType = 'GRASS' | 'ROAD' | 'RAIL' | 'WATER';

// Keep RowType as alias for backwards compat with graveyard etc
export type RowType = LaneType;

export interface Obstacle {
  id: string;
  y: number; // vertical position in pixels (moves up/down)
  height: number; // obstacle length along the lane
  speed: number; // pixels per frame (negative = up, positive = down)
  color: string;
}

export interface Lane {
  id: number;
  type: LaneType;
  obstacles: Obstacle[];
  safeSlots?: number[]; // vertical slot indices where lily pads exist (WATER lanes)
}

// Keep Row as alias
export type Row = Lane;

export interface CatState {
  id: string;
  name: string;
  furColor: string;
  eyeColor: string;
  collarColor: string;
  alive: boolean;
  stepsTotal: number;
  highestLevel: number;
  causeOfDeath?: string;
  createdAt: number;
  diedAt?: number;
}

export interface GameState {
  catLane: number; // which vertical lane the cat is in (left to right)
  catSlot: number; // vertical slot within the lane
  lanes: Lane[];
  score: number;
  level: number;
  isPlaying: boolean;
  isDead: boolean;
  lastTapTime: number;
}

// Keep old names as aliases for anything that references them
export { type GameState as GameStateType };

export const LANE_SLOTS = 7; // number of vertical slots per lane
export const CELL_SIZE = 50;
export const VISIBLE_LANES = 15; // how many lanes visible horizontally
export const STEPS_PER_LEVEL = 25;
export const IDLE_TIMEOUT = 10000; // ms

// Old aliases
export const GRID_COLS = LANE_SLOTS;
export const VISIBLE_ROWS = VISIBLE_LANES;
