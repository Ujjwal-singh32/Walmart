// /app/api/update-green-stats/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/userModel";

export async function POST(req) {
  await connectDB();

  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const months = ["Mar", "Apr", "May" ,"Jun"];

    // Unique values for each stat
    const monthlyCarbonData = months.map(month => ({
      month,
      value: parseFloat((Math.random() * 100 + 100).toFixed(2))
    }));

    const monthlyPointsData = months.map(month => ({
      month,
      value: parseFloat((Math.random() * 150 + 50).toFixed(2)) // Points may be in a different range
    }));

    const monthlyEmissionsData = months.map(month => ({
      month,
      value: parseFloat((Math.random() * 80 + 120).toFixed(2))
    }));

    const monthlyPlasticsData = months.map(month => ({
      month,
      value: parseFloat((Math.random() * 20 + 10).toFixed(2))
    }));

    const monthlyWaterData = months.map(month => ({
      month,
      value: parseFloat((Math.random() * 220 + 100).toFixed(2)) // Water saved in liters
    }));

    const monthlyGroupedOrdersData = months.map(month => ({
      month,
      value: Math.floor(Math.random() * 10 + 1)
    }));

    const updateFields = {
      "greenStats.monthlyCarbonData": monthlyCarbonData,
      "greenStats.monthlyPointsData": monthlyPointsData,
      "greenStats.monthlyEmissionsData": monthlyEmissionsData,
      "greenStats.monthlyPlasticsData": monthlyPlasticsData,
      "greenStats.monthlyWaterData": monthlyWaterData,
      "greenStats.monthlyGroupedOrdersData": monthlyGroupedOrdersData
    };

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Green stats updated successfully with varied values",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating green stats:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
