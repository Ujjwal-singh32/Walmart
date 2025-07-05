"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "react-toastify";

const OrderPlacedPage = () => {
  const router = useRouter();
  const [order, setOrder] = useState(null);

  useEffect(() => {
  const stored = localStorage.getItem("latest_order");

  if (!stored) return router.push("/");

  const parsed = JSON.parse(stored);
  setOrder(parsed);

  toast.success("Order placed successfully!", {
    toastId: "order-placed-toast" // avoids duplicate toasts
  });
}, []);


  if (!order) return null;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between leading-relaxed">
      <Navbar />

      <main className="p-8 max-w-7xl mx-auto w-full flex-grow">
        <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col md:flex-row justify-between gap-10">
          {/* Left: Order Info */}
          <div className="md:w-2/3 space-y-4">
            <div className="flex items-center text-green-600 text-xl font-semibold">
              ✅ Order placed, thank you!
            </div>
            <p className="text-gray-700 text-base">
              Confirmation will be sent to your email.
            </p>

            {/* Address */}
            <p className="text-sm text-gray-800">
              <span className="font-semibold">Shipping Address:</span>{" "}
              {`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.country} - ${order.shippingAddress.pincode}`}
            </p>

            {/* Delivery + Payment */}
            <div className="bg-gray-100 rounded-lg p-5 space-y-1">
              <p className="text-sm font-medium">
                Estimated Delivery: {order.estimatedDelivery || "3-5 Days"}
              </p>
              <p className="text-xs text-gray-500">
                Payment ID: {order.payment_id ? order.payment_id : "Cash on Delivery"}
              </p>
              <p className="text-xs text-gray-500">
                Order ID: {order.order_id ? order.order_id : "72f8b3c-4d5e-6f7g-8h9i-0j1k2l3m4n5o"}
              </p>

            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-base font-semibold mb-2">Ordered Items:</h3>
              <ul className="space-y-1">
                {order.items?.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-800">
                    Product ID: {item.productId} × {item.quantity} — ₹
                    {item.priceAtPurchase}
                  </li>
                ))}
              </ul>
            </div>

            {/* Total & Date */}
            <div className="text-sm text-gray-800">
              <p>
                <span className="font-semibold">Order Total:</span> ₹
                {order.totalAmount}
              </p>
              <p>
                <span className="font-semibold">Order Date:</span>{" "}
                {new Date(order.placedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Right: Offer */}
          <div className="bg-blue-50 border border-blue-300 p-6 rounded-lg md:w-1/3 space-y-3">
            <p className="text-sm text-blue-800 font-bold">Special Offer</p>
            <div className="text-lg font-medium">
              Try a <br />
              <span className="font-bold">30-day FREE trial of Prime</span>
            </div>
            <p className="text-sm text-gray-600">
              No commitments, cancel anytime.
            </p>
            <button className="bg-yellow-400 text-black font-semibold px-5 py-2 rounded-full hover:bg-yellow-500 transition">
              Try Prime FREE
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/orders")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Your Orders
          </button>

          <button
            onClick={() => router.push("/")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full transition"
          >
            Continue Shopping
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderPlacedPage;
