import Link from "next/link";
import { Trophy, Target, Zap, Brain, ArrowRight, Lock } from "lucide-react";
import { DifficultyBadge } from "@/components/ui";
import type { DifficultyLevel } from "@/types";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  type: "debug" | "predict" | "implement" | "optimize";
  category: string;
  xpReward: number;
  isLocked: boolean;
  isCompleted: boolean;
}

const challenges: Challenge[] = [
  {
    id: "debug-bubble-sort",
    title: "Fix the Bubble Sort",
    description: "Find and fix the bug in this bubble sort implementation that causes an infinite loop.",
    difficulty: "beginner",
    type: "debug",
    category: "Sorting",
    xpReward: 50,
    isLocked: false,
    isCompleted: false,
  },
  {
    id: "predict-binary-search",
    title: "Predict Binary Search",
    description: "Given an array and target, predict which indices will be checked by binary search.",
    difficulty: "beginner",
    type: "predict",
    category: "Searching",
    xpReward: 40,
    isLocked: false,
    isCompleted: false,
  },
  {
    id: "implement-insertion-sort",
    title: "Implement Insertion Sort",
    description: "Complete the insertion sort implementation with the missing lines of code.",
    difficulty: "beginner",
    type: "implement",
    category: "Sorting",
    xpReward: 60,
    isLocked: false,
    isCompleted: false,
  },
  {
    id: "optimize-two-sum",
    title: "Optimize Two Sum",
    description: "Improve the brute force O(n²) solution to O(n) using a hash map.",
    difficulty: "intermediate",
    type: "optimize",
    category: "Arrays",
    xpReward: 80,
    isLocked: true,
    isCompleted: false,
  },
  {
    id: "debug-merge-sort",
    title: "Fix Merge Sort",
    description: "The merge function has a bug causing incorrect results. Find and fix it.",
    difficulty: "intermediate",
    type: "debug",
    category: "Sorting",
    xpReward: 100,
    isLocked: true,
    isCompleted: false,
  },
  {
    id: "predict-dfs",
    title: "Predict DFS Order",
    description: "Given a graph, predict the order of nodes visited by depth-first search.",
    difficulty: "intermediate",
    type: "predict",
    category: "Graphs",
    xpReward: 90,
    isLocked: true,
    isCompleted: false,
  },
  {
    id: "implement-quick-sort",
    title: "Implement Quick Sort",
    description: "Implement the partition function for quick sort algorithm.",
    difficulty: "advanced",
    type: "implement",
    category: "Sorting",
    xpReward: 120,
    isLocked: true,
    isCompleted: false,
  },
  {
    id: "optimize-fibonacci",
    title: "Optimize Fibonacci",
    description: "Convert recursive Fibonacci to dynamic programming solution.",
    difficulty: "advanced",
    type: "optimize",
    category: "Dynamic Programming",
    xpReward: 150,
    isLocked: true,
    isCompleted: false,
  },
];

const typeIcons = {
  debug: { icon: Target, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
  predict: { icon: Brain, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
  implement: { icon: Zap, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  optimize: { icon: Trophy, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
};

export default function ChallengesPage() {
  const completedCount = challenges.filter((c) => c.isCompleted).length;
  const totalXP = challenges.reduce((sum, c) => sum + (c.isCompleted ? c.xpReward : 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Challenges</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Test your skills with debugging, prediction, and implementation challenges
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          {Object.entries(typeIcons).map(([type, { icon: Icon, color, bg }]) => (
            <div
              key={type}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4"
            >
              <div className={`inline-flex p-2 rounded-lg ${bg} mb-2`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                {type}
              </p>
              <p className="text-2xl font-bold">
                {challenges.filter((c) => c.type === type && c.isCompleted).length}/
                {challenges.filter((c) => c.type === type).length}
              </p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold">Overall Progress</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {completedCount} of {challenges.length} challenges completed
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-amber-500">{totalXP} XP</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">earned</p>
            </div>
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-500"
              style={{ width: `${(completedCount / challenges.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Challenge Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((challenge) => {
            const typeInfo = typeIcons[challenge.type];
            const Icon = typeInfo.icon;

            return (
              <div
                key={challenge.id}
                className={`group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 transition-all duration-200 ${
                  challenge.isLocked
                    ? "opacity-60"
                    : "hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg cursor-pointer"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-lg ${typeInfo.bg}`}>
                    <Icon className={`w-5 h-5 ${typeInfo.color}`} />
                  </div>
                  {challenge.isLocked ? (
                    <Lock className="w-5 h-5 text-slate-400" />
                  ) : (
                    <DifficultyBadge difficulty={challenge.difficulty} />
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-2">{challenge.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {challenge.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                    {challenge.category}
                  </span>
                  <span className="text-sm font-medium text-amber-500">
                    +{challenge.xpReward} XP
                  </span>
                </div>

                {!challenge.isLocked && (
                  <Link
                    href={`/challenges/${challenge.id}`}
                    className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Start Challenge
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
