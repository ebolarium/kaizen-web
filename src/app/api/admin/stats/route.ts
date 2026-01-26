import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/mongodb';
import Project from '@/lib/models/Project';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const localCount = await Project.countDocuments({ category: 'local' });
    const ka1Count = await Project.countDocuments({
      category: { $in: ['ka152', 'ka153'] }
    });
    const ka2Count = await Project.countDocuments({
      category: { $in: ['ka210', 'ka220'] }
    });

    return NextResponse.json({
      localCount,
      ka1Count,
      ka2Count
    });
  } catch (error) {
    console.error('Error loading stats:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
