"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/context/cartContext";
const PaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const [orderPayload, setOrderPayload] = useState(null);
  const router = useRouter();
  const { user } = useUser();
  const { clearCart } = useCart()
  useEffect(() => {
    if (!user) return;

    const data = localStorage.getItem(`checkout_${user.id}`);
    if (data) {
      setOrderPayload(JSON.parse(data));
    } else {
      alert("No order data found. Please go back and try again.");
      router.push("/cart");
    }
  }, [user]);
  const deductWalletPoints = async (userId, points) => {
    if (points > 0) {
      try {
        await axios.post("/api/wallet", {
          userId,
          points,
        });
      } catch (err) {
        console.error("Failed to deduct wallet points:", err);
      }
    }
  };


  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    if (!orderPayload) return;
    setLoading(true);

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Failed to load Razorpay SDK");
      setLoading(false);
      return;
    }

    try {
      // 1. Retrieve stored checkout payload
      const storedOrder = localStorage.getItem(`checkout_${user.id}`);
      const orderPayload = storedOrder ? JSON.parse(storedOrder) : null;

      if (!orderPayload) return alert("Order info not found");
      // console.log("Order payload", orderPayload);
      // 2. Create Razorpay order
      const { data } = await axios.post("/api/payment/create-order", {
        order: orderPayload,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount.toFixed(2),
        currency: data.currency,
        name: "GreenCart",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async function (response) {
          // 3. Verify Payment
          const verifyRes = await axios.post("/api/payment/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            originalOrder: orderPayload,
          });

          if (verifyRes.data.success) {
            // 4. Save verified order to localStorage for order-placed page
            localStorage.setItem("latest_order", JSON.stringify({
              ...orderPayload,
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
            }));

            // Optional: cleanup
            localStorage.removeItem(`checkout_${user.id}`);
            await deductWalletPoints(orderPayload.user, orderPayload.wallet || 0);

            clearCart();
            // 5. Navigate to order placed page
            router.push("/order-placed");
          } else {
            alert("Payment Verification Failed!");
          }
        },
        prefill: {
          name: user.fullName || "Customer",
          email: user.emailAddresses?.[0]?.emailAddress || "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#22c55e",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCashOnDelivery = async () => {
    if (!orderPayload) return;
    setLoading(true);

    try {
      // console.log("orderpayload", JSON.stringify(orderPayload, null, 2))
      const res = await axios.post("/api/payment/cod", {
        order: orderPayload,
      });

      if (res.data.success) {
        localStorage.setItem("latest_order", JSON.stringify(res.data.order));
        localStorage.removeItem(`checkout_${user.id}`);
        await deductWalletPoints(orderPayload.user, orderPayload.wallet || 0);

        clearCart();
        router.push("/order-placed");
      } else {
        alert("COD Order Failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing COD order");
    } finally {
      setLoading(false);
    }
  };

  if (!orderPayload) return null;

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.mein-mmo.de/medien/2022/12/Titelbild-Amazonkiste.jpg')",
      }}

    >
      <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

      <div className="relative z-10 bg-white/30 backdrop-blur-lg shadow-2xl p-10 rounded-3xl max-w-md w-full text-center border border-white/30">
        <h2 className="text-3xl font-bold text-white mb-6">Complete Your Payment</h2>
        <p className="mb-6 text-gray-100 font-medium">
          Pay securely ₹{orderPayload.totalAmount.toFixed(2)}

        </p>

        <button
          onClick={handleRazorpayPayment}
          disabled={loading || orderPayload.totalAmount === 0}
          className={`mb-4 w-full ${orderPayload.totalAmount === 0
            ? "bg-red-400 text-white cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white animate-pulse"
            } font-semibold px-8 py-3 rounded-full transition duration-300 transform hover:scale-105 focus:outline-none`}
        >
          {orderPayload.totalAmount === 0
            ? "Not available for ₹0 Orders"
            : loading
              ? "Processing..."
              : `Pay ₹${orderPayload.totalAmount.toFixed(2)} with Razorpay`}
        </button>


        <button
          onClick={handleCashOnDelivery}
          disabled={loading}
          className="w-full bg-white text-green-700 font-semibold px-8 py-3 rounded-full border-2 border-green-700 hover:bg-green-50 transition duration-300 transform hover:scale-105"
        >
          {loading ? "Processing..." : "Cash on Delivery"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
