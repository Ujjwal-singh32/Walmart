// app/api/products/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/productModel';

export async function GET() {
  await connectDB();

  try {
    const products = await Product.find({});
    return NextResponse.json({ success: true, products }, { status: 200 });
    // console.log("total" , products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}
