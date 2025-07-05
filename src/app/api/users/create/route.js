// /app/api/users/create/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/userModel";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, name, email, phone } = body;

    if (!userId || !name || !email) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await User.findOne({ userId });

    if (existingUser) {
      return NextResponse.json({ success: true, user: existingUser });
    }

    const newUser = new User({
      userId,
      name,
      email,
      phone: phone || "",
      address: [],
      isPrimeMember: false,
      memberSince: null,
      isTrustedReviewer: false,
      ordersPlaced: 0,
      greenStats: {
        monthlyCarbonData: [],
        monthlyPointsData: [],
        monthlyEmissionsData: [],
        monthlyPlasticsData: [],
        monthlyWaterData: [],
        monthlyGroupedOrdersData: [],
      },
      lastStatsUpdatedAt: new Date(),
    });

    await newUser.save();

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error in minimal user creation:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
