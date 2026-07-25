import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db/mongodb';
import GymData from '@/lib/models/GymData';

function checkAuth(cookieStore: any) {
  const token = cookieStore.get('admin-token')?.value;
  return token === 'powerhouse-authenticated-session';
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    if (!checkAuth(cookieStore)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await GymData.findOne({});
    if (!data) return NextResponse.json({ error: 'Data not found' }, { status: 404 });

    // Assuming LEADS is stored in the document, if it doesn't exist we'll just return []
    // But wait, GymData schema might not have LEADS, we should add it if it doesn't exist.
    const leads = (data as any).LEADS || [];
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const lead = await request.json();
    if (!lead || !lead.name || !lead.phone) {
      return NextResponse.json({ error: 'Missing name or phone' }, { status: 400 });
    }

    await connectToDatabase();

    const newLead = {
      id: 'l_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: lead.name,
      phone: lead.phone,
      email: lead.email || '',
      package: lead.package || 'General Inquiry',
      message: lead.message || '',
      date: new Date().toISOString(),
    };

    await GymData.findOneAndUpdate(
      {},
      { $push: { LEADS: { $each: [newLead], $position: 0 } } }, // Push to beginning of array
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit contact request' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    if (!checkAuth(cookieStore)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing lead ID' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Pull the lead with matching id from the array
    await GymData.findOneAndUpdate(
      {},
      { $pull: { LEADS: { id: id } } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
