import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  AnimationSpeed,
  ArrayElement,
  AlgorithmStep,
  Language,
  VisualizationConfig,
} from "@/types";
import { ANIMATION_SPEEDS } from "@/constants/theme";

interface VisualizationState {
  // Array state
  array: ArrayElement[];
  originalArray: number[];

  // Animation state
  isPlaying: boolean;
  isPaused: boolean;
  currentStep: number;
  steps: AlgorithmStep[];
  speed: AnimationSpeed;
  animationTimer: NodeJS.Timeout | null;

  // History for time-travel
  history: ArrayElement[][];
  historyIndex: number;

  // Config
  config: VisualizationConfig;

  // Actions
  setArray: (arr: number[]) => void;
  setArrayElements: (elements: ArrayElement[]) => void;
  updateElement: (index: number, updates: Partial<ArrayElement>) => void;
  resetElementStates: () => void;

  setSteps: (steps: AlgorithmStep[]) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  play: () => void;
  pause: () => void;
  stop: () => void;
  setSpeed: (speed: AnimationSpeed) => void;

  setConfig: (config: Partial<VisualizationConfig>) => void;
  setLanguage: (language: Language) => void;

  // History actions
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

const defaultConfig: VisualizationConfig = {
  showCode: true,
  showComplexity: true,
  showVariables: true,
  showStepDescription: true,
  splitView: "horizontal",
  codeLanguage: "c",
  animationSpeed: "medium",
};

export const useVisualizationStore = create<VisualizationState>()(
  immer((set, get) => ({
    array: [],
    originalArray: [],
    isPlaying: false,
    isPaused: false,
    currentStep: 0,
    steps: [],
    speed: "medium",
    animationTimer: null,
    history: [],
    historyIndex: -1,
    config: defaultConfig,

    setArray: (arr) =>
      set((state) => {
        state.originalArray = [...arr];
        state.array = arr.map((value, index) => ({
          id: `element-${index}`,
          value,
          index,
          isHighlighted: false,
          isComparing: false,
          isSwapping: false,
          isSorted: false,
        }));
        state.currentStep = 0;
        state.steps = [];
        state.isPlaying = false;
        state.isPaused = false;
      }),

    setArrayElements: (elements) =>
      set((state) => {
        state.array = elements;
      }),

    updateElement: (index, updates) =>
      set((state) => {
        if (state.array[index]) {
          state.array[index] = { ...state.array[index], ...updates };
        }
      }),

    resetElementStates: () =>
      set((state) => {
        state.array = state.array.map((el) => ({ ...el, state: "default" }));
      }),

    setSteps: (steps) =>
      set((state) => {
        state.steps = steps;
        state.currentStep = 0;
      }),

    goToStep: (step) =>
      set((state) => {
        if (step >= 0 && step < state.steps.length) {
          state.currentStep = step;
          const stepData = state.steps[step];
          if (stepData.arrayState) {
            state.array = stepData.arrayState;
          }
        }
      }),

    nextStep: () => {
      const { currentStep, steps, goToStep } = get();
      if (currentStep < steps.length - 1) {
        goToStep(currentStep + 1);
      } else {
        get().stop();
      }
    },

    prevStep: () => {
      const { currentStep, goToStep } = get();
      if (currentStep > 0) {
        goToStep(currentStep - 1);
      }
    },

    play: () => {
      const { speed, nextStep, steps, currentStep } = get();
      if (currentStep >= steps.length - 1) {
        get().goToStep(0);
      }

      set((state) => {
        state.isPlaying = true;
        state.isPaused = false;
      });

      const intervalTime = ANIMATION_SPEEDS[speed];
      if (intervalTime === 0) {
        // Instant - go to end
        get().goToStep(steps.length - 1);
        get().stop();
        return;
      }

      const timer = setInterval(() => {
        const { currentStep: curr, steps: s, isPlaying } = get();
        if (!isPlaying || curr >= s.length - 1) {
          clearInterval(timer);
          set((state) => {
            state.isPlaying = false;
            state.animationTimer = null;
          });
          return;
        }
        nextStep();
      }, intervalTime);

      set((state) => {
        state.animationTimer = timer;
      });
    },

    pause: () =>
      set((state) => {
        state.isPaused = true;
        state.isPlaying = false;
        if (state.animationTimer) {
          clearInterval(state.animationTimer);
          state.animationTimer = null;
        }
      }),

    stop: () =>
      set((state) => {
        state.isPlaying = false;
        state.isPaused = false;
        if (state.animationTimer) {
          clearInterval(state.animationTimer);
          state.animationTimer = null;
        }
      }),

    setSpeed: (speed) =>
      set((state) => {
        state.speed = speed;
        state.config.animationSpeed = speed;
      }),

    setConfig: (newConfig) =>
      set((state) => {
        state.config = { ...state.config, ...newConfig };
      }),

    setLanguage: (language) =>
      set((state) => {
        state.config.codeLanguage = language;
      }),

    saveToHistory: () =>
      set((state) => {
        const currentArray = JSON.parse(JSON.stringify(state.array));
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push(currentArray);
        state.historyIndex = state.history.length - 1;
      }),

    undo: () =>
      set((state) => {
        if (state.historyIndex > 0) {
          state.historyIndex--;
          state.array = JSON.parse(
            JSON.stringify(state.history[state.historyIndex])
          );
        }
      }),

    redo: () =>
      set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          state.historyIndex++;
          state.array = JSON.parse(
            JSON.stringify(state.history[state.historyIndex])
          );
        }
      }),

    clearHistory: () =>
      set((state) => {
        state.history = [];
        state.historyIndex = -1;
      }),
  }))
);
