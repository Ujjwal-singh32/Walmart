// /app/api/products/delete-no-image/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/productModel";

export async function DELETE() {
  try {
    await connectDB();

    // Define the condition: products with no images or empty image arrays
    const filter = {
      $or: [
        { images: { $exists: false } },
        { images: { $eq: [] } },
        { images: { $size: 0 } },
        { images: null }
      ]
    };

    // Delete the products matching the condition
    const result = await Product.deleteMany(filter);

    return NextResponse.json({
      success: true,
      message: "Products without images deleted",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting products without images:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
