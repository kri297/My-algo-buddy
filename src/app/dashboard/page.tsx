'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const user = session?.user;
  const xpToNextLevel = ((user?.level || 1) * 100);
  const xpProgress = ((user?.xp || 0) % 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Level {user?.level} • {user?.rank}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/visualize">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Start Learning
                </Button>
              </Link>
              <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* XP Progress */}
        <Card className="mb-8 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Experience Points
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {xpProgress}/ 100 XP to Level {(user?.level || 1) + 1}
              </p>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {user?.xp || 0} XP
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl">
                🎯
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Algorithms</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats?.progress?.totalAlgorithmsCompleted || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-2xl">
                🏗️
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Data Structures</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats?.progress?.totalDataStructuresCompleted || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl">
                ⏱️
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Time Spent</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {Math.floor((stats?.progress?.totalTimeSpent || 0) / 60)} min
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Achievements ({achievements.length})
          </h2>
          {achievements.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-slate-600 dark:text-slate-400">
                No achievements yet. Start learning to earn badges!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement: any) => (
                <div
                  key={achievement._id}
                  className="flex items-center gap-3 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                >
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
