import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db/mongodb';
import GymData from '@/lib/models/GymData';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    let validUsername = process.env.ADMIN_USERNAME || 'powerhouse';
    let validPassword = process.env.ADMIN_PASSWORD || 'powerhousegym';

    try {
      await connectToDatabase();
      const data = await GymData.findOne({});
      
      if (data && data.ADMIN_CREDENTIALS) {
        if (data.ADMIN_CREDENTIALS.username) validUsername = data.ADMIN_CREDENTIALS.username;
        if (data.ADMIN_CREDENTIALS.password) validPassword = data.ADMIN_CREDENTIALS.password;
      }
    } catch (e) {
      console.error('Error reading admin credentials from MongoDB', e);
    }

    if (username === validUsername && password === validPassword) {
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
