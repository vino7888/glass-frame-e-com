import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/auth';
import { sendPaymentConfirmationNotification, sendNewOrderNotifications } from '@/lib/notifications';

// GET user's orders or all orders (admin)
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

    let orders;
    if (authUser.role === 'admin') {
      orders = await Order.find()
        .populate('userId', 'name email')
        .populate('items.productId')
        .sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ userId: authUser.userId })
        .populate('items.productId')
        .sort({ createdAt: -1 });
    }

    return NextResponse.json(
      { success: true, orders },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// POST create new order
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { shippingAddress, paymentMethod } = await request.json();

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
      return NextResponse.json(
        { error: 'Please provide complete shipping address' },
        { status: 400 }
      );
    }

    // Get user's cart with populated products
    const cart = await Cart.findOne({ userId: authUser.userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Calculate total and prepare order items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      // Extract product - handle both populated object and ObjectId
      const product = item.productId && typeof item.productId === 'object' && 'name' in item.productId
        ? item.productId  // Already populated
        : await Product.findById(item.productId);  // Need to fetch
      
      if (!product) {
        const productId = item.productId?._id || item.productId;
        return NextResponse.json(
          { error: `Product ${productId} not found` },
          { status: 404 }
        );
      }

      const productId = product._id || item.productId;
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Generate tracking number
    const trackingNumber = `TRK${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Create order
    const order = await Order.create({
      userId: authUser.userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentStatus: 'paid', // Mock payment - always succeeds
      status: 'pending',
      trackingNumber,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    // Send notifications
    await sendPaymentConfirmationNotification(authUser.userId, order._id.toString(), totalAmount);
    await sendNewOrderNotifications(order._id.toString(), totalAmount);

    await order.populate('items.productId');

    return NextResponse.json(
      { success: true, order },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
