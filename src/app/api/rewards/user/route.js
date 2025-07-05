// /app/api/rewards/user/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import RedeemOrder from "@/models/redeemOrderModel";

export async function GET(req) {
  try {
    await connectDB();
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 });
    }

    const rewards = await RedeemOrder.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, rewards });
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
