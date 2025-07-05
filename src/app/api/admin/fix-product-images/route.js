// /app/api/admin/fix-product-images/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/productModel";

export async function GET() {
  try {
    await connectDB();

    const brokenPattern1 = "W/IMAGERENDERING_521856-T1/images/";
    const brokenPattern2 = "W/IMAGERENDERING_521856-T2/images/";

    // Find products where any image contains the broken pattern
    const products = await Product.find({
      images: {
        $elemMatch: {
          $regex: "W/IMAGERENDERING_521856-T[12]/images/",
        },
      },
    });

    if (!products.length) {
      return NextResponse.json({ success: true, message: "No broken image URLs found." });
    }

    const updatedCount = await Promise.all(
      products.map(async (product) => {
        let updated = false;
        const fixedImages = product.images.map((img) => {
          if (img.includes(brokenPattern1)) {
            updated = true;
            return img.replace(brokenPattern1, "");
          } else if (img.includes(brokenPattern2)) {
            updated = true;
            return img.replace(brokenPattern2, "");
          }
          return img;
        });

        if (updated) {
          product.images = fixedImages;
          await product.save();
        }
      })
    );

    return NextResponse.json({
      success: true,
      message: `Successfully fixed ${products.length} product(s) with broken image URLs.`,
    });
  } catch (error) {
    console.error("Error fixing product image URLs:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
