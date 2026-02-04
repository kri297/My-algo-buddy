import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Progress, User, Leaderboard, Achievement } from '@/models';

// Update progress
export async function POST(request: NextRequest) {
  try {
    const { userId, type, data } = await request.json();

    if (!userId || !type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    let progress = await Progress.findOne({ userId });
    if (!progress) {
      progress = await Progress.create({ userId });
    }

    let xpGained = 0;

    if (type === 'algorithm') {
      const { algorithmId, timeSpent } = data;
      const existing = progress.algorithmsCompleted.find(
        (a: any) => a.algorithmId === algorithmId
      );

      if (!existing) {
        progress.algorithmsCompleted.push({
          algorithmId,
          completedAt: new Date(),
          timeSpent,
          bestTime: timeSpent,
        });
        progress.totalAlgorithmsCompleted += 1;
        xpGained = 50; // First time bonus
      } else {
        existing.timeSpent += timeSpent;
        if (timeSpent < existing.bestTime) {
          existing.bestTime = timeSpent;
          xpGained = 25; // Improvement bonus
        } else {
          xpGained = 10; // Practice XP
        }
      }
    } else if (type === 'datastructure') {
      const { structureId, operations } = data;
      const existing = progress.dataStructuresMastered.find(
        (d: any) => d.structureId === structureId
      );

      if (!existing) {
        progress.dataStructuresMastered.push({
          structureId,
          operationsCompleted: operations,
          masteredAt: new Date(),
        });
        progress.totalDataStructuresCompleted += 1;
        xpGained = 40;
      } else {
        existing.operationsCompleted += operations;
        xpGained = operations * 5;
      }
    } else if (type === 'quiz') {
      const { quizId, score, totalQuestions, xpEarned } = data;
      const existing = progress.quizzesCompleted?.find(
        (q: any) => q.quizId === quizId
      );

      if (!existing) {
        if (!progress.quizzesCompleted) progress.quizzesCompleted = [];
        progress.quizzesCompleted.push({
          quizId,
          score,
          totalQuestions,
          xpEarned,
          completedAt: new Date(),
        });
        progress.totalQuizzesCompleted = (progress.totalQuizzesCompleted || 0) + 1;
        xpGained = xpEarned || 50;
      } else {
        // Update if better score
        if (score > existing.score) {
          existing.score = score;
          xpGained = Math.floor((xpEarned || 50) * 0.5); // Half XP for improvement
        }
      }
    } else if (type === 'flashcard') {
      const { cardId, category, totalLearned } = data;
      if (!progress.flashcardsLearned) progress.flashcardsLearned = [];
      
      const existing = progress.flashcardsLearned.find(
        (f: any) => f.cardId === cardId
      );

      if (!existing) {
        progress.flashcardsLearned.push({
          cardId,
          category,
          learnedAt: new Date(),
        });
        xpGained = 10; // XP per new card learned
      }
      
      // Update streak
      progress.flashcardStreak = totalLearned || progress.flashcardsLearned.length;
    } else if (type === 'speed-coding') {
      const { challengeId, timeSpent, pointsEarned } = data;
      if (!progress.speedChallengesCompleted) progress.speedChallengesCompleted = [];
      
      const existing = progress.speedChallengesCompleted.find(
        (s: any) => s.challengeId === challengeId
      );

      if (!existing) {
        progress.speedChallengesCompleted.push({
          challengeId,
          timeSpent,
          pointsEarned,
          completedAt: new Date(),
        });
        progress.totalSpeedCodingPoints = (progress.totalSpeedCodingPoints || 0) + pointsEarned;
        xpGained = Math.floor(pointsEarned / 2); // Half of points as XP
      } else if (timeSpent < existing.timeSpent) {
        // Better time bonus
        existing.timeSpent = timeSpent;
        xpGained = 25;
      }
    } else if (type === 'practice') {
      const { problemId, difficulty } = data;
      if (!progress.problemsSolved) progress.problemsSolved = [];
      
      const existing = progress.problemsSolved.find(
        (p: any) => p.problemId === problemId
      );

      if (!existing) {
        progress.problemsSolved.push({
          problemId,
          difficulty,
          completedAt: new Date(),
        });
        // XP based on difficulty
        const xpMap: Record<string, number> = { Easy: 25, Medium: 50, Hard: 100 };
        xpGained = xpMap[difficulty] || 25;
      }
    } else if (type === 'visualization') {
      const { algorithmId } = data;
      if (!progress.visualizationsCompleted) progress.visualizationsCompleted = [];
      
      const existing = progress.visualizationsCompleted.find(
        (v: any) => v.algorithmId === algorithmId
      );

      if (!existing) {
        progress.visualizationsCompleted.push({
          algorithmId,
          completedAt: new Date(),
        });
        xpGained = 30;
      } else {
        xpGained = 5; // Small XP for re-watching
      }
    } else if (type === 'lesson') {
      const { lessonId, xpEarned } = data;
      if (!progress.lessonsCompleted) progress.lessonsCompleted = [];
      
      const existing = progress.lessonsCompleted.includes(lessonId);

      if (!existing) {
        progress.lessonsCompleted.push(lessonId);
        progress.lastActiveLesson = lessonId;
        xpGained = xpEarned || 50;
      } else {
        xpGained = 5; // Small XP for re-reading
      }
    }

    progress.totalTimeSpent += data.timeSpent || 0;
    progress.updatedAt = new Date();
    await progress.save();

    // Update user XP and level
    const user = await User.findById(userId);
    if (user) {
      user.xp += xpGained;
      
      // Level up logic
      const newLevel = Math.floor(user.xp / 100) + 1;
      const leveledUp = newLevel > user.level;
      user.level = newLevel;

      // Update rank based on level
      if (user.level >= 20) user.rank = 'Master';
      else if (user.level >= 15) user.rank = 'Expert';
      else if (user.level >= 10) user.rank = 'Advanced';
      else if (user.level >= 5) user.rank = 'Intermediate';
      else user.rank = 'Beginner';

      await user.save();

      // Update leaderboard
      await Leaderboard.findOneAndUpdate(
        { userId },
        {
          username: user.name,
          totalXP: user.xp,
          algorithmsCompleted: progress.totalAlgorithmsCompleted,
          dataStructuresCompleted: progress.totalDataStructuresCompleted,
          updatedAt: new Date(),
        },
        { upsert: true }
      );

      // Check for new achievements
      const newAchievements = await checkAchievements(userId, progress, user);

      return NextResponse.json({
        message: 'Progress updated',
        xpGained,
        leveledUp,
        newLevel: user.level,
        totalXP: user.xp,
        rank: user.rank,
        newAchievements,
      });
    }

    return NextResponse.json({ message: 'Progress updated', xpGained });
  } catch (error: any) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress', details: error.message },
      { status: 500 }
    );
  }
}

