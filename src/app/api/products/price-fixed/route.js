import { NextResponse } from "next/server";
import Product from "@/models/productModel";
import connectDB from "@/lib/db";

export async function GET(req) {
  try {
    await connectDB();

    // Step 1: Fetch all products with invalid price
    const invalidProducts = await Product.find({
      $or: [
        {
          basePrice: { $not: { $type: "number" } }
        },
        {
          basePrice: { $lt: 100 }
        },
        {
          basePrice: { $exists: false }
        },
      ],
    });

    const updates = [];

    for (const product of invalidProducts) {
      const newPrice = parseFloat((Math.random() * 1000).toFixed(2)) + 200;

      await Product.updateOne(
        { _id: product._id },
        {
          $set: {
            basePrice: newPrice
          }
        }
      );

      updates.push({ id: product._id, oldPrice: product.price, newPrice });
    }

    return NextResponse.json({
      message: `${updates.length} products updated.`,
      updates,
    });
  } catch (error) {
    console.error("Error fixing prices:", error);
    return NextResponse.json(
      { error: "Failed to fix product prices." },
      { status: 500 }
    );
  }
}
