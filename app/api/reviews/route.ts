import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import GymData from '@/lib/models/GymData';

export async function POST(request: Request) {
  try {
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