// Get progress
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    await connectDB();

    const progress = await Progress.findOne({ userId });
    const user = await User.findById(userId).select('xp level rank badges');

    if (!progress) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 });
    }

    return NextResponse.json({
      progress,
      user,
    });
  } catch (error: any) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to check for achievements
async function checkAchievements(userId: string, progress: any, user: any) {
  const newAchievements = [];
  const existingAchievements = await Achievement.find({ userId });
  const existingIds = existingAchievements.map((a) => a.achievementId);

  const achievementDefinitions = [
    {
      id: 'first_algorithm',
      title: 'First Steps',
      description: 'Complete your first algorithm',
      icon: '🎯',
      category: 'algorithm',
      condition: () => progress.totalAlgorithmsCompleted >= 1,
    },
    {
      id: 'algorithm_master',
      title: 'Algorithm Master',
      description: 'Complete all 7 sorting algorithms',
      icon: '🏆',
      category: 'algorithm',
      condition: () => progress.totalAlgorithmsCompleted >= 7,
    },
    {
      id: 'first_datastructure',
      title: 'Structure Builder',
      description: 'Master your first data structure',
      icon: '🏗️',
      category: 'datastructure',
      condition: () => progress.totalDataStructuresCompleted >= 1,
    },
    {
      id: 'ds_expert',
      title: 'Data Structure Expert',
      description: 'Master all 6 data structures',
      icon: '🌟',
      category: 'datastructure',
      condition: () => progress.totalDataStructuresCompleted >= 6,
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Spend 60 minutes learning',
      icon: '⚡',
      category: 'time',
      condition: () => progress.totalTimeSpent >= 3600,
    },
    {
      id: 'level_5',
      title: 'Intermediate Coder',
      description: 'Reach Level 5',
      icon: '📈',
      category: 'level',
      condition: () => user.level >= 5,
    },
    {
      id: 'level_10',
      title: 'Advanced Programmer',
      description: 'Reach Level 10',
      icon: '🚀',
      category: 'level',
      condition: () => user.level >= 10,
    },
    {
      id: 'level_20',
      title: 'Master of Algorithms',
      description: 'Reach Level 20',
      icon: '👑',
      category: 'level',
      condition: () => user.level >= 20,
    },
    // Quiz achievements
    {
      id: 'first_quiz',
      title: 'Quiz Starter',
      description: 'Pass your first quiz',
      icon: '📝',
      category: 'quiz',
      condition: () => (progress.totalQuizzesCompleted || 0) >= 1,
    },
    {
      id: 'quiz_master',
      title: 'Quiz Master',
      description: 'Pass 10 quizzes',
      icon: '🧠',
      category: 'quiz',
      condition: () => (progress.totalQuizzesCompleted || 0) >= 10,
    },
    // Flashcard achievements
    {
      id: 'flashcard_starter',
      title: 'Memory Training',
      description: 'Learn 10 flashcards',
      icon: '🎴',
      category: 'flashcard',
      condition: () => (progress.flashcardsLearned?.length || 0) >= 10,
    },
    {
      id: 'flashcard_master',
      title: 'Memory Master',
      description: 'Learn 50 flashcards',
      icon: '🃏',
      category: 'flashcard',
      condition: () => (progress.flashcardsLearned?.length || 0) >= 50,
    },
    // Speed coding achievements
    {
      id: 'speed_starter',
      title: 'Speed Coder',
      description: 'Complete your first speed challenge',
      icon: '⚡',
      category: 'speed-coding',
      condition: () => (progress.speedChallengesCompleted?.length || 0) >= 1,
    },
    {
      id: 'speed_champion',
      title: 'Speed Champion',
      description: 'Earn 1000 speed coding points',
      icon: '🏎️',
      category: 'speed-coding',
      condition: () => (progress.totalSpeedCodingPoints || 0) >= 1000,
    },
    // Practice achievements
    {
      id: 'problem_solver',
      title: 'Problem Solver',
      description: 'Solve 5 practice problems',
      icon: '💡',
      category: 'practice',
      condition: () => (progress.problemsSolved?.length || 0) >= 5,
    },
    {
      id: 'leetcode_grinder',
      title: 'LeetCode Grinder',
      description: 'Solve 25 practice problems',
      icon: '🔥',
      category: 'practice',
      condition: () => (progress.problemsSolved?.length || 0) >= 25,
    },
  ];

  for (const achievement of achievementDefinitions) {
    if (!existingIds.includes(achievement.id) && achievement.condition()) {
      const newAchievement = await Achievement.create({
        userId,
        achievementId: achievement.id,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
      });

      // Add badge to user
      if (!user.badges.includes(achievement.id)) {
        user.badges.push(achievement.id);
        await user.save();
      }

      newAchievements.push(newAchievement);
    }
  }

  return newAchievements;
}
