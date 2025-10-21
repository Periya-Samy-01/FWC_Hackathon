
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { connectDB } from '@/lib/dbConnect';
import CompanySetting from '@/models/CompanySetting';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const settings = await CompanySetting.findOne();

    const settingsToSend = {
      companyName: settings?.companyName || '',
      logoUrl: settings?.logoUrl || '',
      geminiApiKeyIsSet: !!process.env.GEMINI_API_KEY,
    };

    return NextResponse.json(settingsToSend);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();

    let settings = await CompanySetting.findOne();
    if (!settings) {
      settings = new CompanySetting();
    }

    if (Object.prototype.hasOwnProperty.call(body, 'companyName')) {
      settings.companyName = body.companyName;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'logoUrl')) {
      settings.logoUrl = body.logoUrl;
    }

    await settings.save();

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
