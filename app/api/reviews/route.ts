import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import GymData from '@/lib/models/GymData';

// ─── Simple in-memory rate limiter ──────────────────────────────────────────
// Max 3 review submissions per IP per 10 minutes
const RATE_LIMIT = 3;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const ipMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true; // allowed
  }
  if (entry.count >= RATE_LIMIT) return false; // blocked
  entry.count++;
  return true; // allowed
}

export async function POST(request: Request) {
  try {
    // Rate limit check
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many review submissions. Please wait 10 minutes and try again.' },
        { status: 429 }
      );
    }

    const newReview = await request.json();
    if (!newReview || !newReview.name || !newReview.comment) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await connectToDatabase();

    // Force status to pending for new public reviews so admin can approve them later
    // Wait, the user said "automatic ah show agula website la" (it doesn't show automatically on the website)
    // This implies they WANT it to show automatically without admin approval!
    // So let's force it to 'approved'
    newReview.status = 'approved';

    // Use atomic $push to add the review safely
    await GymData.findOneAndUpdate(
      {},
      { $push: { REVIEWS: newReview } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to submit review:', error);
    return NextResponse.json({ error: error.message || 'Failed to write data' }, { status: 500 });
  }
}
