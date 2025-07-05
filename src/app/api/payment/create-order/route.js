import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const order = body.order;

    if (!order || !order.totalAmount) {
      return NextResponse.json(
        { error: "totalAmount is required" },
        { status: 400 }
      );
    }

    const options = {
      amount: order.totalAmount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // You can store `order` in your DB here if needed

    return NextResponse.json({
      orderId: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ error: "Server Error", details: error }, { status: 500 });
  }
}
