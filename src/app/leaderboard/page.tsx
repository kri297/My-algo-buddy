"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  Crown,
  Flame,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface LeaderboardUser {
  id: string;
  rank: number;
  previousRank: number;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  achievements: number;
  country?: string;
}

// Mock data for demonstration
const mockLeaderboard: LeaderboardUser[] = [
  { id: "1", rank: 1, previousRank: 1, name: "AlgoMaster", avatar: "🧙‍♂️", level: 42, xp: 15240, streak: 120, achievements: 45, country: "US" },
  { id: "2", rank: 2, previousRank: 3, name: "CodeNinja", avatar: "🥷", level: 38, xp: 12850, streak: 89, achievements: 42, country: "JP" },
  { id: "3", rank: 3, previousRank: 2, name: "ByteWizard", avatar: "🧙", level: 36, xp: 11920, streak: 65, achievements: 38, country: "DE" },
  { id: "4", rank: 4, previousRank: 4, name: "DataDruid", avatar: "🧝‍♂️", level: 34, xp: 10540, streak: 45, achievements: 35, country: "UK" },
  { id: "5", rank: 5, previousRank: 7, name: "StackSorcerer", avatar: "🪄", level: 32, xp: 9870, streak: 78, achievements: 32, country: "CA" },
  { id: "6", rank: 6, previousRank: 5, name: "HeapHero", avatar: "🦸", level: 30, xp: 9120, streak: 34, achievements: 30, country: "AU" },
  { id: "7", rank: 7, previousRank: 6, name: "TreeTraverser", avatar: "🌳", level: 29, xp: 8650, streak: 56, achievements: 28, country: "IN" },
  { id: "8", rank: 8, previousRank: 10, name: "GraphGuru", avatar: "🕸️", level: 28, xp: 8200, streak: 42, achievements: 26, country: "BR" },
  { id: "9", rank: 9, previousRank: 8, name: "SortingSeeker", avatar: "🔍", level: 27, xp: 7890, streak: 23, achievements: 24, country: "FR" },
  { id: "10", rank: 10, previousRank: 9, name: "RecursionRanger", avatar: "🔄", level: 26, xp: 7450, streak: 67, achievements: 23, country: "KR" },
  { id: "11", rank: 11, previousRank: 12, name: "LinkedListLegend", avatar: "🔗", level: 25, xp: 7100, streak: 31, achievements: 21, country: "ES" },
  { id: "12", rank: 12, previousRank: 11, name: "QueueQuester", avatar: "📥", level: 24, xp: 6780, streak: 19, achievements: 20, country: "IT" },
];

