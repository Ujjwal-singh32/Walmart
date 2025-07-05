// app/api/products/home/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/productModel';

export async function GET() {
  await connectDB();

  try {
    // Fetch 200 random products using MongoDB aggregation
    const products = await Product.aggregate([{ $sample: { size: 100 } }]);

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    console.error('Error fetching home products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch home products' },
      { status: 500 }
    );
  }
}
