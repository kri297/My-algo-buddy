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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/users?email=${session.user.email}`);
          if (response.ok) {
            const data = await response.json();
            setUserData(data.user);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (session) {
      fetchUserData();
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalPoints = userData?.xp || progress.totalPoints;
  const level = userData?.level || Math.floor(totalPoints / 100) + 1;
  const xpToNextLevel = 100 - (totalPoints % 100);
  const xpProgress = totalPoints % 100;

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          <Card className="overflow-hidden">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />

            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-slate-900 shadow-lg">
                  <User className="w-12 h-12" />
                </div>

                <div className="flex-1 sm:mb-2">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {userData?.name || session?.user?.name || 'AlgoBuddy User'}
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {userData?.email || session?.user?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn("font-semibold", currentRank.color)}>
                      {userData?.rank || currentRank.name}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      Level {level}
                    </span>
                  </div>
                </div>

                <Link href="/settings" className="sm:mb-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </div>

              {/* XP Progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Level {level} Progress
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {xpProgress}/100 XP
                  </span>
                </div>
                <Progress value={xpProgress} variant="gradient" />
                <p className="text-xs text-slate-500 mt-1">
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
                <Card className="p-4 text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {totalPoints}
                  </div>
                  <div className="text-xs text-slate-500">Total Points</div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
              >
                <Card className="p-4 text-center">
                  <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {progress.streak}
                  </div>
                  <div className="text-xs text-slate-500">Day Streak</div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-4 text-center">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {progress.completedModules.length}
                  </div>
                  <div className="text-xs text-slate-500">Modules Done</div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
              >
                <Card className="p-4 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {progress.completedExercises.length}
                  </div>
                  <div className="text-xs text-slate-500">Challenges</div>
                </Card>
              </motion.div>
            </div>

            {/* Skill Levels */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
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
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {skill.name}
                      </span>
                      <span className="text-sm text-slate-500">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
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
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Weekly Activity
              </h3>
              <div className="flex items-end justify-between gap-2 h-32">
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
                    <span className="text-xs text-slate-500">{day.day}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Activity & Achievements */}
          <div className="space-y-6">
            {/* Achievements Summary */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
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
                <CircularProgress
                  value={progress.achievements.length}
                  max={20}
                  size={100}
                  variant="success"
                />
              </div>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                {progress.achievements.length} of 20 achievements unlocked
              </p>

              {progress.achievements.length === 0 ? (
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p className="text-sm text-slate-500">
                    Complete lessons and challenges to earn achievements!
                  </p>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {progress.achievements.slice(0, 8).map((achievement, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-2xl"
                    >
                      {achievement.icon || "🏆"}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
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
                          activity.type === "lesson" && "bg-blue-100 dark:bg-blue-900/30",
                          activity.type === "exercise" && "bg-green-100 dark:bg-green-900/30",
                          activity.type === "achievement" && "bg-yellow-100 dark:bg-yellow-900/30",
                          activity.type === "streak" && "bg-orange-100 dark:bg-orange-900/30"
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
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {activity.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="success" size="sm">
                            +{activity.points}
                          </Badge>
                          <span className="text-xs text-slate-400">
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
