import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/userModel"; 

export async function GET(req) {
  await connectDB();

  const userId = req.headers.get("x-user-id"); 

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ userId }); 


    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
