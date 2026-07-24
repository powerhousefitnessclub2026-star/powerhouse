import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db/mongodb';
import GymData from '@/lib/models/GymData';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function checkAuth(cookieStore: any) {
  const token = cookieStore.get('admin-token')?.value;
  return token === 'powerhouse-authenticated-session';
}

const dataFilePath = path.join(process.cwd(), 'lib/constants/gym-data.json');

export async function GET() {
  try {
    await connectToDatabase();
    let data = await GymData.findOne({});

    if (!data) {
      // Seed database with local JSON if empty
      if (fs.existsSync(dataFilePath)) {
        const dataStr = fs.readFileSync(dataFilePath, 'utf8');
        const localData = JSON.parse(dataStr);
        data = await GymData.create(localData);
      } else {
        return NextResponse.json({ error: 'No data available' }, { status: 404 });
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to read data from MongoDB', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    if (!checkAuth(cookieStore)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newData = await request.json();
    if (!newData) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await connectToDatabase();

    // Use findOneAndUpdate with upsert to create or update the single config document
    await GymData.findOneAndUpdate(
      {},
      { $set: newData },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to write data to MongoDB', error);
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
