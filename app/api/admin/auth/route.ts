import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const configFilePath = path.join(process.cwd(), 'lib/constants/admin-config.json');

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    let validUsername = 'powerhouse';
    let validPassword = 'powerhousegym';

    if (fs.existsSync(configFilePath)) {
      try {
        const configStr = fs.readFileSync(configFilePath, 'utf8');
        const config = JSON.parse(configStr);
        if (config.username) validUsername = config.username;
        if (config.password) validPassword = config.password;
      } catch (e) {
        console.error('Error reading admin config', e);
      }
    }

    if (username === validUsername && password === validPassword) {
      const cookieStore = await cookies();
      cookieStore.set('admin-token', 'powerhouse-authenticated-session', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-token');
  return NextResponse.json({ success: true });
}
