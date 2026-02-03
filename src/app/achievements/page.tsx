"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Lock, Star, Flame, BookOpen, Code2, Target, Zap } from "lucide-react";
import { useProgressStore } from "@/store";
import { achievements as allAchievements } from "@/data/learning-modules";
import { cn } from "@/lib/utils";

const achievementIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  learning: BookOpen,
  practice: Code2,
  streak: Flame,
  mastery: Trophy,
};

export default function AchievementsPage() {
  const { progress } = useProgressStore();

  const unlockedIds = new Set(progress.achievements.map((a) => a.id));

  const categorizedAchievements = {
    learning: allAchievements.filter((a) => a.category === "learning"),
    practice: allAchievements.filter((a) => a.category === "practice"),
    streak: allAchievements.filter((a) => a.category === "streak"),
    mastery: allAchievements.filter((a) => a.category === "mastery"),
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Achievements</h1>
          <p className="text-muted-foreground">
            Track your progress and unlock achievements as you master DSA concepts.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border rounded-xl p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{progress.achievements.length}</div>
            <div className="text-sm text-muted-foreground">Unlocked</div>
          </div>
          <div className="bg-card border rounded-xl p-4 text-center">
            <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <div className="text-2xl font-bold">{allAchievements.length - progress.achievements.length}</div>
            <div className="text-sm text-muted-foreground">Locked</div>
          </div>
          <div className="bg-card border rounded-xl p-4 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{progress.totalPoints}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </div>
          <div className="bg-card border rounded-xl p-4 text-center">
            <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">{progress.streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>
        </div>

        {/* Achievement Categories */}
        {Object.entries(categorizedAchievements).map(([category, achievements]) => {
          const CategoryIcon = achievementIcons[category] || Trophy;
          
          return (
            <section key={category} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <CategoryIcon className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold capitalize">{category} Achievements</h2>
                <span className="text-sm text-muted-foreground ml-2">
                  ({achievements.filter((a) => unlockedIds.has(a.id)).length} / {achievements.length})
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {achievements.map((achievement, index) => {
                  const isUnlocked = unlockedIds.has(achievement.id);
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "relative border rounded-xl p-4 text-center transition-all",
                        isUnlocked
                          ? "bg-card hover:shadow-lg"
                          : "bg-muted/50 opacity-60"
                      )}
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl",
                          isUnlocked
                            ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                            : "bg-muted"
                        )}
                      >
                        {isUnlocked ? (
                          achievement.icon
                        ) : (
                          <Lock className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold mb-1">{achievement.title}</h3>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>

                      {/* Unlocked indicator */}
                      {isUnlocked && (
                        <div className="absolute top-2 right-2">
                          <Zap className="w-4 h-4 text-yellow-500" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Motivational Message */}
        {progress.achievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Start Your Journey!</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Complete lessons, solve challenges, and maintain your learning streak to unlock achievements.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
