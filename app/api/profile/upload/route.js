import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { verifyToken } from '@/lib/auth';
import User from '@/models/User';
import { connectDB } from '@/lib/dbConnect';

export async function POST(req) {
  try {
    await connectDB();

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('profilePicture');

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const filename = `${decoded.sub}-${Date.now()}${path.extname(file.name)}`;
    const imagePath = path.join(process.cwd(), 'public/images', filename);
    const imageUrl = `/images/${filename}`;

    await writeFile(imagePath, buffer);

    const user = await User.findByIdAndUpdate(
      decoded.sub,
      { 'profile.photoUrl': imageUrl },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Profile picture uploaded successfully',
      photoUrl: user.profile.photoUrl,
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
