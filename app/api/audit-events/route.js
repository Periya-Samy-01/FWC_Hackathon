
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { connectDB } from '@/lib/dbConnect';
import AuditEvent from '@/models/AuditEvent';
import User from '@/models/User';

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

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const actorName = searchParams.get('actorName');

    let query = {};

    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (actorName) {
      const users = await User.find({ name: new RegExp(actorName, 'i') }).select('_id');
      const userIds = users.map(user => user._id);
      query.actorId = { $in: userIds };
    }

    const auditEvents = await AuditEvent.find(query)
      .populate('actorId', 'name')
      .sort({ timestamp: -1 });

    return NextResponse.json(auditEvents);
  } catch (error) {
    console.error('Error fetching audit events:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
