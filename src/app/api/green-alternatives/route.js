// File: /src/app/api/green-alternatives/route.js
import Product from "@/models/productModel";
import connectDB from "@/lib/db";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return new Response(JSON.stringify({ error: "productId is required" }), {
      status: 400,
    });
  }

  try {
    const product = await Product.findOne({ productId });

    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
      });
    }

    const alternatives = await Product.find({
      isOrganic: true,
      productId: { $ne: productId },
      tags: { $in: product.tags },
    })
      .sort({ sustainableScore: -1 })
      .limit(20);

    return new Response(JSON.stringify({ alternatives }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching green alternatives:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
