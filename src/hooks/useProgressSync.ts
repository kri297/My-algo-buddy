'use client';

import { useSession } from 'next-auth/react';
import { useState, useCallback, useEffect } from 'react';

export type ProgressType = 
  | 'algorithm' 
  | 'datastructure' 
  | 'quiz' 
  | 'flashcard' 
  | 'speed-coding' 
  | 'practice' 
  | 'visualization'
  | 'lesson';

interface SyncResult {
  success: boolean;
  xpGained?: number;
  leveledUp?: boolean;
  newLevel?: number;
  totalXP?: number;
  rank?: string;
  newAchievements?: any[];
  error?: string;
}

interface UserProgress {
  algorithmsCompleted: { algorithmId: string; completedAt: Date }[];
  dataStructuresMastered: { structureId: string }[];
  quizzesCompleted: { quizId: string; score: number }[];
  flashcardsLearned: { cardId: number; category: string }[];
  speedChallengesCompleted: { challengeId: number; timeSpent: number; pointsEarned: number }[];
  problemsSolved: { problemId: string; difficulty: string }[];
  visualizationsCompleted: { algorithmId: string }[];
  totalXP: number;
  totalAlgorithmsCompleted: number;
  totalDataStructuresCompleted: number;
  totalQuizzesCompleted: number;
  totalSpeedCodingPoints: number;
}

export function useProgressSync() {
  const { data: session, status } = useSession();
  const [isSyncing, setIsSyncing] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const userId = session?.user?.id;
  const isAuthenticated = status === 'authenticated' && !!userId;

  // Fetch user progress on mount
  const fetchProgress = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return null;
    }

    try {
      const response = await fetch(`/api/progress?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserProgress(data.progress);
        return data.progress;
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setIsLoading(false);
    }
    return null;
  }, [userId]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProgress();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchProgress]);

  // Sync progress to server
  const syncProgress = useCallback(async (
    type: ProgressType,
    data: Record<string, any>
  ): Promise<SyncResult> => {
    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    setIsSyncing(true);
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, type, data }),
      });

      const result = await response.json();

      if (response.ok) {
        // Refresh progress after sync
        await fetchProgress();
        return { success: true, ...result };
      } else {
        return { success: false, error: result.error || 'Sync failed' };
      }
    } catch (error: any) {
      console.error('Progress sync error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsSyncing(false);
    }
  }, [userId, fetchProgress]);

  // Helper functions for specific progress types
  const syncQuiz = useCallback((quizId: string, score: number, totalQuestions: number, xpEarned: number) => {
    return syncProgress('quiz', { quizId, score, totalQuestions, xpEarned });
  }, [syncProgress]);

  const syncVisualization = useCallback((algorithmId: string) => {
    return syncProgress('visualization', { algorithmId });
  }, [syncProgress]);

  const syncAlgorithm = useCallback((algorithmId: string, timeSpent: number) => {
    return syncProgress('algorithm', { algorithmId, timeSpent });
  }, [syncProgress]);

  const syncDataStructure = useCallback((structureId: string, operation: string = "operation") => {
    return syncProgress('datastructure', { structureId, operation });
  }, [syncProgress]);

  const syncFlashcard = useCallback((cardId: number, category: string, totalLearned: number) => {
    return syncProgress('flashcard', { cardId, category, totalLearned });
  }, [syncProgress]);

  const syncSpeedCoding = useCallback((challengeId: number, timeSpent: number, pointsEarned: number) => {
    return syncProgress('speed-coding', { challengeId, timeSpent, pointsEarned });
  }, [syncProgress]);

  const syncPractice = useCallback((problemId: string, difficulty: string) => {
    return syncProgress('practice', { problemId, difficulty });
  }, [syncProgress]);

  // Sync lesson completion
  const syncLesson = useCallback((lessonId: string, xpEarned: number) => {
    return syncProgress('lesson', { lessonId, xpEarned });
  }, [syncProgress]);

  // Check if something is completed
  const isQuizCompleted = useCallback((quizId: string) => {
    return userProgress?.quizzesCompleted?.some(q => q.quizId === quizId) || false;
  }, [userProgress]);

  const isLessonCompleted = useCallback((lessonId: string) => {
    return (userProgress as any)?.lessonsCompleted?.includes(lessonId) || false;
  }, [userProgress]);

  const getCompletedLessons = useCallback((): Set<string> => {
    const lessons = (userProgress as any)?.lessonsCompleted || [];
    return new Set<string>(lessons);
  }, [userProgress]);

  const isAlgorithmCompleted = useCallback((algorithmId: string) => {
    return userProgress?.algorithmsCompleted?.some(a => a.algorithmId === algorithmId) || false;
  }, [userProgress]);

  const isProblemSolved = useCallback((problemId: string) => {
    return userProgress?.problemsSolved?.some(p => p.problemId === problemId) || false;
  }, [userProgress]);

  const isFlashcardLearned = useCallback((cardId: number) => {
    return userProgress?.flashcardsLearned?.some(f => f.cardId === cardId) || false;
  }, [userProgress]);

  const isSpeedChallengeCompleted = useCallback((challengeId: number) => {
    return userProgress?.speedChallengesCompleted?.some(s => s.challengeId === challengeId) || false;
  }, [userProgress]);

  const getCompletedQuizIds = useCallback(() => {
    return new Set(userProgress?.quizzesCompleted?.map(q => q.quizId) || []);
  }, [userProgress]);

  const getCompletedProblemIds = useCallback(() => {
    return new Set(userProgress?.problemsSolved?.map(p => p.problemId) || []);
  }, [userProgress]);

  const getLearnedFlashcardIds = useCallback(() => {
    return new Set(userProgress?.flashcardsLearned?.map(f => f.cardId) || []);
  }, [userProgress]);

  const getCompletedSpeedChallengeIds = useCallback(() => {
    return new Set(userProgress?.speedChallengesCompleted?.map(s => s.challengeId) || []);
  }, [userProgress]);

  return {
    // State
    isAuthenticated,
    isSyncing,
    isLoading,
    userProgress,
    userId,
    session,

    // Actions
    syncProgress,
    syncQuiz,
    syncVisualization,
    syncAlgorithm,
    syncDataStructure,
    syncFlashcard,
    syncSpeedCoding,
    syncPractice,
    syncLesson,
    fetchProgress,

    // Checkers
    isQuizCompleted,
    isAlgorithmCompleted,
    isProblemSolved,
    isFlashcardLearned,
    isSpeedChallengeCompleted,
    isLessonCompleted,

    // Getters
    getCompletedQuizIds,
    getCompletedProblemIds,
    getLearnedFlashcardIds,
    getCompletedSpeedChallengeIds,
    getCompletedLessons,
  };
}
