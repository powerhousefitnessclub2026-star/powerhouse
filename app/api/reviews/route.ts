import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'lib/constants/gym-data.json');

export async function POST(request: Request) {
  try {
    const newReview = await request.json();
    if (!newReview || !newReview.name || !newReview.comment) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    let existingData: any = {};
    if (fs.existsSync(dataFilePath)) {
      existingData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    }

    if (!existingData.REVIEWS) {
      existingData.REVIEWS = [];
    }

    // Force status to approved for new public reviews
    newReview.status = 'approved';
    existingData.REVIEWS.push(newReview);

    fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
