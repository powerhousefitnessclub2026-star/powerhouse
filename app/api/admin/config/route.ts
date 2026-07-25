import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db/mongodb';
import GymData from '@/lib/models/GymData';

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
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    await connectToDatabase();
    await GymData.findOneAndUpdate(
      {},
      { $set: { ADMIN_CREDENTIALS: { username, password } } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update credentials' }, { status: 500 });
  }
}
