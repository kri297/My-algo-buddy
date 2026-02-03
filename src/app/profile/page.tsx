"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Trophy,
  Flame,
  Target,
  BookOpen,
  Code2,
  Calendar,
  TrendingUp,
  Award,
  Settings,
  ChevronRight,
} from "lucide-react";
import { Button, Card, Progress, CircularProgress, Badge } from "@/components/ui";
import { useProgressStore, useSettingsStore } from "@/store";
import { cn } from "@/lib/utils";

const activityData = [
  { day: "Mon", count: 5 },
  { day: "Tue", count: 8 },
  { day: "Wed", count: 3 },
  { day: "Thu", count: 12 },
  { day: "Fri", count: 7 },
  { day: "Sat", count: 15 },
  { day: "Sun", count: 2 },
];

const recentActivity = [
  {
    type: "lesson",
    title: "Completed Arrays Module",
    points: 50,
    time: "2 hours ago",
    icon: BookOpen,
  },
  {
    type: "exercise",
    title: "Solved Two Sum Challenge",
    points: 100,
    time: "5 hours ago",
    icon: Code2,
  },
  {
    type: "achievement",
    title: 'Earned "Quick Learner" badge',
    points: 25,
    time: "1 day ago",
    icon: Award,
  },
  {
    type: "streak",
    title: "7-day learning streak!",
    points: 50,
    time: "2 days ago",
    icon: Flame,
  },
];

