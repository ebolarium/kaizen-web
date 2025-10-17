import { NextRequest, NextResponse } from 'next/server';
import adminConfig from '@/data/admin-config.json';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email matches admin email
    if (email === adminConfig.admin.email) {
      // In a real application, you would:
      // 1. Generate a secure reset token
      // 2. Store it in the database with an expiration time
      // 3. Send an email with the reset link
      // 4. For now, we'll just return a success message
      
      // For demo purposes, we'll simulate sending an email
      console.log(`Password reset email would be sent to: ${email}`);
      
      return NextResponse.json({
        message: 'Password reset instructions have been sent to your email address'
      });
    }

    // For security, don't reveal whether the email exists or not
    return NextResponse.json({
      message: 'If the email address exists in our system, you will receive password reset instructions'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
