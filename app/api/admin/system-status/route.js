
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import { verifyToken } from '@/lib/auth';
import AuditEvent from '@/models/AuditEvent';

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

    // Database Status Check
    let dbStatus = 'Connected';
    try {
      await connectDB();
    } catch (error) {
      console.error('Database connection error:', error);
      dbStatus = 'Error';
    }

    // Active Sessions Check
    let activeSessionsCount = 0;
    if (dbStatus === 'Connected') {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        const activeSessions = await AuditEvent.distinct('actorId', {
          timestamp: { $gte: thirtyMinutesAgo },
        });
        activeSessionsCount = activeSessions.length;
    }


    return NextResponse.json({
      database: dbStatus,
      activeSessions: activeSessionsCount,
    });
  } catch (error) {
    console.error('Error in system status route:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