const skillLevels = [
  { name: "Arrays", level: 75, color: "bg-blue-500" },
  { name: "Linked Lists", level: 60, color: "bg-green-500" },
  { name: "Trees", level: 45, color: "bg-yellow-500" },
  { name: "Graphs", level: 30, color: "bg-purple-500" },
  { name: "Sorting", level: 80, color: "bg-pink-500" },
  { name: "Searching", level: 65, color: "bg-cyan-500" },
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { progress } = useProgressStore();
  const { settings } = useSettingsStore();
  const [userData, setUserData] = useState<any>(null);
  const [progressData, setProgressData] = useState<any>(null);
  const [achievementsData, setAchievementsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchAllData = async () => {
      if (session?.user?.email) {
        try {
          const [userRes, progressRes, achievementsRes] = await Promise.all([
            fetch(`/api/users?email=${session.user.email}`),
            fetch(`/api/progress?userId=${session.user.id}`),
            fetch(`/api/achievements?userId=${session.user.id}`)
          ]);

          if (userRes.ok) {
            const data = await userRes.json();
            setUserData(data.user);
          }

          if (progressRes.ok) {
            const data = await progressRes.json();
            setProgressData(data.progress);
          }

          if (achievementsRes.ok) {
            const data = await achievementsRes.json();
            setAchievementsData(data.achievements || []);
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (session) {
      fetchAllData();
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <div className="absolute inset-0 rounded-full bg-blue-100 blur-xl opacity-50 animate-pulse"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Calculate stats from real database data
  const totalPoints = userData?.xp || 0;
  const level = userData?.level || 1;
  const xpToNextLevel = 100 - (totalPoints % 100);
  const xpProgress = totalPoints % 100;
  const completedModules = progressData?.totalAlgorithmsCompleted || 0;
  const completedChallenges = progressData?.totalDataStructuresCompleted || 0;
  const dayStreak = 0; // Can be calculated from user's last activity

  const ranks = [
    { min: 0, name: "Beginner", color: "text-slate-500" },
    { min: 100, name: "Apprentice", color: "text-green-500" },
    { min: 300, name: "Developer", color: "text-blue-500" },
    { min: 600, name: "Expert", color: "text-purple-500" },
    { min: 1000, name: "Master", color: "text-yellow-500" },
    { min: 2000, name: "Legend", color: "text-red-500" },
  ];

  const currentRank =
    ranks.reduce(
      (acc, rank) => (totalPoints >= rank.min ? rank : acc),
      ranks[0]
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          <Card className="overflow-hidden shadow-xl border-2 border-slate-200 bg-white">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />

            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                  <User className="w-12 h-12" />
                </div>

                <div className="flex-1 sm:mb-2">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {userData?.name || session?.user?.name || 'AlgoBuddy User'}
                  </h1>
                  <p className="text-sm text-slate-600">
                    {userData?.email || session?.user?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn("px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-purple-100", currentRank.color)}>
                      {userData?.rank || currentRank.name}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-700 font-medium">
                      Level {level}
                    </span>
                  </div>
                </div>
              </div>

              {/* XP Progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Level {level} Progress
                  </span>
                  <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {xpProgress}/100 XP
                  </span>
                </div>
                <div className="relative w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {xpToNextLevel} XP to Level {level + 1}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-4 text-center bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg border-2 border-yellow-200 hover:shadow-xl transition-shadow">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                  <div className="text-2xl font-bold text-slate-900">
                    {totalPoints}
                  </div>
                  <div className="text-xs text-slate-700 font-semibold">Total Points</div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
              >
                <Card className="p-4 text-center bg-gradient-to-br from-orange-50 to-red-50 shadow-lg border-2 border-orange-200 hover:shadow-xl transition-shadow">
                  <Flame className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold text-slate-900">
                    {dayStreak}
                  </div>
                  <div className="text-xs text-slate-700 font-semibold">Day Streak</div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg border-2 border-blue-200 hover:shadow-xl transition-shadow">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-slate-900">
                    {completedModules}
                  </div>
                  <div className="text-xs text-slate-700 font-semibold">Modules Done</div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
              >
                <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg border-2 border-green-200 hover:shadow-xl transition-shadow">
                  <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-slate-900">
                    {completedChallenges}
                  </div>
                  <div className="text-xs text-slate-700 font-semibold">Challenges</div>
                </Card>
              </motion.div>
            </div>

            {/* Skill Levels */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg border-2 border-blue-200">
              <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Skill Progress
              </h3>
              <div className="space-y-4">
                {skillLevels.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-slate-800">
                        {skill.name}
                      </span>
                      <span className="text-sm font-medium text-slate-600">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-white rounded-full overflow-hidden shadow-inner border border-slate-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={cn("h-full rounded-full", skill.color)}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Weekly Activity */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg border-2 border-purple-200">
              <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Weekly Activity
              </h3>
              <div className="flex items-end justify-between gap-2 h-32 bg-white rounded-lg p-4 border-2 border-purple-100">
                {activityData.map((day, index) => (
                  <motion.div
                    key={day.day}
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.count / 15) * 100}%` }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-md"
                      style={{ height: "100%" }}
                    />
                    <span className="text-xs font-medium text-slate-700">{day.day}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Activity & Achievements */}
          <div className="space-y-6">
            {/* Achievements Summary */}
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  Achievements
                </h3>
                <Link href="/achievements">
                  <Button variant="ghost" size="sm">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center mb-4">
                <div className="relative w-28 h-28 bg-white rounded-full p-2 shadow-inner border-2 border-yellow-200">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="#fef3c7"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(achievementsData.length / 20) * 326.7} 326.7`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900">{achievementsData.length}%</span>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm text-slate-600 font-medium">
                {achievementsData.length} of 20 achievements unlocked
              </p>

              {achievementsData.length === 0 ? (
                <div className="mt-4 p-4 bg-white rounded-lg text-center border-2 border-yellow-200 shadow-inner">
                  <p className="text-sm text-slate-700 font-medium">
                    Complete lessons and challenges to earn achievements!
                  </p>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {achievementsData.slice(0, 8).map((achievement, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gradient-to-br from-yellow-300 to-orange-400 rounded-lg flex items-center justify-center text-2xl shadow-lg hover:shadow-xl transition-shadow border-2 border-yellow-300"
                    >
                      {achievement.icon || "🏆"}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg border-2 border-green-200">
              <h3 className="font-bold text-lg text-slate-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          activity.type === "lesson" && "bg-blue-100",
                          activity.type === "exercise" && "bg-green-100",
                          activity.type === "achievement" && "bg-yellow-100",
                          activity.type === "streak" && "bg-orange-100"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-4 h-4",
                            activity.type === "lesson" && "text-blue-600",
                            activity.type === "exercise" && "text-green-600",
                            activity.type === "achievement" && "text-yellow-600",
                            activity.type === "streak" && "text-orange-600"
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {activity.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded">
                            +{activity.points} XP
                          </span>
                          <span className="text-xs text-slate-500">
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
