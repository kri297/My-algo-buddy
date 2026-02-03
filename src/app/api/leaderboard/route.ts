import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Leaderboard, User } from '@/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const sortBy = searchParams.get('sortBy') || 'totalXP';

    await connectDB();

    const sortField: any = {};
    sortField[sortBy] = -1;

    const leaderboard = await Leaderboard.find()
      .sort(sortField)
      .limit(limit)
      .lean();

    // Update ranks
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    // Fetch user images
    const userIds = leaderboard.map((entry) => entry.userId);
    const users = await User.find({ _id: { $in: userIds } }).select('_id image');
    const userImageMap = new Map(users.map((u) => [u._id.toString(), u.image]));

    const enrichedLeaderboard = leaderboard.map((entry) => ({
      ...entry,
      image: userImageMap.get(entry.userId.toString()) || null,
    }));

    return NextResponse.json({ leaderboard: enrichedLeaderboard });
  } catch (error: any) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard', details: error.message },
      { status: 500 }
    );
  }
}
