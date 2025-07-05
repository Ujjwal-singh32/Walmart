import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import Product from "@/models/productModel";

export async function POST(req) {
  try {
    const body = await req.json();
    const { order } = body;

    if (
      !order ||
      !order.user ||
      !order.items ||
      !order.shippingAddress
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid order data" },
        { status: 400 }
      );
    }

    await connectDB();

    // Save new order
    const newOrder = await Order.create({
      user: order.user,
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
      })),
      totalAmount: order.totalAmount,
      paymentStatus: "paid",
      orderStatus: "placed",
      shippingAddress: order.shippingAddress,
      deliveryOption: order.deliveryOption || "individual",
      packagingPoints: order.packagingPoints || 0,
      placedAt: new Date(),
    });

    // Upsert user and update sustainability stats
    const { user: userId, name, email, phone } = order;

    let existingUser = await User.findOne({ userId });
    const month = new Date().toLocaleString("default", { month: "short" });

    // Calculate sustainability impact for the current order
    let orderStats = {
      carbon: 0,
      points: 0,
      emissions: 0,
      plastics: 0,
      water: 0,
      groupedOrders: order.deliveryOption === "group" ? 1 : 0,
    };
    // console.log("packagingPoints", order.packagingPoints);
    orderStats.points+= Math.floor(order.packagingPoints );

    for (const item of order.items) {
      const product = await Product.findOne({ productId: item.productId });
      if (!product) continue;

      const qty = item.quantity || 1;

      orderStats.carbon += parseFloat((product.sustainableScore * qty).toFixed(2));
      orderStats.points += Math.floor(product.greenPoints * qty);
       
      orderStats.emissions += parseFloat((product.emissions * qty).toFixed(2));
      orderStats.plastics += parseFloat((product.plasticAvoided * qty).toFixed(2));
      orderStats.water += parseFloat((product.waterSaved * qty).toFixed(2));

    }

    if (!existingUser) {
      // New user creation
      const newUser = new User({
        userId,
        name,
        email,
        phone: phone || "",
        address: order.shippingAddress ? [order.shippingAddress] : [],
        isPrimeMember: false,
        memberSince: null,
        isTrustedReviewer: true,
        ordersPlaced: 1,
        ecoPackages: originalOrder.packagingPoints > 0 ? 1 : 0,
        lastStatsUpdatedAt: new Date(),
        greenStats: {
          monthlyCarbonData: [{ month, value: orderStats.carbon }],
          monthlyPointsData: [{ month, value: orderStats.points }],
          monthlyEmissionsData: [{ month, value: orderStats.emissions }],
          monthlyPlasticsData: [{ month, value: orderStats.plastics }],
          monthlyWaterData: [{ month, value: orderStats.water }],
          monthlyGroupedOrdersData: [
            { month, value: orderStats.groupedOrders },
          ],
        },
      });
      await newUser.save();
    } else {
      // Update existing user
      const stats = existingUser.greenStats || {
        monthlyCarbonData: [],
        monthlyPointsData: [],
        monthlyEmissionsData: [],
        monthlyPlasticsData: [],
        monthlyWaterData: [],
        monthlyGroupedOrdersData: [],
      };

      const updateOrPush = (array, value) => {
        const existing = array.find((e) => e.month === month);
        if (existing) existing.value += value;
        else array.push({ month, value });
      };

      updateOrPush(stats.monthlyCarbonData, orderStats.carbon);
      updateOrPush(stats.monthlyPointsData, orderStats.points);
      updateOrPush(stats.monthlyEmissionsData, orderStats.emissions);
      updateOrPush(stats.monthlyPlasticsData, orderStats.plastics);
      updateOrPush(stats.monthlyWaterData, orderStats.water);
      updateOrPush(stats.monthlyGroupedOrdersData, orderStats.groupedOrders);

      await User.updateOne(
        { userId },
        {
          $set: {
            lastStatsUpdatedAt: new Date(),
            email,
            phone,
            name,
          },
          $addToSet: {
            address: order.shippingAddress,
          },
          $inc: {
            ordersPlaced: 1,
            ecoPackages: order.packagingPoints > 0 ? 1 : 0,
          },
          $setOnInsert: {
            isPrimeMember: false,
            isTrustedReviewer: true,
          },
          $set: {
            greenStats: stats,
          },
        },
        { upsert: true }
      );
    }

    return NextResponse.json(
      { success: true, order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("COD order error:", error);
    return NextResponse.json(
      { success: false, message: "COD order failed" },
      { status: 500 }
    );
  }
}
