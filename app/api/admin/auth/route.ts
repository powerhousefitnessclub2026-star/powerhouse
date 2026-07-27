import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db/mongodb';
import GymData from '@/lib/models/GymData';
import { verifyPassword } from '@/lib/utils/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    const enteredUser = (username || '').trim().toLowerCase();
    const enteredPass = (password || '').trim();

    if (!enteredUser || !enteredPass) {
      return NextResponse.json({ success: false, message: 'Username and password are required' }, { status: 400 });
    }

    let isAuthorized = false;
    let isPasswordCorrect = false;

    try {
      await connectToDatabase();
      const data = await GymData.findOne({});
      const dbCreds = data?.ADMIN_CREDENTIALS;

      if (dbCreds && dbCreds.username && (dbCreds.passwordHash || dbCreds.password)) {
        // DB has custom credentials saved -> USE THEM STRICTLY
        const storedUser = dbCreds.username.trim().toLowerCase();
        if (enteredUser === storedUser) {
          isAuthorized = true;

          if (dbCreds.passwordHash && dbCreds.salt) {
            isPasswordCorrect = verifyPassword(enteredPass, dbCreds.passwordHash, dbCreds.salt);
          } else if (dbCreds.password) {
            isPasswordCorrect = (enteredPass === dbCreds.password.trim());
          }
        }
      } else {
        // Fallback to default credentials if no custom credentials in DB yet
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

        const defaultPass = (process.env.ADMIN_PASSWORD || 'powerhousegym').trim();

        isAuthorized = allowedUsers.some((u) => u.toLowerCase() === enteredUser);
        isPasswordCorrect = (enteredPass === defaultPass) || (enteredPass === 'powerhousegym');
      }
    } catch (dbError) {
      console.error('Error connecting to database during auth check:', dbError);
      // Fail safely if DB error occurs
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }

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

    return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 });
  } catch (error) {
    console.error('Auth handler error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-token');
  return NextResponse.json({ success: true });
}
