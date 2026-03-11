import { Lane, CELL_SIZE } from './types';

export function checkCollision(
  lane: Lane,
  catSlot: number,
): { dead: boolean; cause?: string } {
  const catTop = catSlot * CELL_SIZE;
  const catBottom = catTop + CELL_SIZE * 0.8;

  if (lane.type === 'WATER') {
    if (!lane.safeSlots || !lane.safeSlots.includes(catSlot)) {
      return { dead: true, cause: 'Fell in the water! 🌊' };
    }
    return { dead: false };
  }

  if (lane.type === 'ROAD' || lane.type === 'RAIL') {
    for (const obs of lane.obstacles) {
      const obsTop = obs.y;
      const obsBottom = obs.y + obs.height;
      if (catBottom > obsTop && catTop < obsBottom) {
        return {
          dead: true,
          cause: lane.type === 'ROAD' ? 'Hit by a car! 🚗' : 'Hit by a train! 🚂',
        };
      }
    }
  }

  return { dead: false };
}
