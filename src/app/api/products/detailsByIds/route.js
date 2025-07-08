import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/productModel';

export async function POST(req) {
  await connectDB();
  try {
    const { productIds } = await req.json();
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ success: false, error: 'Product IDs are required' }, { status: 400 });
    }
    const products = await Product.find({ productId: { $in: productIds } });
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products by productIds:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}
