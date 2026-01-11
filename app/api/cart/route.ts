import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/auth';
import mongoose from 'mongoose';

// GET user's cart
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

    let cart = await Cart.findOne({ userId: authUser.userId }).populate('items.productId');
    
    if (!cart) {
      cart = await Cart.create({
        userId: authUser.userId,
        items: [],
      });
    }

    return NextResponse.json(
      { success: true, cart },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// POST add item to cart
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

    const { productId, quantity } = await request.json();

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Please provide productId and quantity' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    let cart = await Cart.findOne({ userId: authUser.userId });
    
    if (!cart) {
      cart = await Cart.create({
        userId: authUser.userId,
        items: [],
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    await cart.populate('items.productId');

    return NextResponse.json(
      { success: true, cart },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// PUT update cart item
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

    const { productId, quantity } = await request.json();

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Please provide productId and quantity' },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId: authUser.userId });
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.productId');

    return NextResponse.json(
      { success: true, cart },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE remove item from cart
export async function DELETE(request: NextRequest) {
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
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Please provide productId' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId: authUser.userId });
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    cart.items = cart.items.filter(
      (item: any) => item.productId.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.productId');

    return NextResponse.json(
      { success: true, cart },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
