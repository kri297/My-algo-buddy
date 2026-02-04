import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { ThemeMode } from "@/types";

interface SettingsState {
  theme: ThemeMode;
  sidebarCollapsed: boolean;
  soundEnabled: boolean;
  showLineNumbers: boolean;
  fontSize: number;
  autoPlay: boolean;

  setTheme: (theme: ThemeMode) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSound: () => void;
  setShowLineNumbers: (show: boolean) => void;
  setFontSize: (size: number) => void;
  setAutoPlay: (autoPlay: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    immer((set) => ({
      theme: "system",
      sidebarCollapsed: false,
      soundEnabled: true,
      showLineNumbers: true,
      fontSize: 14,
      autoPlay: false,

      setTheme: (theme) =>
        set((state) => {
          state.theme = theme;
        }),

      toggleSidebar: () =>
        set((state) => {
          state.sidebarCollapsed = !state.sidebarCollapsed;
        }),

      setSidebarCollapsed: (collapsed) =>
        set((state) => {
          state.sidebarCollapsed = collapsed;
        }),

      toggleSound: () =>
        set((state) => {
          state.soundEnabled = !state.soundEnabled;
        }),

      setShowLineNumbers: (show) =>
        set((state) => {
          state.showLineNumbers = show;
        }),

      setFontSize: (size) =>
        set((state) => {
          state.fontSize = size;
        }),

      setAutoPlay: (autoPlay) =>
        set((state) => {
          state.autoPlay = autoPlay;
        }),
    })),
    {
      name: "algo-buddy-settings",
    }
  )
);
