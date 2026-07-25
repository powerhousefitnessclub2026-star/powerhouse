import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db/mongodb';
import GymData from '@/lib/models/GymData';
import * as fallbackData from '@/lib/constants/gym-data';

export const dynamic = 'force-dynamic';

function checkAuth(cookieStore: any) {
  const token = cookieStore.get('admin-token')?.value;
  return token === 'powerhouse-authenticated-session';
}

export async function GET() {
  try {
    await connectToDatabase();
    let data = await GymData.findOne({});

    if (!data) {
      // Seed database with imported constants if empty
      const localData = {
        GYM_INFO: fallbackData.GYM_INFO,
        SERVICES: fallbackData.SERVICES,
        MEMBERSHIP_PLANS: fallbackData.MEMBERSHIP_PLANS,
        TRAINERS: fallbackData.TRAINERS,
        GALLERY_ITEMS: fallbackData.GALLERY_ITEMS,
        REVIEWS: fallbackData.REVIEWS,
        HERO: fallbackData.HERO,
        CONTACT_OPTIONS: fallbackData.CONTACT_OPTIONS
      };
      data = await GymData.create(localData);
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
