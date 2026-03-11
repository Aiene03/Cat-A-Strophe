import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { File, Directory, Paths } from 'expo-file-system/next';
import { CatState } from '../game/types';
import { PRESET_CATS } from '../game/presets';

const STORE_DIR = new Directory(Paths.document, 'store');

const fsStorage: StateStorage = {
  getItem: async (name: string) => {
    try {
      const file = new File(STORE_DIR, name + '.json');
      if (!file.exists) return null;
      return file.text();
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      if (!STORE_DIR.exists) {
        STORE_DIR.create();
      }
      const file = new File(STORE_DIR, name + '.json');
      file.write(value);
    } catch {
      // silently fail
    }
  },
  removeItem: async (name: string) => {
    try {
      const file = new File(STORE_DIR, name + '.json');
      if (file.exists) {
        file.delete();
      }
    } catch {
      // silently fail
    }
  },
};

interface GameStore {
  currentCat: CatState | null;
  currentCatIndex: number;
  graveyard: CatState[];
  bestCat: { name: string; level: number } | null;

  startGame: () => void;
  killCat: (cause: string, steps: number, level: number) => void;
  updateCatProgress: (steps: number, level: number) => void;
  resetAll: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      currentCat: null,
      currentCatIndex: 0,
      graveyard: [],
      bestCat: null,

      startGame: () => {
        const { currentCatIndex, currentCat } = get();
        if (currentCat?.alive) return;
        if (currentCatIndex >= 9) return;
        const preset = PRESET_CATS[currentCatIndex];
        set({
          currentCat: {
            id: Date.now().toString(),
            name: preset.name,
            furColor: preset.furColor,
            eyeColor: preset.eyeColor,
            collarColor: preset.collarColor,
            alive: true,
            stepsTotal: 0,
            highestLevel: 1,
            createdAt: Date.now(),
          },
        });
      },

      killCat: (cause, steps, level) => {
        const { currentCat, graveyard, bestCat, currentCatIndex } = get();
        if (!currentCat) return;

        const deadCat: CatState = {
          ...currentCat,
          alive: false,
          stepsTotal: steps,
          highestLevel: level,
          causeOfDeath: cause,
          diedAt: Date.now(),
        };

        const newBest =
          !bestCat || level > bestCat.level
            ? { name: currentCat.name, level }
            : bestCat;

        set({
          currentCat: null,
          graveyard: [...graveyard, deadCat],
          bestCat: newBest,
          currentCatIndex: currentCatIndex + 1,
        });
      },

      updateCatProgress: (steps, level) => {
        const { currentCat } = get();
        if (!currentCat) return;
        set({
          currentCat: { ...currentCat, stepsTotal: steps, highestLevel: level },
        });
      },

      resetAll: () => {
        set({
          currentCat: null,
          currentCatIndex: 0,
          graveyard: [],
          bestCat: null,
        });
      },
    }),
    {
      name: 'cat-a-strophe-storage',
      storage: createJSONStorage(() => fsStorage),
    }
  )
);
