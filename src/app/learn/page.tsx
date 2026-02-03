"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Play,
  Brain,
  Zap,
  Target,
  Layers,
  GitBranch,
  TreeDeciduous,
  BarChart3,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  BookOpen,
  Lock,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Trophy,
  Star,
  GraduationCap,
} from "lucide-react";
import { useProgressSync } from "@/hooks/useProgressSync";

// Course structure with modules and lessons
const courseStructure = [
  {
    id: "arrays",
    title: "Arrays & Strings",
    description: "Master the fundamentals of arrays and string manipulation",
    icon: BarChart3,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    hoverColor: "hover:border-blue-400",
    lessons: [
      { slug: "arrays-intro", title: "Introduction to Arrays", duration: "10 min", xp: 50 },
      { slug: "arrays-operations", title: "Array Operations & Methods", duration: "15 min", xp: 75 },
      { slug: "two-pointer", title: "Two Pointer Technique", duration: "20 min", xp: 100 },
      { slug: "sliding-window", title: "Sliding Window Pattern", duration: "18 min", xp: 120 },
      { slug: "string-manipulation", title: "String Algorithms", duration: "16 min", xp: 100 },
      { slug: "matrix-problems", title: "2D Arrays & Matrices", duration: "22 min", xp: 130 },
    ],
  },
  {
    id: "stacks-queues",
    title: "Stacks & Queues",
    description: "Learn LIFO and FIFO data structures",
    icon: Layers,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    hoverColor: "hover:border-purple-400",
    lessons: [
      { slug: "stack-intro", title: "Introduction to Stacks", duration: "12 min", xp: 50 },
      { slug: "queue-intro", title: "Introduction to Queues", duration: "12 min", xp: 50 },
      { slug: "monotonic-stack", title: "Monotonic Stack", duration: "18 min", xp: 120 },
      { slug: "stack-applications", title: "Stack Applications", duration: "16 min", xp: 100 },
      { slug: "queue-variations", title: "Queue Variations", duration: "15 min", xp: 110 },
    ],
  },
  {
    id: "linked-lists",
    title: "Linked Lists",
    description: "Understand nodes, pointers, and dynamic structures",
    icon: GitBranch,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    hoverColor: "hover:border-green-400",
    lessons: [
      { slug: "linked-list-intro", title: "Introduction to Linked Lists", duration: "15 min", xp: 75 },
      { slug: "linked-list-reversal", title: "Reversing Linked Lists", duration: "18 min", xp: 100 },
      { slug: "fast-slow-pointers", title: "Fast & Slow Pointers", duration: "20 min", xp: 110 },
      { slug: "linked-list-merge", title: "Merging Linked Lists", duration: "16 min", xp: 100 },
      { slug: "advanced-linked-lists", title: "Advanced Problems", duration: "22 min", xp: 120 },
    ],
  },
  {
    id: "trees-graphs",
    title: "Trees & Graphs",
    description: "Explore hierarchical and network data structures",
    icon: TreeDeciduous,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    hoverColor: "hover:border-amber-400",
    lessons: [
      { slug: "tree-intro", title: "Introduction to Trees", duration: "15 min", xp: 75 },
      { slug: "tree-traversals", title: "Tree Traversals", duration: "18 min", xp: 100 },
      { slug: "binary-search-trees", title: "Binary Search Trees", duration: "20 min", xp: 120 },
      { slug: "graph-intro", title: "Introduction to Graphs", duration: "18 min", xp: 100 },
      { slug: "graph-traversals", title: "BFS & DFS", duration: "22 min", xp: 130 },
      { slug: "advanced-graphs", title: "Advanced Graph Algorithms", duration: "25 min", xp: 150 },
    ],
  },
];

// Practice tools
const practiceTools = [
  {
    title: "Algorithm Visualizer",
    description: "Watch algorithms in action",
    href: "/visualizer",
    icon: Play,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Interactive Quizzes",
    description: "Test your knowledge",
    href: "/quiz",
    icon: Brain,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Speed Coding",
    description: "Race against time",
    href: "/speed-coding",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Practice Problems",
    description: "130+ LeetCode problems",
    href: "/practice",
    icon: Target,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Flashcards",
    description: "Quick concept review",
    href: "/flashcards",
    icon: Layers,
    color: "from-blue-500 to-indigo-500",
  },
];

