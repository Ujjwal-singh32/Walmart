import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/userModel";

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const { userId, points } = body;

  if (!userId || typeof points !== "number") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure walletPoints doesn't go below 0
    user.walletPoints = Math.max(0, (user.walletPoints || 0) - points);
    await user.save();

    return NextResponse.json({ success: true, remainingWalletPoints: user.walletPoints });
  } catch (err) {
    console.error("Error updating wallet points:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
