// /app/api/products/reset-sustainability/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/productModel';

export async function PUT() {
  try {
    await connectDB();

    const filter = {
      isOrganic: false,
      $or: [
        { sustainableScore: { $ne: 0 } },
        { energyUsed: { $ne: 0 } },
        { emissions: { $ne: 0 } },
        { greenPoints: { $ne: 0 } },
        { waterSaved: { $ne: 0 } },
        { plasticAvoided: { $ne: 0 } }
      ]
    };

    const update = {
      sustainableScore: 0,
      energyUsed: 0,
      emissions: 0,
      greenPoints: 0,
      waterSaved: 0,
      plasticAvoided: 0
    };

    const result = await Product.updateMany(filter, { $set: update });

    return NextResponse.json({
      success: true,
      message: "Sustainability info reset for inOrganic products",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Error resetting sustainability info:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
