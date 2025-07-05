// /app/api/users/address/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/userModel";

export async function PUT(req) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ success: false, message: "Missing userId header" }, { status: 400 });
    }

    const body = await req.json();
    const { shippingAddress } = body;

    if (!Array.isArray(shippingAddress) || shippingAddress.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid or empty address array" }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { $set: { address: shippingAddress } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Address updated", user: updatedUser });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
