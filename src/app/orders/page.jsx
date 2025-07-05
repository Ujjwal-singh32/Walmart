"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import LoadingSpinner from "@/components/LoadingSpinner";


const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("orders");
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const [ordersRes, rewardsRes] = await Promise.all([
          axios.get("/api/orders", { headers: { "x-user-id": user.id } }),
          axios.get("/api/rewards/user", { headers: { "x-user-id": user.id } }),
        ]);

        setOrders(ordersRes.data.orders);
        setRewards(rewardsRes.data.rewards || []);
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);
// console.log(orders);
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{view === "orders" ? "Your Orders" : "Your Rewards"}</h1>
          <div className="space-x-4">
            <button
              onClick={() => setView("orders")}
              className={`px-4 py-2 rounded ${view === "orders" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Your Orders
            </button>
            <button
              onClick={() => setView("rewards")}
              className={`px-4 py-2 rounded ${view === "rewards" ? "bg-green-600 text-white" : "bg-gray-200"}`}
            >
              Your Rewards
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner/>
        ) : view === "orders" ? (
          orders.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">You have no orders.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-300 rounded-lg p-4 mb-6 shadow-sm hover:shadow-md transition duration-200 bg-white"
              >
                <div className="flex justify-between flex-wrap md:flex-nowrap mb-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">ORDER PLACED:</span>{" "}
                      {new Date(order.placedAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">TOTAL:</span> ₹{order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">SHIP TO:</span>{" "}
                      <span className="text-blue-700 hover:underline cursor-pointer">
                        {order.userInfo?.name || "Customer"}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-1 text-right text-sm text-gray-600">
                    <p>
                      <span className="font-semibold">ORDER #</span> {order._id.slice(-6)}
                    </p>
                    <div className="flex gap-4 justify-end text-sm mt-1">
                      <span className="text-blue-700 hover:underline cursor-pointer">
                        View order details
                      </span>
                      <span className="text-blue-700 hover:underline cursor-pointer">
                        Invoice
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 flex flex-col gap-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-24 h-24 flex-shrink-0 cursor-pointer" onClick={() => router.push(`/product/${item.product?.productId}`)}>
                        <Image
                          src={item.product?.images[0] || "/placeholder.jpg"}
                          alt={item.product?.name || "Product"}
                          width={96}
                          height={96}
                          className="w-full h-full object-contain rounded border"
                        />
                      </div>
                      <div className="flex-1">
                        <h2
                          className="text-blue-700 font-medium text-sm mb-1 hover:underline cursor-pointer"
                          onClick={() => router.push(`/products/${item.product?.productId}`)}
                        >
                          {item.product?.name || "Product Name"}
                        </h2>
                        <p className="text-sm text-gray-600 mb-1">
                          ₹{item.priceAtPurchase.toFixed(2)} x {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.orderStatus === "delivered"
                            ? `Delivered on ${new Date(order.placedAt).toLocaleDateString()}`
                            : `Status: ${order.orderStatus}`}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <button
                            onClick={() => router.push(`/track?orderId=${order._id}`)}
                            className="border border-gray-400 px-4 py-2 text-sm rounded font-medium"
                          >
                            📦 Track Order
                          </button>

                          <button className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 text-sm rounded font-semibold">
                            🛠️ Get Product Support
                          </button>

                          <button
                            onClick={() => router.push(`/login`)}
                            className="border border-gray-400 px-4 py-2 text-sm rounded font-medium"
                          >
                            ✅ Update Status
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )
        ) : (
          <div className="mt-8">
            {rewards.length === 0 ? (
              <p className="text-center text-gray-500">You have not redeemed any rewards yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {rewards.map((reward, index) => (
                  <div
                    key={index}
                    className="bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-md hover:shadow-lg"
                  >
                    <img
                      src={reward.product?.image || "/placeholder.jpg"}
                      alt={reward.product?.name}
                      className="w-40 h-40 object-cover rounded-lg border"
                    />
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">{reward.product?.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">Redeemed for: {reward.product?.greenPoints} points</p>
                      <p className="text-sm text-gray-600 mb-1">Status: {reward.status}</p>
                      <p className="text-sm text-gray-500">Date: {new Date(reward.redeemedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default OrdersPage;
