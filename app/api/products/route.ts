import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/auth';

// GET all products
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const products = await Product.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, products },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// POST create new product (Admin only)
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

    if (authUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { name, description, price, image } = await request.json();

    if (!name || !description || !price || !image) {
      return NextResponse.json(
        { error: 'Please provide all fields' },
        { status: 400 }
      );
    }

    if (price < 0) {
      return NextResponse.json(
        { error: 'Price must be positive' },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      description,
      price,
      image,
      createdBy: authUser.userId,
    });

    return NextResponse.json(
      { success: true, product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
