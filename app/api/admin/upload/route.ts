import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: 'z4lkvtpv', 
  api_key: '971678176673734', 
  api_secret: 'S1ZUPUdUwR3E30LCCkg2l2X9Qy0'
});

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64String = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;

    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: 'powerhouse',
      resource_type: 'auto',
    });

    return NextResponse.json({ success: true, url: uploadResponse.secure_url });
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
