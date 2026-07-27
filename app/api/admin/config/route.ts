import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db/mongodb';
import GymData from '@/lib/models/GymData';
import { hashPassword } from '@/lib/utils/auth';

function checkAuth(cookieStore: any) {
  const token = cookieStore.get('admin-token')?.value;
  return token === 'powerhouse-authenticated-session';
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    if (!checkAuth(cookieStore)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, password } = await request.json();
    const cleanUser = (username || '').trim();
    const cleanPass = (password || '').trim();

    if (!cleanUser || !cleanPass) {
      return NextResponse.json({ error: 'Username and password cannot be empty' }, { status: 400 });
    }

    if (cleanUser.length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters long' }, { status: 400 });
    }

    if (cleanPass.length < 4) {
      return NextResponse.json({ error: 'Password must be at least 4 characters long' }, { status: 400 });
    }

    const { hash, salt } = hashPassword(cleanPass);

    await connectToDatabase();
    await GymData.findOneAndUpdate(
      {},
      { 
        $set: { 
          ADMIN_CREDENTIALS: { 
            username: cleanUser, 
            passwordHash: hash, 
            salt: salt,
            // Keep plaintext password for legacy migration compatibility if needed, but primary is passwordHash
            password: cleanPass,
            updatedAt: new Date().toISOString()
          } 
        } 
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Admin credentials updated successfully' });
  } catch (error) {
    console.error('Error updating admin config:', error);
    return NextResponse.json({ error: 'Failed to update credentials' }, { status: 500 });
  }
}

