import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Achievement, DifficultyLevel } from "@/types";

// Simplified module type for the progress store
export interface SimpleLearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  category: string;
  topics: string[];
  estimatedTime: number;
  isCompleted: boolean;
  progress: number;
}

interface ProgressState {
  // State
  totalXP: number;
  level: number;
  completedModules: string[];
  achievements: Achievement[];
  streakDays: number;
  lastActiveDate: Date;
  
  // Actions
  addXP: (amount: number) => void;
  completeModule: (moduleId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  updateStreak: () => void;
  resetProgress: () => void;
}

// Initial achievements
const initialAchievements: Achievement[] = [
  {
    id: "first-sort",
    title: "First Sort",
    description: "Complete your first sorting visualization",
    icon: "🎯",
    isUnlocked: false,
    progress: 0,
    target: 1,
  },
  {
    id: "sort-master",
    title: "Sort Master",
    description: "Complete all sorting algorithms",
    icon: "🏆",
    isUnlocked: false,
    progress: 0,
    target: 6,
  },
  {
    id: "graph-explorer",
    title: "Graph Explorer",
    description: "Complete 5 graph traversals",
    icon: "🌐",
    isUnlocked: false,
    progress: 0,
    target: 5,
  },
  {
    id: "speed-demon",
    title: "Speed Demon",
    description: "Complete a visualization in under 10 seconds",
    icon: "⚡",
    isUnlocked: false,
    progress: 0,
    target: 1,
  },
  {
    id: "week-streak",
    title: "Week Warrior",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    isUnlocked: false,
    progress: 0,
    target: 7,
  },
  {
    id: "code-polyglot",
    title: "Code Polyglot",
    description: "View code in all 4 programming languages",
    icon: "🌍",
    isUnlocked: false,
    progress: 0,
    target: 4,
  },
  {
    id: "tree-hugger",
    title: "Tree Hugger",
    description: "Complete all tree operations",
    icon: "🌳",
    isUnlocked: false,
    progress: 0,
    target: 5,
  },
  {
    id: "bug-hunter",
    title: "Bug Hunter",
    description: "Find 10 bugs in challenge mode",
    icon: "🐛",
    isUnlocked: false,
    progress: 0,
    target: 10,
  },
];

export const useProgressStore = create<ProgressState>()(
  persist(
    immer((set, get) => ({
      totalXP: 0,
      level: 1,
      completedModules: [],
      achievements: initialAchievements,
      streakDays: 0,
      lastActiveDate: new Date(),

      addXP: (amount) =>
        set((state) => {
          state.totalXP += amount;
          // Level up every 1000 XP
          state.level = Math.floor(state.totalXP / 1000) + 1;
        }),

      completeModule: (moduleId) =>
        set((state) => {
          if (!state.completedModules.includes(moduleId)) {
            state.completedModules.push(moduleId);
          }
        }),

      unlockAchievement: (achievementId) =>
        set((state) => {
          const achievement = state.achievements.find(
            (a) => a.id === achievementId
          );
          if (achievement && !achievement.isUnlocked) {
            achievement.isUnlocked = true;
            achievement.unlockedAt = new Date();
            achievement.progress = achievement.target;
          }
        }),

      updateStreak: () =>
        set((state) => {
          const now = new Date();
          const lastActive = new Date(state.lastActiveDate);
          const diffDays = Math.floor(
            (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (diffDays === 1) {
            state.streakDays += 1;
          } else if (diffDays > 1) {
            state.streakDays = 1;
          }
          state.lastActiveDate = now;

          // Update week streak achievement
          const streakAchievement = state.achievements.find(
            (a) => a.id === "week-streak"
          );
          if (streakAchievement) {
            streakAchievement.progress = Math.min(
              state.streakDays,
              streakAchievement.target
            );
            if (state.streakDays >= 7 && !streakAchievement.isUnlocked) {
              streakAchievement.isUnlocked = true;
              streakAchievement.unlockedAt = new Date();
            }
          }
        }),

      resetProgress: () =>
        set((state) => {
          state.totalXP = 0;
          state.level = 1;
          state.completedModules = [];
          state.achievements = initialAchievements;
          state.streakDays = 0;
          state.lastActiveDate = new Date();
        }),
    })),
    {
      name: "algo-buddy-progress",
    }
  )
);

// Learning modules data (for reference, could be moved to constants)
export const LEARNING_MODULES: SimpleLearningModule[] = [
  {
    id: "arrays-basics",
    title: "Arrays Fundamentals",
    description:
      "Learn about arrays, indexing, and basic operations like traversal and manipulation.",
    difficulty: "beginner",
    category: "Data Structures",
    topics: ["Arrays", "Indexing", "Traversal"],
    estimatedTime: 20,
    isCompleted: false,
    progress: 0,
  },
  {
    id: "bubble-sort",
    title: "Bubble Sort",
    description:
      "Master the bubble sort algorithm with step-by-step visualization.",
    difficulty: "beginner",
    category: "Sorting",
    topics: ["Bubble Sort", "Comparison Sort", "Stable Sort"],
    estimatedTime: 15,
    isCompleted: false,
    progress: 0,
  },
  {
    id: "selection-sort",
    title: "Selection Sort",
    description:
      "Learn selection sort by finding minimum elements and building sorted array.",
    difficulty: "beginner",
    category: "Sorting",
    topics: ["Selection Sort", "In-place Sort"],
    estimatedTime: 15,
    isCompleted: false,
    progress: 0,
  },
  {
    id: "insertion-sort",
    title: "Insertion Sort",
    description:
      "Understand insertion sort by building sorted array one element at a time.",
    difficulty: "beginner",
    category: "Sorting",
    topics: ["Insertion Sort", "Stable Sort", "Online Algorithm"],
    estimatedTime: 15,
    isCompleted: false,
    progress: 0,
  },
  {
    id: "merge-sort",
    title: "Merge Sort",
    description:
      "Master divide and conquer with merge sort visualization and analysis.",
    difficulty: "intermediate",
    category: "Sorting",
    topics: ["Merge Sort", "Divide and Conquer", "Recursion"],
    estimatedTime: 25,
    isCompleted: false,
    progress: 0,
  },
  {
    id: "quick-sort",
    title: "Quick Sort",
    description:
      "Learn the quick sort algorithm with pivot selection and partitioning.",
    difficulty: "intermediate",
    category: "Sorting",
    topics: ["Quick Sort", "Partition", "Pivot"],
    estimatedTime: 30,
    isCompleted: false,
    progress: 0,
  },
  {
    id: "binary-search",
    title: "Binary Search",
    description:
      "Efficient searching in sorted arrays with logarithmic time complexity.",
    difficulty: "beginner",
    category: "Searching",
    topics: ["Binary Search", "Divide and Conquer"],
    estimatedTime: 20,
    isCompleted: false,
    progress: 0,
  },
  {
    id: "linked-lists",
    title: "Linked Lists",
    description: "Understand singly and doubly linked lists with operations.",
    difficulty: "beginner",
    category: "Data Structures",
    topics: ["Linked List", "Nodes", "Pointers"],
    estimatedTime: 30,
    isCompleted: false,
    progress: 0,
  },
  {
    id: "stacks-queues",
    title: "Stacks & Queues",
    description: "Learn LIFO and FIFO data structures with real-world examples.",
    difficulty: "beginner",
    category: "Data Structures",
    topics: ["Stack", "Queue", "LIFO", "FIFO"],
    estimatedTime: 25,
    isCompleted: false,
    progress: 0,
  },
  {
    id: "binary-trees",
    title: "Binary Trees",
    description:
      "Introduction to binary trees, traversals, and tree properties.",
    difficulty: "intermediate",
    category: "Data Structures",
    topics: ["Binary Tree", "Traversal", "Tree Height"],
    estimatedTime: 35,
    isCompleted: false,
    progress: 0,
  },
  {
    id: "bst",
    title: "Binary Search Trees",
    description: "Learn BST operations: insert, delete, search with balancing.",
    difficulty: "intermediate",
    category: "Data Structures",
    topics: ["BST", "Tree Operations", "Balancing"],
    estimatedTime: 40,
    isCompleted: false,
    progress: 0,
  },
  {
    id: "graph-basics",
    title: "Graph Fundamentals",
    description:
      "Introduction to graphs, representations, and basic terminology.",
    difficulty: "intermediate",
    category: "Data Structures",
    topics: ["Graph", "Adjacency List", "Adjacency Matrix"],
    estimatedTime: 30,
    isCompleted: false,
    progress: 0,
  },
  {
    id: "bfs-dfs",
    title: "BFS & DFS",
    description: "Master graph traversal with BFS and DFS algorithms.",
    difficulty: "intermediate",
    category: "Graph Algorithms",
    topics: ["BFS", "DFS", "Graph Traversal"],
    estimatedTime: 40,
    isCompleted: false,
    progress: 0,
  },
  {
    id: "dijkstra",
    title: "Dijkstra's Algorithm",
    description: "Find shortest paths in weighted graphs.",
    difficulty: "advanced",
    category: "Graph Algorithms",
    topics: ["Dijkstra", "Shortest Path", "Priority Queue"],
    estimatedTime: 45,
    isCompleted: false,
    progress: 0,
  },
  {
    id: "heaps",
    title: "Heaps & Priority Queues",
    description: "Learn heap data structure and its applications.",
    difficulty: "intermediate",
    category: "Data Structures",
    topics: ["Heap", "Priority Queue", "Heapify"],
    estimatedTime: 35,
    isCompleted: false,
    progress: 0,
  },
  {
    id: "dp-intro",
    title: "Dynamic Programming Intro",
    description: "Introduction to dynamic programming concepts and patterns.",
    difficulty: "advanced",
    category: "Dynamic Programming",
    topics: ["Memoization", "Tabulation", "Optimal Substructure"],
    estimatedTime: 50,
    isCompleted: false,
    progress: 0,
  },
];
