import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Session } from '@/models';

// Save session (algorithm or data structure state)
export async function POST(request: NextRequest) {
  try {
    const { userId, type, name, state, thumbnail } = await request.json();

    if (!userId || !type || !name || !state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const session = await Session.create({
      userId,
      type,
      name,
      state,
      thumbnail: thumbnail || null,
    });

    return NextResponse.json({
      message: 'Session saved successfully',
      sessionId: session._id,
    });
  } catch (error: any) {
    console.error('Save session error:', error);
    return NextResponse.json(
      { error: 'Failed to save session', details: error.message },
      { status: 500 }
    );
  }
}

// Get user sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    await connectDB();

    const query: any = { userId };
    if (type) query.type = type;

    const sessions = await Session.find(query).sort({ updatedAt: -1 }).lean();

    return NextResponse.json({ sessions });
  } catch (error: any) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions', details: error.message },
      { status: 500 }
    );
  }
}

// Delete session
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    await connectDB();

    await Session.findByIdAndDelete(sessionId);

    return NextResponse.json({ message: 'Session deleted successfully' });
  } catch (error: any) {
    console.error('Delete session error:', error);
    return NextResponse.json(
      { error: 'Failed to delete session', details: error.message },
      { status: 500 }
    );
  }
}