const timeFilters = [
  { id: "all", label: "All Time" },
  { id: "month", label: "This Month" },
  { id: "week", label: "This Week" },
  { id: "today", label: "Today" },
];

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState("all");
  const [category, setCategory] = useState<"xp" | "streak" | "achievements">("xp");

  const getRankChange = (current: number, previous: number) => {
    if (current < previous) return { icon: TrendingUp, color: "text-green-500", change: previous - current };
    if (current > previous) return { icon: TrendingDown, color: "text-red-500", change: current - previous };
    return { icon: Minus, color: "text-muted-foreground", change: 0 };
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  // Sort based on category
  const sortedLeaderboard = [...mockLeaderboard].sort((a, b) => {
    if (category === "xp") return b.xp - a.xp;
    if (category === "streak") return b.streak - a.streak;
    return b.achievements - a.achievements;
  }).map((user, idx) => ({ ...user, rank: idx + 1 }));

  // Simulated current user (not in top rankings)
  const currentUser: LeaderboardUser = {
    id: "current",
    rank: 156,
    previousRank: 162,
    name: "You",
    avatar: "👤",
    level: 12,
    xp: 2450,
    streak: 7,
    achievements: 8,
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">
            Compete with learners worldwide and climb the ranks!
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium mt-3">
            📊 Demo Data - Sign in to see real rankings
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border rounded-xl p-4 text-center"
          >
            <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">12,847</div>
            <div className="text-sm text-muted-foreground">Active Learners</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card border rounded-xl p-4 text-center"
          >
            <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">#{currentUser.rank}</div>
            <div className="text-sm text-muted-foreground">Your Rank</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border rounded-xl p-4 text-center"
          >
            <Star className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{currentUser.xp.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Your XP</div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          {/* Time Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {timeFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setTimeFilter(filter.id)}
                className={cn(
                  "px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors",
                  timeFilter === filter.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 sm:ml-auto">
            {[
              { id: "xp", label: "XP", icon: Star },
              { id: "streak", label: "Streak", icon: Flame },
              { id: "achievements", label: "Badges", icon: Trophy },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id as "xp" | "streak" | "achievements")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    category === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {/* Second Place */}
          <div className="order-1 pt-8">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 text-center border-2 border-gray-300 dark:border-gray-600">
              <div className="text-4xl mb-2">{sortedLeaderboard[1]?.avatar}</div>
              <Medal className="w-6 h-6 mx-auto mb-1 text-gray-400" />
              <div className="font-semibold truncate">{sortedLeaderboard[1]?.name}</div>
              <div className="text-sm text-muted-foreground">
                {category === "xp" && `${sortedLeaderboard[1]?.xp.toLocaleString()} XP`}
                {category === "streak" && `${sortedLeaderboard[1]?.streak} days`}
                {category === "achievements" && `${sortedLeaderboard[1]?.achievements} badges`}
              </div>
            </div>
          </div>

          {/* First Place */}
          <div className="order-2">
            <div className="bg-gradient-to-br from-yellow-100 to-amber-200 dark:from-yellow-900/30 dark:to-amber-800/30 rounded-xl p-4 text-center border-2 border-yellow-400 shadow-lg">
              <div className="text-5xl mb-2">{sortedLeaderboard[0]?.avatar}</div>
              <Crown className="w-8 h-8 mx-auto mb-1 text-yellow-500" />
              <div className="font-bold text-lg truncate">{sortedLeaderboard[0]?.name}</div>
              <div className="text-sm text-muted-foreground">
                {category === "xp" && `${sortedLeaderboard[0]?.xp.toLocaleString()} XP`}
                {category === "streak" && `${sortedLeaderboard[0]?.streak} days`}
                {category === "achievements" && `${sortedLeaderboard[0]?.achievements} badges`}
              </div>
            </div>
          </div>

          {/* Third Place */}
          <div className="order-3 pt-12">
            <div className="bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-800/30 rounded-xl p-4 text-center border-2 border-amber-600 dark:border-amber-700">
              <div className="text-3xl mb-2">{sortedLeaderboard[2]?.avatar}</div>
              <Medal className="w-5 h-5 mx-auto mb-1 text-amber-600" />
              <div className="font-semibold text-sm truncate">{sortedLeaderboard[2]?.name}</div>
              <div className="text-xs text-muted-foreground">
                {category === "xp" && `${sortedLeaderboard[2]?.xp.toLocaleString()} XP`}
                {category === "streak" && `${sortedLeaderboard[2]?.streak} days`}
                {category === "achievements" && `${sortedLeaderboard[2]?.achievements} badges`}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Full Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-card border rounded-xl overflow-hidden"
        >
          <div className="divide-y divide-border">
            {sortedLeaderboard.slice(3).map((user, index) => {
              const rankChange = getRankChange(user.rank, user.previousRank);
              const RankChangeIcon = rankChange.icon;

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.03 }}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  {/* Rank */}
                  <div className="w-12 flex items-center justify-center">
                    {getRankIcon(user.rank)}
                  </div>

                  {/* Rank Change */}
                  <div className={cn("w-8 flex items-center gap-1", rankChange.color)}>
                    <RankChangeIcon className="w-3 h-3" />
                    {rankChange.change > 0 && (
                      <span className="text-xs">{rankChange.change}</span>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Level {user.level}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className={cn("flex items-center gap-1", category === "xp" && "text-primary font-semibold")}>
                      <Star className="w-4 h-4" />
                      {user.xp.toLocaleString()}
                    </div>
                    <div className={cn("flex items-center gap-1", category === "streak" && "text-orange-500 font-semibold")}>
                      <Flame className="w-4 h-4" />
                      {user.streak}
                    </div>
                    <div className={cn("flex items-center gap-1", category === "achievements" && "text-purple-500 font-semibold")}>
                      <Trophy className="w-4 h-4" />
                      {user.achievements}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Your Position */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-gradient-to-br from-primary/10 to-blue-500/10 border-2 border-primary/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">#{currentUser.rank}</span>
            </div>
            <div className="w-8 flex items-center gap-1 text-green-500">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs">6</span>
            </div>
            <div className="flex items-center gap-3 flex-1">
              <div className="text-2xl">{currentUser.avatar}</div>
              <div>
                <div className="font-medium">{currentUser.name}</div>
                <div className="text-xs text-muted-foreground">Level {currentUser.level}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {currentUser.xp.toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4" />
                {currentUser.streak}
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                {currentUser.achievements}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
