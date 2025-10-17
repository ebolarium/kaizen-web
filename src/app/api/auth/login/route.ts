import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import adminConfig from '@/data/admin-config.json';

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

    // Check credentials
    if (username === adminConfig.admin.username) {
      const isValidPassword = await bcrypt.compare(password, adminConfig.admin.password);
      
      if (isValidPassword) {
        // Generate JWT token
        const token = jwt.sign(
          { username: adminConfig.admin.username, role: 'admin' },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        return NextResponse.json({
          message: 'Login successful',
          token,
          user: {
            username: adminConfig.admin.username,
            email: adminConfig.admin.email
          }
        });
      }
    }

    return NextResponse.json(
      { message: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
