import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Progress, User } from '@/models';

// ============================================
// LEARN PROGRESS API
// Tracks lesson completion and XP rewards
// ============================================

interface LessonProgress {
  lessonId: string;
  completedAt: Date;
  sectionsCompleted: number;
  totalSections: number;
  xpEarned: number;
}

// Get learning progress for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      // Return demo progress for non-authenticated users
      return NextResponse.json({
        completedLessons: ['arrays-intro', 'arrays-operations', 'arrays-quiz-1'],
        lessonsProgress: {
          'arrays-intro': { completed: true, xpEarned: 50 },
          'arrays-operations': { completed: true, xpEarned: 75 },
          'arrays-quiz-1': { completed: true, xpEarned: 100 },
          'two-pointer': { completed: false, sectionsCompleted: 0 },
        },
        totalXP: 225,
        lessonsCompleted: 3,
        currentStreak: 7,
      });
    }

    await connectDB();

    const progress = await Progress.findOne({ userId });
    if (!progress) {
      return NextResponse.json({
        completedLessons: [],
        lessonsProgress: {},
        totalXP: 0,
        lessonsCompleted: 0,
        currentStreak: 0,
      });
    }

    return NextResponse.json({
      completedLessons: progress.lessonsCompleted || [],
      lessonsProgress: progress.lessonsProgress || {},
      totalXP: progress.totalXP || 0,
      lessonsCompleted: progress.lessonsCompleted?.length || 0,
      currentStreak: progress.currentStreak || 0,
    });
  } catch (error: any) {
    console.error('Get learn progress error:', error);
    return NextResponse.json(
      { error: 'Failed to get learning progress', details: error.message },
      { status: 500 }
    );
  }
}

// Update learning progress (mark lesson complete, update XP)
export async function POST(request: NextRequest) {
  try {
    const { userId, lessonId, sectionsCompleted, totalSections, xpEarned } = await request.json();

    if (!userId || !lessonId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find or create progress record
    let progress = await Progress.findOne({ userId });
    if (!progress) {
      progress = await Progress.create({
        userId,
        lessonsCompleted: [],
        lessonsProgress: {},
        totalXP: 0,
        currentStreak: 0,
      });
    }

    // Initialize lessonsProgress if not exists
    if (!progress.lessonsProgress) {
      progress.lessonsProgress = {};
    }
    if (!progress.lessonsCompleted) {
      progress.lessonsCompleted = [];
    }

    const isComplete = sectionsCompleted >= totalSections;
    const existingProgress = progress.lessonsProgress.get?.(lessonId) || progress.lessonsProgress[lessonId];

    // Calculate XP (only if first time completing)
    let xpToAdd = 0;
    if (isComplete && (!existingProgress || !existingProgress.completed)) {
      xpToAdd = xpEarned || 50;
      
      // Add to completed lessons if not already there
      if (!progress.lessonsCompleted.includes(lessonId)) {
        progress.lessonsCompleted.push(lessonId);
      }
    }

    // Update lesson progress
    progress.lessonsProgress.set?.(lessonId, {
      completed: isComplete,
      sectionsCompleted,
      totalSections,
      xpEarned: existingProgress?.xpEarned || xpToAdd,
      completedAt: isComplete ? new Date() : null,
    }) || (progress.lessonsProgress[lessonId] = {
      completed: isComplete,
      sectionsCompleted,
      totalSections,
      xpEarned: existingProgress?.xpEarned || xpToAdd,
      completedAt: isComplete ? new Date() : null,
    });

    progress.totalXP = (progress.totalXP || 0) + xpToAdd;
    progress.updatedAt = new Date();
    
    await progress.save();

    // Update user XP if user exists
    if (xpToAdd > 0) {
      const user = await User.findById(userId);
      if (user) {
        user.xp = (user.xp || 0) + xpToAdd;
        
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

        return NextResponse.json({
          success: true,
          xpGained: xpToAdd,
          leveledUp,
          newLevel: user.level,
          totalXP: user.xp,
          rank: user.rank,
          message: isComplete ? 'Lesson completed!' : 'Progress saved',
        });
      }
    }

    return NextResponse.json({
      success: true,
      xpGained: xpToAdd,
      message: isComplete ? 'Lesson completed!' : 'Progress saved',
    });
  } catch (error: any) {
    console.error('Update learn progress error:', error);
    return NextResponse.json(
      { error: 'Failed to update learning progress', details: error.message },
      { status: 500 }
    );
  }
}

// Mark a lesson as started
export async function PATCH(request: NextRequest) {
  try {
    const { userId, lessonId } = await request.json();

    if (!userId || !lessonId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    let progress = await Progress.findOne({ userId });
    if (!progress) {
      progress = await Progress.create({
        userId,
        lessonsStarted: [lessonId],
        lastActiveLesson: lessonId,
      });
    } else {
      if (!progress.lessonsStarted) {
        progress.lessonsStarted = [];
      }
      if (!progress.lessonsStarted.includes(lessonId)) {
        progress.lessonsStarted.push(lessonId);
      }
      progress.lastActiveLesson = lessonId;
      progress.lastActive = new Date();
      await progress.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Lesson started',
    });
  } catch (error: any) {
    console.error('Start lesson error:', error);
    return NextResponse.json(
      { error: 'Failed to start lesson', details: error.message },
      { status: 500 }
    );
  }
}
