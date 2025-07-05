import Product from "@/models/productModel";
import connectDB from "@/lib/db";

export async function GET() {
  await connectDB();

  try {
    const products = await Product.find({});
    const updated = [];

    for (let product of products) {
      if (!Array.isArray(product.tags)) continue;

      // Flatten all tag values (some may be comma-separated)
      const newTags = product.tags
        .flatMap(tag =>
          tag
            .split(",")                   // Split comma-separated
            .map(t => t.trim().toLowerCase())
            .filter(Boolean)
        );

      // Check if we actually need to update
      const original = product.tags.map(t => t.trim().toLowerCase()).sort().join(",");
      const cleaned = [...new Set(newTags)].sort().join(",");

      if (original !== cleaned) {
        product.tags = [...new Set(newTags)];
        await product.save();
        updated.push(product.productId);
      }
    }

    return new Response(
      JSON.stringify({ message: `Tags updated for ${updated.length} products`, updated }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating tags:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
