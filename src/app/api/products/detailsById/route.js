import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/productModel';

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await Product.findOne({ productId });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product }, { status: 200 });

  } catch (error) {
    console.error('Error fetching product by productId:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
