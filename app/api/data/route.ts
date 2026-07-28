import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import GymData from '@/lib/models/GymData';
import * as fallbackData from '@/lib/constants/gym-data';

export const dynamic = 'force-dynamic';

/**
 * Public read-only data endpoint.
 * Used by GymDataContext on the client side to refresh gym data without auth.
 * Admin-sensitive fields (ADMIN_CREDENTIALS) are stripped before returning.
 */
export async function GET() {
  try {
    await connectToDatabase();
    let data = await GymData.findOne({}).lean();

    if (!data) {
      // Seed with fallback constants if DB is empty
      const seedData = {
        GYM_INFO: fallbackData.GYM_INFO,
        SERVICES: fallbackData.SERVICES,
        MEMBERSHIP_PLANS: fallbackData.MEMBERSHIP_PLANS,
        TRAINERS: fallbackData.TRAINERS,
        GALLERY_ITEMS: fallbackData.GALLERY_ITEMS,
        REVIEWS: fallbackData.REVIEWS,
        HERO: fallbackData.HERO,
        CONTACT_OPTIONS: fallbackData.CONTACT_OPTIONS,
      };
      data = await GymData.create(seedData);
    }

    // Strip sensitive admin credentials before sending to client
    const { ADMIN_CREDENTIALS, ...publicData } = data as any;

    // Merge GYM_INFO with static fallback so stale/empty DB fields (e.g. tagline)
    // are always filled from the latest constants without needing a DB migration.
    publicData.GYM_INFO = {
      ...fallbackData.GYM_INFO,         // start with latest static defaults
      ...publicData.GYM_INFO,           // DB values override static defaults
      // Re-apply static value for any field that is empty string or null in DB
      tagline: publicData.GYM_INFO?.tagline || fallbackData.GYM_INFO.tagline,
      name:    publicData.GYM_INFO?.name    || fallbackData.GYM_INFO.name,
    };

    return NextResponse.json(publicData);
  } catch (error) {
    console.error('Failed to read public data from MongoDB', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}
