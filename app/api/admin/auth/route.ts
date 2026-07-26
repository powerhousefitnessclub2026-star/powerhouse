import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db/mongodb';
import GymData from '@/lib/models/GymData';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    let defaultPass = (process.env.ADMIN_PASSWORD || 'powerhousegym').trim();
    const enteredUser = (username || '').trim().toLowerCase();
    const enteredPass = (password || '').trim();

    let isPasswordCorrect = (enteredPass === defaultPass) || (enteredPass === 'powerhousegym');

    // Only query DB for custom password if default check fails
    if (!isPasswordCorrect) {
      try {
        await connectToDatabase();
        const data = await GymData.findOne({});
        if (data && data.ADMIN_CREDENTIALS && data.ADMIN_CREDENTIALS.password) {
          if (enteredPass === data.ADMIN_CREDENTIALS.password.trim()) {
            isPasswordCorrect = true;
          }
        }
      } catch (e) {
        console.error('Error reading admin credentials from MongoDB', e);
      }
    }

    // Configured authorized usernames / emails
    let allowedUsers = [
      'powerhouse',
      'powerhousefitnessclub2026@gmail.com',
      'akalyakrish14@gmail.com'
    ];

    if (process.env.AUTHORIZED_EMAILS) {
      allowedUsers = [
        ...allowedUsers,
        ...process.env.AUTHORIZED_EMAILS.split(',').map((e) => e.trim().toLowerCase())
      ];
    }

    const isAuthorized = allowedUsers.some((u) => u.toLowerCase() === enteredUser);

    if (isAuthorized && isPasswordCorrect) {
      const cookieStore = await cookies();
      cookieStore.set('admin-token', 'powerhouse-authenticated-session', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-token');
  return NextResponse.json({ success: true });
}
