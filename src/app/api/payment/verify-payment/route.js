import crypto from 'crypto';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/orderModel';
import User from '@/models/userModel';
import Product from '@/models/productModel';

export async function POST(request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      originalOrder,
    } = await request.json();
    // console.log('Verify Payment Request:', JSON.stringify(originalOrder));

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;
    if (!isAuthentic) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }

    await connectDB();

    // Save new order
    const newOrder = await Order.create({
      user: originalOrder.user,
      items: originalOrder.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
      })),
      totalAmount: originalOrder.totalAmount,
      paymentStatus: 'paid',
      orderStatus: 'placed',
      shippingAddress: originalOrder.shippingAddress,
      deliveryOption: originalOrder.deliveryOption || 'individual',
      packagingPoints: originalOrder.packagingPoints || 0,
      placedAt: new Date(),
    });

    // Upsert user and update sustainability stats
    const { user: userId, name, email, phone } = originalOrder;

    let existingUser = await User.findOne({ userId });
    const month = new Date().toLocaleString("default", { month: "short" });

    // Calculate sustainability impact for the current order
    let orderStats = {
      carbon: 0,
      points: 0,
      emissions: 0,
      plastics: 0,
      water: 0,
      groupedOrders: originalOrder.deliveryOption === 'group' ? 1 : 0,
    };
    // console.log("packagingPoints", originalOrder.packagingPoints);
    orderStats.points+= Math.floor(originalOrder.packagingPoints || 0);
  

    for (const item of originalOrder.items) {
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
        phone: phone || '',
        address: originalOrder.shippingAddress ? [originalOrder.shippingAddress] : [],
        isPrimeMember: false,
        memberSince: null,
        isTrustedReviewer: true,
        ordersPlaced: 1,
        ecoPackages: originalOrder.packagingPoints>0 ? 1 : 0,
        lastStatsUpdatedAt: new Date(),
        greenStats: {
          monthlyCarbonData: [{ month, value: orderStats.carbon }],
          monthlyPointsData: [{ month, value: orderStats.points }],
          monthlyEmissionsData: [{ month, value: orderStats.emissions }],
          monthlyPlasticsData: [{ month, value: orderStats.plastics }],
          monthlyWaterData: [{ month, value: orderStats.water }],
          monthlyGroupedOrdersData: [{ month, value: orderStats.groupedOrders }],
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
            address: originalOrder.shippingAddress,
          },
          $inc: {
            ecoPackages: originalOrder.packagingPoints > 0 ? 1 : 0,
            ordersPlaced: 1,
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

    return NextResponse.json({ success: true, order: newOrder }, { status: 200 });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
