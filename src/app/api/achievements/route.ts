import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Achievement } from '@/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    await connectDB();

    const achievements = await Achievement.find({ userId }).sort({ earnedAt: -1 });

    return NextResponse.json({ achievements });
  } catch (error: any) {
    console.error('Get achievements error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements', details: error.message },
      { status: 500 }
    );
  }
}
