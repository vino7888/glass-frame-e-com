import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Notification from '@/models/Notification';
import { getAuthUser } from '@/lib/auth';

// GET user's notifications
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    let query: any = { userId: authUser.userId };
    if (unreadOnly) {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId: authUser.userId,
      read: false,
    });

    return NextResponse.json(
      { success: true, notifications, unreadCount },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// PUT mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { notificationId, markAllAsRead } = await request.json();

    if (markAllAsRead) {
      await Notification.updateMany(
        { userId: authUser.userId, read: false },
        { read: true }
      );
    } else if (notificationId) {
      const notification = await Notification.findOne({
        _id: notificationId,
        userId: authUser.userId,
      });

      if (!notification) {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        );
      }

      notification.read = true;
      await notification.save();
    } else {
      return NextResponse.json(
        { error: 'Please provide notificationId or markAllAsRead' },
        { status: 400 }
      );
    }

    const unreadCount = await Notification.countDocuments({
      userId: authUser.userId,
      read: false,
    });

    return NextResponse.json(
      { success: true, unreadCount },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update notifications error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
