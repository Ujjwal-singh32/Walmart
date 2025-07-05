import { NextResponse } from "next/server";
import Order from "@/models/orderModel";
import Product from "@/models/productModel";
import User from "@/models/userModel";
import connectDB from "@/lib/db";

export async function GET(req) {
  await connectDB();

  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Step 1: Fetch orders for the user
    const orders = await Order.find({ user: userId })
      .sort({ placedAt: -1 })
      .lean();

    // console.log("orders checking with mtech",  JSON.stringify(orders, null, 2));
    // Step 2: Collect unique productIds
    const productUUIDs = [
      ...new Set(
        orders.flatMap((order) =>
          order.items.map((item) => (item.productId))
        )
      ),
    ];
    // console.log("ppid" , productUUIDs);
    // Step 3: Fetch product details
    const products = await Product.find({
      productId: { $in: productUUIDs },
    }).lean();

    const productMap = new Map(products.map((p) => [(p.productId), p]));

    // Step 4: Get user info from Clerk
    const userInfo = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then((res) => res.json());

    // Step 5: Attach product + user info
    const formatted = orders.map((order) => ({
      ...order,
      userInfo: {
        name: [userInfo.first_name, userInfo.last_name].filter(Boolean).join(" "),
        email: userInfo.email_addresses?.[0]?.email_address || "",
        phone: userInfo.phone_numbers?.[0]?.phone_number || "",
      },
      items: order.items.map((item) => ({
        ...item,
        // console.log("item.productId" , item.productId),
        product: productMap.get(item.productId) || null, // issue
      })),
    }));


    // console.log("orders from the backend", JSON.stringify(formatted, null, 2));
    return NextResponse.json({ orders: formatted });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
