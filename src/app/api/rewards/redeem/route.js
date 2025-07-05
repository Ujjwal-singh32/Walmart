// /app/api/rewards/redeem/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/userModel";
import RedeemOrder from "@/models/redeemOrderModel";
import Order from "@/models/orderModel";

export async function POST(req) {
  await connectDB();
  const { userId, product } = await req.json();
  if (!userId || !product?.greenPoints) return NextResponse.json({ error: "Missing data" }, { status: 400 });

  const user = await User.findOne({ userId });
//   console.log(`User found in redeem: ${user}`);
  const currentPoints = user.greenStats.monthlyPointsData?.reduce((sum, m) => sum + (m.value || 0), 0) || 0;

  if (product.greenPoints > currentPoints) {
    return NextResponse.json({ success: false, message: "Not enough points" }, { status: 400 });
  }

  // Save redemption
  await RedeemOrder.create({
    userId,
    product,
    status: "Pending",
  });
  const orders = await Order.find({ user }).sort({ createdAt: -1 });

    // console.log("checking length of monthlyPointsData", user.greenStats.monthlyPointsData?.length);
  // Subtract points logically (e.g., subtract from the latest month)
  if (user.greenStats.monthlyPointsData?.length > 0) {
    let remaining = product.greenPoints;
    for (let i = user.greenStats.monthlyPointsData.length - 1; i >= 0 && remaining > 0; i--) {
      const deduct = Math.min(user.greenStats.monthlyPointsData[i].value, remaining);
      user.greenStats.monthlyPointsData[i].value -= deduct;
      remaining -= deduct;
    }
  }
//   if(orders.length > 0) {
//     let remaining = product.greenPoints;
//     for(let i=0; i<orders.length && remaining > 0; i++) {
//         const order = orders[i];
//         if (order.items  > 0) {
            
//         }
//     }
//   }

  await user.save();
  return NextResponse.json({ success: true });
}
