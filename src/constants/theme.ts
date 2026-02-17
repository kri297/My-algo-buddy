// Color palette for visualizations
export const VISUALIZATION_COLORS = {
  // Element states
  default: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-slate-700",
    fill: "#dbeafe",
  },
  comparing: {
    bg: "bg-yellow-200",
    border: "border-yellow-400",
    text: "text-yellow-900",
    fill: "#fbbf24",
  },
  swapping: {
    bg: "bg-orange-200",
    border: "border-orange-400",
    text: "text-orange-900",
    fill: "#f97316",
  },
  sorted: {
    bg: "bg-green-200",
    border: "border-green-400",
    text: "text-green-900",
    fill: "#22c55e",
  },
  pivot: {
    bg: "bg-blue-200",
    border: "border-blue-400",
    text: "text-blue-900",
    fill: "#3b82f6",
  },
  selected: {
    bg: "bg-blue-200",
    border: "border-blue-400",
    text: "text-blue-900",
    fill: "#3b82f6",
  },
  current: {
    bg: "bg-cyan-200",
    border: "border-cyan-400",
    text: "text-cyan-900",
    fill: "#06b6d4",
  },
  visited: {
    bg: "bg-indigo-200",
    border: "border-indigo-400",
    text: "text-indigo-900",
    fill: "#6366f1",
  },
  found: {
    bg: "bg-emerald-200",
    border: "border-emerald-400",
    text: "text-emerald-900",
    fill: "#10b981",
  },
  queued: {
    bg: "bg-amber-200",
    border: "border-amber-400",
    text: "text-amber-900",
    fill: "#f59e0b",
  },
  // Data structure specific states
  new: {
    bg: "bg-green-300",
    border: "border-green-500",
    text: "text-green-900",
    fill: "#22c55e",
  },
  top: {
    bg: "bg-blue-300",
    border: "border-blue-500",
    text: "text-blue-900",
    fill: "#3b82f6",
  },
  popping: {
    bg: "bg-red-300",
    border: "border-red-500",
    text: "text-red-900",
    fill: "#ef4444",
  },
  front: {
    bg: "bg-blue-300 dark:bg-blue-600",
    border: "border-blue-500 dark:border-blue-400",
    text: "text-blue-900 dark:text-blue-100",
    fill: "#3b82f6",
  },
  rear: {
    bg: "bg-purple-300 dark:bg-purple-600",
    border: "border-purple-500 dark:border-purple-400",
    text: "text-purple-900 dark:text-purple-100",
    fill: "#a855f7",
  },
  dequeuing: {
    bg: "bg-red-300 dark:bg-red-600",
    border: "border-red-500 dark:border-red-400",
    text: "text-red-900 dark:text-red-100",
    fill: "#ef4444",
  },
  deleting: {
    bg: "bg-red-300 dark:bg-red-600",
    border: "border-red-500 dark:border-red-400",
    text: "text-red-900 dark:text-red-100",
    fill: "#ef4444",
  },
} as const;

// Animation speed presets (in milliseconds)
export const ANIMATION_SPEEDS = {
  slow: 2000,
  normal: 1200,
  medium: 1200,
  fast: 500,
  instant: 0,
} as const;

// Graph visualization defaults
export const GRAPH_DEFAULTS = {
  nodeRadius: 25,
  linkDistance: 150,
  chargeStrength: -400,
  arrowSize: 10,
} as const;

// Tree visualization defaults
export const TREE_DEFAULTS = {
  nodeRadius: 22,
  levelHeight: 80,
  siblingDistance: 50,
} as const;

// Array visualization defaults
export const ARRAY_DEFAULTS = {
  elementWidth: 50,
  elementHeight: 50,
  gap: 4,
  maxElements: 20,
} as const;

// Code editor themes
export const EDITOR_THEMES = {
  light: "vs-light",
  dark: "vs-dark",
} as const;

// Difficulty colors
export const DIFFICULTY_COLORS = {
  beginner: "text-green-500 bg-green-100 dark:bg-green-900/30",
  intermediate: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30",
  advanced: "text-orange-500 bg-orange-100 dark:bg-orange-900/30",
  expert: "text-red-500 bg-red-100 dark:bg-red-900/30",
} as const;

// Category icons and colors
export const CATEGORY_STYLES = {
  sorting: {
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    icon: "ArrowUpDown",
  },
  searching: {
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    icon: "Search",
  },
  graph: {
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    icon: "GitBranch",
  },
  tree: {
    color: "text-amber-500",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    icon: "TreeDeciduous",
  },
  dynamic: {
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    icon: "Layers",
  },
  backtracking: {
    color: "text-indigo-500",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    icon: "RotateCcw",
  },
} as const;