export default function LearnPage() {
  const { data: session } = useSession();
  const { getCompletedLessons, isLoading } = useProgressSync();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    const completed = getCompletedLessons() as Set<string>;
    setCompletedLessons(completed);
  }, [getCompletedLessons]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const isLessonUnlocked = (moduleIndex: number, lessonIndex: number) => {
    // If not logged in, only first lesson of first module is accessible
    if (!session) return moduleIndex === 0 && lessonIndex === 0;

    // First lesson of EVERY module is always unlocked for logged-in users
    if (lessonIndex === 0) return true;
    
    // For subsequent lessons within a module: need previous lesson completed
    const prevLessonSlug = courseStructure[moduleIndex].lessons[lessonIndex - 1].slug;
    return completedLessons.has(prevLessonSlug);
  };

  const getModuleProgress = (module: typeof courseStructure[0]) => {
    const completed = module.lessons.filter(l => completedLessons.has(l.slug)).length;
    return { completed, total: module.lessons.length };
  };

  const getTotalProgress = () => {
    const total = courseStructure.reduce((acc, m) => acc + m.lessons.length, 0);
    const completed = courseStructure.reduce(
      (acc, m) => acc + m.lessons.filter(l => completedLessons.has(l.slug)).length,
      0
    );
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const totalProgress = getTotalProgress();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-4 shadow-sm">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            Learning Path
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Master Data Structures &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
              Algorithms
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Learn with video tutorials, interactive notes, and code examples in 4 languages.
            Complete each module to unlock the next.
          </p>
        </motion.div>

        {/* Overall Progress Card */}
        {session && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-6 bg-white border border-slate-200 rounded-2xl shadow-lg"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Your Progress</h2>
                  <p className="text-slate-600">
                    {totalProgress.completed} of {totalProgress.total} lessons completed
                  </p>
                </div>
              </div>
              
              <div className="flex-1 max-w-md w-full">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600">Course Progress</span>
                  <span className="text-purple-600 font-semibold">{totalProgress.percentage}%</span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${totalProgress.percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">{totalProgress.completed}</div>
                  <div className="text-xs text-slate-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {courseStructure.reduce((acc, m) => 
                      acc + m.lessons.filter(l => completedLessons.has(l.slug)).reduce((a, l) => a + l.xp, 0)
                    , 0)}
                  </div>
                  <div className="text-xs text-slate-600">XP Earned</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Not logged in notice */}
        {!session && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-4 shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-amber-800 font-medium">Sign in to unlock all lessons</p>
              <p className="text-amber-600 text-sm">Track your progress and unlock modules as you learn</p>
            </div>
            <Link
              href="/auth/signin"
              className="ml-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-md"
            >
              Sign In
            </Link>
          </motion.div>
        )}

        {/* Course Modules */}
        <div className="space-y-4 mb-16">
          {courseStructure.map((module, moduleIndex) => {
            const Icon = module.icon;
            const progress = getModuleProgress(module);
            const isExpanded = expandedModules.has(module.id);
            const isModuleCompleted = progress.completed === progress.total;
            // All modules accessible now - first lesson of each module is unlocked
            const isModuleLocked = false;

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: moduleIndex * 0.1 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg ${
                  isModuleLocked 
                    ? "bg-gray-100 border-gray-200" 
                    : "bg-white border-gray-200 hover:shadow-xl hover:border-purple-200"
                }`}
              >
                {/* Module Header */}
                <button
                  onClick={() => !isModuleLocked && toggleModule(module.id)}
                  disabled={isModuleLocked}
                  className={`w-full p-5 flex items-center gap-4 text-left transition-colors ${
                    isModuleLocked ? "cursor-not-allowed opacity-60" : "hover:bg-purple-50/50"
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                    isModuleLocked
                      ? "bg-gray-200"
                      : `bg-gradient-to-br ${module.color}`
                  }`}>
                    {isModuleLocked ? (
                      <Lock className="w-6 h-6 text-gray-400" />
                    ) : isModuleCompleted ? (
                      <CheckCircle className="w-7 h-7 text-white" />
                    ) : (
                      <Icon className="w-7 h-7 text-white" />
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-lg font-bold ${isModuleLocked ? "text-gray-400" : "text-gray-800"}`}>
                        {module.title}
                      </h3>
                      {isModuleCompleted && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${isModuleLocked ? "text-gray-400" : "text-gray-500"}`}>
                      {module.description}
                    </p>
                  </div>

                  {/* Progress & Expand */}
                  <div className="flex items-center gap-4">
                    {!isModuleLocked && (
                      <div className="hidden sm:block text-right">
                        <div className={`text-sm font-medium ${isModuleCompleted ? "text-green-600" : "text-gray-700"}`}>
                          {progress.completed}/{progress.total}
                        </div>
                        <div className="text-xs text-gray-400">lessons</div>
                      </div>
                    )}
                    
                    {!isModuleLocked && (
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <ChevronDown
                          className={`w-5 h-5 text-purple-500 transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </button>

                {/* Lessons List */}
                <AnimatePresence>
                  {isExpanded && !isModuleLocked && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <div className="border-t border-gray-100 pt-4">
                          <div className="space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => {
                              const isCompleted = completedLessons.has(lesson.slug);
                              const isUnlocked = isLessonUnlocked(moduleIndex, lessonIndex);
                              const isNext = !isCompleted && isUnlocked;

                              return (
                                <div key={lesson.slug}>
                                  {isUnlocked ? (
                                    <Link
                                      href={`/learn/${lesson.slug}`}
                                      className={`group flex items-center gap-4 p-4 rounded-xl transition-all ${
                                        isNext
                                          ? "bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 hover:border-blue-400 shadow-sm"
                                          : isCompleted
                                          ? "bg-green-50 border border-green-200 hover:border-green-400"
                                          : "bg-gray-50 border border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                                      }`}
                                    >
                                      {/* Lesson Status Icon */}
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                                        isCompleted
                                          ? "bg-green-500"
                                          : isNext
                                          ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                                          : "bg-gray-300"
                                      }`}>
                                        {isCompleted ? (
                                          <CheckCircle className="w-5 h-5 text-white" />
                                        ) : (
                                          <Play className="w-4 h-4 text-white ml-0.5" />
                                        )}
                                      </div>

                                      {/* Lesson Info */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className={`font-medium ${isCompleted ? "text-green-700" : "text-gray-800"}`}>
                                            {lesson.title}
                                          </span>
                                          {isNext && (
                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs font-medium rounded-full animate-pulse">
                                              Up Next
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                          <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {lesson.duration}
                                          </span>
                                          <span className="flex items-center gap-1 text-amber-500">
                                            <Star className="w-3 h-3 fill-current" />
                                            {lesson.xp} XP
                                          </span>
                                        </div>
                                      </div>

                                      {/* Arrow */}
                                      <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
                                        isCompleted ? "text-green-500" : "text-gray-400"
                                      }`} />
                                    </Link>
                                  ) : (
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-100 border border-gray-200 opacity-60">
                                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                        <Lock className="w-4 h-4 text-gray-400" />
                                      </div>
                                      <div className="flex-1">
                                        <span className="font-medium text-gray-400">{lesson.title}</span>
                                        <div className="text-xs text-gray-400 mt-1">
                                          Complete the previous lesson to unlock
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Practice Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-md">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Practice Tools</h2>
              <p className="text-sm text-gray-500">Apply what you&apos;ve learned</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {practiceTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group p-5 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all shadow-sm"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: BookOpen, label: "Video Lessons", value: "50+", color: "text-purple-500" },
            { icon: Brain, label: "Quiz Questions", value: "200+", color: "text-pink-500" },
            { icon: Target, label: "Practice Problems", value: "130+", color: "text-cyan-500" },
            { icon: Award, label: "Achievements", value: "20+", color: "text-amber-500" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white border border-gray-200 rounded-xl p-5 text-center hover:border-purple-200 hover:shadow-md transition-all shadow-sm"
              >
                <Icon className={`w-7 h-7 ${stat.color} mx-auto mb-3`} />
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
