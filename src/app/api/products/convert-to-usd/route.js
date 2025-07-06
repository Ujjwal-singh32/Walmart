import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/productModel";

export async function GET() {
  try {
    await connectDB();

    const INR_TO_USD = 85;
    const products = await Product.find({});

    for (const product of products) {
      const updatedBasePrice = parseFloat((product.basePrice / INR_TO_USD).toFixed(2));

      const updatedVarieties = product.variety.map((v) => ({
        ...v.toObject(),
        price: parseFloat((v.price / INR_TO_USD).toFixed(2)),
      }));

      product.basePrice = updatedBasePrice;
      product.variety = updatedVarieties;

      await product.save(); 
    }

    return NextResponse.json({
      success: true,
      message: "All product prices converted to USD and saved",
      count: products.length,
    });
  } catch (error) {
    console.error("Error saving converted prices:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
