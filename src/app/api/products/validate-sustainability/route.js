import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/productModel";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({ isOrganic: true });

    const updatedProducts = [];

    for (const product of products) {
      let updated = false;

      const updateFields = [
        "sustainableScore",
        "energyUsed",
        "emissions",
        "greenPoints",
        "waterSaved",
        "plasticAvoided",
      ];

      updateFields.forEach((field) => {
        const value = product[field];
        if (typeof value !== "number" || value <= 0 || value >= 100) {
          product[field] = Math.floor(Math.random() * 99) + 1;
          updated = true;
        }
      });

      if (updated) {
        await product.save();
        updatedProducts.push(product);
      }
    }

    return NextResponse.json({
      success: true,
      updatedCount: updatedProducts.length,
      updatedProducts,
    });
  } catch (error) {
    console.error("Error validating products:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
