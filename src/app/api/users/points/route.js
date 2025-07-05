// /app/api/users/points/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/userModel";

export async function GET(req) {
  await connectDB();
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await User.findOne({ userId }).lean();
  return NextResponse.json({ points: user?.greenStats?.monthlyPointsData?.reduce((sum, m) => sum + (m.value || 0), 0) || 0 });
}
