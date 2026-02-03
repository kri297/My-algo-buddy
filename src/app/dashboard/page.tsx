'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp, 
  Zap,
  Award,
  Target,
  Flame,
  Code2,
  Sparkles
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    if (session?.user?.id) {
      fetchDashboardData();
    }
  }, [session, status]);

  const fetchDashboardData = async () => {
    try {
      const [progressRes, achievementsRes] = await Promise.all([
        fetch(`/api/progress?userId=${session?.user?.id}`),
        fetch(`/api/achievements?userId=${session?.user?.id}`),
      ]);

      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setStats(progressData);
      }

      if (achievementsRes.ok) {
        const achievementsData = await achievementsRes.json();
        setAchievements(achievementsData.achievements || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full bg-blue-100 blur-xl opacity-50 animate-pulse"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const user = session?.user;
  const xpToNextLevel = ((user?.level || 1) * 100);
  const xpProgress = ((user?.xp || 0) % 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-100"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="relative"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {user?.level}
                </div>
              </motion.div>
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-white flex items-center gap-2"
                >
                  Welcome back, {user?.name}! 
                  <span className="animate-wave inline-block">👋</span>
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 mt-2"
                >
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium flex items-center gap-1.5 border border-white/30">
                    <TrendingUp className="w-4 h-4" />
                    Level {user?.level}
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium flex items-center gap-1.5 border border-white/30">
                    <Award className="w-4 h-4" />
                    {user?.rank || 'Beginner'}
                  </span>
                </motion.div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-3"
            >
              <Link href="/learn">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-semibold px-6">
                  <BookOpen className="w-5 h-5" />
                  Start Learning
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20"
              >
                Sign Out
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* XP Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8 p-6 bg-white border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Experience Points
                </h2>
                <p className="text-sm text-slate-700 mt-1 font-medium">
                  {xpProgress} / 100 XP to Level {(user?.level || 1) + 1}
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-blue-600">
                  {user?.xp || 0} XP
                </div>
                <p className="text-xs text-slate-600 mt-1 font-medium">Total Points</p>
              </div>
            </div>
            <div className="relative w-full bg-white rounded-full h-5 overflow-hidden shadow-inner border-2 border-blue-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                className="relative h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-100 font-medium">Algorithms</p>
                  <p className="text-3xl font-bold">
                    {stats?.progress?.totalAlgorithmsCompleted || 0}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Code2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-100 font-medium">Data Structures</p>
                  <p className="text-3xl font-bold">
                    {stats?.progress?.totalDataStructuresCompleted || 0}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-100 font-medium">Time Spent</p>
                  <p className="text-3xl font-bold">
                    {(() => {
                      const totalSeconds = stats?.progress?.algorithmsCompleted?.reduce((sum: number, algo: any) => sum + (algo.timeSpent || 0), 0) || 0;
                      const minutes = Math.floor(totalSeconds / 60);
                      return minutes > 0 ? `${minutes} min` : '0 min';
                    })()}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-8 bg-white border-2 border-slate-200 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Achievements
                </h2>
                <p className="text-sm text-slate-700 font-medium">
                  {achievements.length} badge{achievements.length !== 1 ? 's' : ''} earned
                </p>
              </div>
            </div>
            
            {achievements.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border-2 border-blue-100">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="text-8xl mb-6"
                >
                  🏆
                </motion.div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  No achievements yet
                </h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  Start your learning journey to unlock badges and achievements!
                </p>
                <Link href="/learn">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                    <Flame className="w-4 h-4 mr-2" />
                    Start Learning Now
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement: any, index: number) => (
                  <motion.div
                    key={achievement._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative group"
                  >
                    <div className="flex items-center gap-3 p-5 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 rounded-xl border-2 border-yellow-200 shadow-md hover:shadow-xl transition-all duration-300">
                      <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 mb-1">
                          {achievement.title}
                        </h3>
                        <p className="text-xs text-slate-600">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"></div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
