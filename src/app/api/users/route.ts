import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User, Progress, Leaderboard } from '@/models';
import bcrypt from 'bcryptjs';

// Register new user
export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      level: 1,
      xp: 0,
      rank: 'Beginner',
      badges: [],
    });

    // Create initial progress
    await Progress.create({
      userId: user._id,
      algorithmsCompleted: [],
      dataStructuresMastered: [],
      totalAlgorithmsCompleted: 0,
      totalDataStructuresCompleted: 0,
      totalTimeSpent: 0,
    });

    // Create leaderboard entry
    await Leaderboard.create({
      userId: user._id,
      username: user.name,
      totalXP: 0,
      algorithmsCompleted: 0,
      dataStructuresCompleted: 0,
      rank: 0,
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          level: user.level,
          xp: user.xp,
          rank: user.rank,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
}

// Get user profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const progress = await Progress.findOne({ userId });

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        level: user.level,
        xp: user.xp,
        rank: user.rank,
        badges: user.badges,
        createdAt: user.createdAt,
        lastActive: user.lastActive,
      },
      progress: progress || null,
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user', details: error.message },
      { status: 500 }
    );
  }
}
