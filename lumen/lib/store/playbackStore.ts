import { create } from "zustand";
import type { Step } from "@/lib/types/step";

interface PlaybackState {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number; // multiplier: 0.25 – 4
  steps: Step[];

  // Actions
  play: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  stepForward: () => void;
  stepBack: () => void;
  seekTo: (step: number) => void;
  setSpeed: (speed: number) => void;
  setSteps: (steps: Step[]) => void;
}

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  isPlaying: false,
  currentStep: 0,
  totalSteps: 0,
  speed: 1,
  steps: [],

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
  reset: () => set({ isPlaying: false, currentStep: 0 }),

  stepForward: () =>
    set((s) => {
      const next = Math.min(s.currentStep + 1, s.totalSteps - 1);
      return { currentStep: next, isPlaying: next === s.totalSteps - 1 ? false : s.isPlaying };
    }),

  stepBack: () =>
    set((s) => ({
      currentStep: Math.max(s.currentStep - 1, 0),
      isPlaying: false,
    })),

  seekTo: (step) =>
    set((s) => ({
      currentStep: Math.max(0, Math.min(step, s.totalSteps - 1)),
      isPlaying: false,
    })),

  setSpeed: (speed) => set({ speed }),

  setSteps: (steps) =>
    set({
      steps,
      totalSteps: steps.length,
      currentStep: 0,
      isPlaying: false,
    }),
}));
