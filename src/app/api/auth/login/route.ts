import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

