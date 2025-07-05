// app/api/products/greenkart/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/productModel';

export async function GET() {
  await connectDB();

  try {
    // Fetch only organic products, limit to 100 for performance
    const organicProducts = await Product.find({ isOrganic: true }).limit(100);

    return NextResponse.json({ success: true, products: organicProducts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching GreenKart organic products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organic products' },
      { status: 500 }
    );
  }
}
