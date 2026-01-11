import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { getAuthUser } from '@/lib/auth';
import mongoose from 'mongoose';
import { sendOrderUpdateNotifications, sendShippingUpdateNotifications } from '@/lib/notifications';

// GET single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    
    // Handle both sync and async params (Next.js 15+)
    const resolvedParams = await Promise.resolve(params);
    const orderId = resolvedParams.id;
    
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId)
      .populate('userId', 'name email')
      .populate('items.productId');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this order.
    // `order.userId` may be an ObjectId or a populated User document. Normalize to the id string.
    const orderUserId = (order.userId as any)?._id?.toString?.() || (order.userId as any)?.toString?.();
    if (authUser.role !== 'admin' && orderUserId !== authUser.userId?.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Ensure returned order is a plain object and items include `product` (frontend expects item.product)
    await order.populate('items.productId');
    const orderObj = (order as any).toObject ? (order as any).toObject() : order;
    orderObj.items = (orderObj.items || []).map((it: any) => {
      const product = it.productId || null;
      return {
        ...it,
        product,
        productId: product?._id?.toString ? product._id.toString() : (it.productId?.toString ? it.productId.toString() : it.productId),
      };
    });

    return NextResponse.json(
      { success: true, order: orderObj },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// PUT update order (Admin only for status/shipping, user can't update)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    
    // Handle both sync and async params (Next.js 15+)
    const resolvedParams = await Promise.resolve(params);
    const orderId = resolvedParams.id;
    
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (authUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const { status, shippingDetails } = await request.json();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const oldStatus = order.status;

    if (status) {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        );
      }
      order.status = status;
    }

    if (shippingDetails) {
      if (!order.shippingDetails) {
        order.shippingDetails = {};
      }
      if (shippingDetails.carrier) {
        order.shippingDetails.carrier = shippingDetails.carrier;
      }
      if (shippingDetails.trackingNumber) {
        order.shippingDetails.trackingNumber = shippingDetails.trackingNumber;
        order.trackingNumber = shippingDetails.trackingNumber;
      }
      if (shippingDetails.estimatedDelivery) {
        order.shippingDetails.estimatedDelivery = new Date(shippingDetails.estimatedDelivery);
      }
    }

    await order.save();

    // Send notifications if status changed
    if (status && status !== oldStatus) {
      await sendOrderUpdateNotifications(
        order._id.toString(),
        status,
        order.userId.toString(),
        `Your order status has been updated to ${status}`
      );
    }

    // Send shipping notification if tracking number added
    if (shippingDetails?.trackingNumber && !oldStatus.includes('shipped')) {
      await sendShippingUpdateNotifications(
        order._id.toString(),
        shippingDetails.trackingNumber,
        order.userId.toString(),
        shippingDetails.carrier
      );
    }

    await order.populate('items.productId');
    const orderObj = (order as any).toObject ? (order as any).toObject() : order;
    orderObj.items = (orderObj.items || []).map((it: any) => {
      const product = it.productId || null;
      return {
        ...it,
        product,
        productId: product?._id?.toString ? product._id.toString() : (it.productId?.toString ? it.productId.toString() : it.productId),
      };
    });

    return NextResponse.json(
      { success: true, order: orderObj },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
