import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AnimationSpeed,
  AnimationState,
  VisualizationStep,
  ProgrammingLanguage,
  Theme,
  UserSettings,
  UserProgress,
  Achievement,
} from "@/types";

// ============================================
// VISUALIZATION STORE
// ============================================
interface VisualizationState {
  // Animation controls
  animation: AnimationState;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  setCurrentStep: (step: number) => void;
  setSpeed: (speed: AnimationSpeed) => void;
  addStep: (step: VisualizationStep) => void;
  clearHistory: () => void;
  goToStep: (step: number) => void;
  
  // Data
  data: unknown[];
  setData: (data: unknown[]) => void;
  
  // Code highlighting
  highlightedLines: number[];
  setHighlightedLines: (lines: number[]) => void;
  
  // Variables panel
  variables: Record<string, unknown>;
  setVariable: (name: string, value: unknown) => void;
  clearVariables: () => void;
}

export const useVisualizationStore = create<VisualizationState>((set, get) => ({
  animation: {
    isPlaying: false,
    isPaused: false,
    currentStep: 0,
    totalSteps: 0,
    speed: "normal",
    history: [],
  },
  
  setIsPlaying: (isPlaying) =>
    set((state) => ({
      animation: { ...state.animation, isPlaying, isPaused: false },
    })),
    
  setIsPaused: (isPaused) =>
    set((state) => ({
      animation: { ...state.animation, isPaused },
    })),
    
  setCurrentStep: (currentStep) =>
    set((state) => ({
      animation: { ...state.animation, currentStep },
    })),
    
  setSpeed: (speed) =>
    set((state) => ({
      animation: { ...state.animation, speed },
    })),
    
  addStep: (step) =>
    set((state) => ({
      animation: {
        ...state.animation,
        history: [...state.animation.history, step],
        totalSteps: state.animation.history.length + 1,
      },
    })),
    
  clearHistory: () =>
    set((state) => ({
      animation: {
        ...state.animation,
        history: [],
        currentStep: 0,
        totalSteps: 0,
      },
    })),
    
  goToStep: (step) => {
    const { animation } = get();
    if (step >= 0 && step < animation.history.length) {
      set({ animation: { ...animation, currentStep: step } });
    }
  },
  
  data: [],
  setData: (data) => set({ data }),
  
  highlightedLines: [],
  setHighlightedLines: (highlightedLines) => set({ highlightedLines }),
  
  variables: {},
  setVariable: (name, value) =>
    set((state) => ({
      variables: { ...state.variables, [name]: value },
    })),
  clearVariables: () => set({ variables: {} }),
}));

// ============================================
// USER SETTINGS STORE
// ============================================
interface SettingsState {
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: UserSettings = {
  theme: "system",
  defaultLanguage: "c",
  animationSpeed: "normal",
  showCodeHighlighting: true,
  showVariablePanel: true,
  enableSound: false,
  enableVoiceNarration: false,
  fontSize: 14,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: "algo-buddy-settings",
    }
  )
);

// ============================================
// USER PROGRESS STORE
// ============================================
interface ProgressState {
  progress: UserProgress;
  completeModule: (moduleId: string) => void;
  completeTopic: (topicId: string) => void;
  completeExercise: (exerciseId: string, points: number) => void;
  addAchievement: (achievement: Achievement) => void;
  updateStreak: () => void;
}

const defaultProgress: UserProgress = {
  userId: "",
  completedModules: [],
  completedTopics: [],
  completedExercises: [],
  totalPoints: 0,
  achievements: [],
  streak: 0,
  lastActivity: new Date(),
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      progress: defaultProgress,
      
      completeModule: (moduleId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            completedModules: [...new Set([...state.progress.completedModules, moduleId])],
          },
        })),
        
      completeTopic: (topicId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            completedTopics: [...new Set([...state.progress.completedTopics, topicId])],
          },
        })),
        
      completeExercise: (exerciseId, points) =>
        set((state) => ({
          progress: {
            ...state.progress,
            completedExercises: [...new Set([...state.progress.completedExercises, exerciseId])],
            totalPoints: state.progress.totalPoints + points,
          },
        })),
        
      addAchievement: (achievement) =>
        set((state) => ({
          progress: {
            ...state.progress,
            achievements: [...state.progress.achievements, achievement],
          },
        })),
        
      updateStreak: () =>
        set((state) => {
          const lastActivity = new Date(state.progress.lastActivity);
          const today = new Date();
          const diffDays = Math.floor(
            (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          return {
            progress: {
              ...state.progress,
              streak: diffDays === 1 ? state.progress.streak + 1 : diffDays === 0 ? state.progress.streak : 1,
              lastActivity: today,
            },
          };
        }),
    }),
    {
      name: "algo-buddy-progress",
    }
  )
);

// ============================================
// CODE EDITOR STORE
// ============================================
interface CodeEditorState {
  language: ProgrammingLanguage;
  code: string;
  setLanguage: (language: ProgrammingLanguage) => void;
  setCode: (code: string) => void;
  compareMode: boolean;
  toggleCompareMode: () => void;
  secondaryCode: string;
  setSecondaryCode: (code: string) => void;
}

export const useCodeEditorStore = create<CodeEditorState>((set) => ({
  language: "c",
  code: "",
  setLanguage: (language) => set({ language }),
  setCode: (code) => set({ code }),
  compareMode: false,
  toggleCompareMode: () => set((state) => ({ compareMode: !state.compareMode })),
  secondaryCode: "",
  setSecondaryCode: (secondaryCode) => set({ secondaryCode }),
}));
