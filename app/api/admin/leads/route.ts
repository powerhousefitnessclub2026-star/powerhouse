import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

function checkAuth(cookieStore: any) {
  const token = cookieStore.get('admin-token')?.value;
  return token === 'powerhouse-authenticated-session';
}

const dataFilePath = path.join(process.cwd(), 'lib/constants/gym-data.json');

function readData() {
  if (!fs.existsSync(dataFilePath)) return null;
  return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
}

function writeData(data: any) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    if (!checkAuth(cookieStore)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = readData();
    if (!data) return NextResponse.json({ error: 'Data file not found' }, { status: 404 });

    return NextResponse.json(data.LEADS || []);
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

    const data = readData();
    if (!data) return NextResponse.json({ error: 'Data file not found' }, { status: 404 });

    const newLead = {
      id: 'l_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: lead.name,
      phone: lead.phone,
      email: lead.email || '',
      package: lead.package || 'General Inquiry',
      message: lead.message || '',
      date: new Date().toISOString(),
    };

    data.LEADS = data.LEADS || [];
    data.LEADS.unshift(newLead);

    writeData(data);
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

    const data = readData();
    if (!data) return NextResponse.json({ error: 'Data not found' }, { status: 404 });

    data.LEADS = (data.LEADS || []).filter((l: any) => l.id !== id);
    writeData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
