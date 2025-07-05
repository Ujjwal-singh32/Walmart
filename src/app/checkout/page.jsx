"use client";
import React, { useState, useEffect } from 'react';
import { Check, Truck, ShoppingCart, Gift } from 'lucide-react';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cartContext";
import Image from 'next/image';
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { FaWallet } from "react-icons/fa";
import { toast } from "react-toastify";

export default function AmazonCheckout() {
  const router = useRouter();
  const { user } = useUser();
  const { cartItems, getTotalPrice } = useCart();

  const [summary, setSummary] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [walletPoints, setWalletPoints] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [walletUsed, setWalletUsed] = useState(0);


  useEffect(() => {
    const data = localStorage.getItem("checkoutSummary");
    if (data) setSummary(JSON.parse(data));
  }, []);

  // Fetch user's saved addresses from MongoDB
  useEffect(() => {
  if (!user?.id) return;

  axios
    .get("/api/users", {
      headers: { "x-user-id": user.id },
    })
    .then((res) => {
      const userData = res.data?.user;
      const addressList = userData?.address || [];
      const points = userData?.walletPoints || 0;

      setAddresses(addressList);
      setSelectedIndex(0);
      setWalletPoints(points); // ✅ store wallet points
    })
    .catch((err) => console.error("Error loading user data:", err));
}, [user]);


  const handleSaveAddress = async () => {
    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);
    setSelectedIndex(updatedAddresses.length - 1);
    setNewAddress({
      name: "",
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    });
    setShowAddForm(false);
    setIsChanging(false);

  };

  const calculateTotal = () => {
    if (!summary) return 0;
    const base = getTotalPrice() + (parseFloat(summary.shipping) || 0) + (parseFloat(summary.packaging?.price) || 0) - (parseFloat(summary.discount) || 0);
    return Math.max(0, base - (useWallet ? walletUsed : 0));
  };

  const handleProceed = async () => {
  if (!user) {
    toast.error("Please log in to continue.");
    return;
  }

  const selectedAddress = addresses[selectedIndex];
  if (!selectedAddress) {
    toast.error("Select or add a delivery address first.");
    return;
  }

  try {
    const orderPayload = {
      user: user.id,
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        priceAtPurchase: item.price.toFixed(2),
      })),
      totalAmount: calculateTotal(),
      paymentStatus: "pending",
      orderStatus: "Pending",
      shippingAddress: selectedAddress,
      deliveryOption: summary.orderType === "group" ? "group" : "individual",
      placedAt: new Date().toISOString(),
      packagingPoints: summary.packaging?.points || 0,
      wallet: walletUsed
    };

    const key = `checkout_${user.id}`;
    localStorage.setItem(key, JSON.stringify(orderPayload));

    toast.success("Redirecting to payment gateway...");
    router.push("/razorpay");
  } catch (error) {
    console.error("Checkout error:", error);
    toast.error("Something went wrong during checkout.");
  }
};


  if (!summary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold animate-pulse text-gray-600">Loading Checkout...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Checkout Header */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-xl p-8 shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="bg-gray-800 bg-opacity-80 rounded-full p-3 border-2 border-white">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">CHECKOUT</h1>
                <p className="text-white text-opacity-90">
                  <Gift className="w-4 h-4 inline mr-2" />
                  {cartItems.length} item{cartItems.length > 1 ? "s" : ""} ready for delivery
                </p>
              </div>
            </div>
            <div className="bg-white/80 px-6 py-4 rounded-xl text-indigo-900">
              <div className="text-sm font-medium">Subtotal</div>
              <div className="text-3xl font-bold">₹{calculateTotal().toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Address Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <h2 className="text-xl font-semibold">Choose a delivery address</h2>
                </div>
                <button onClick={() => setIsChanging(!isChanging)} className="text-orange-500 hover:underline">
                  {isChanging ? "Cancel" : "Change"}
                </button>
              </div>

              {!isChanging && addresses[selectedIndex] && (
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="font-semibold">{addresses[selectedIndex].name}</div>
                  <div className="text-gray-600">{addresses[selectedIndex].street}</div>
                  <div className="text-gray-600">{addresses[selectedIndex].city}, {addresses[selectedIndex].state} {addresses[selectedIndex].pincode}</div>
                  <div className="text-gray-600">{addresses[selectedIndex].country}</div>
                </div>
              )}

              {isChanging && (
                <div className="space-y-4">
                  {addresses.map((addr, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className={`border p-4 rounded-lg cursor-pointer ${selectedIndex === index ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}
                    >
                      <div className="font-semibold">{addr.name}</div>
                      <div className="text-gray-600">{addr.street}</div>
                      <div className="text-gray-600">{addr.city}, {addr.state} {addr.pincode}</div>
                      <div className="text-gray-600">{addr.country}</div>
                    </div>
                  ))}

                  <button onClick={() => setShowAddForm(!showAddForm)} className="text-orange-500 hover:underline">
                    {showAddForm ? "Cancel" : "Add New Address"}
                  </button>

                  {showAddForm && (
                    <div className="mt-4 space-y-2">
                      {["name", "street", "city", "state", "country", "pincode"].map((field) => (
                        <input
                          key={field}
                          type="text"
                          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                          className="w-full border rounded px-3 py-2"
                          value={newAddress[field]}
                          onChange={(e) => setNewAddress({ ...newAddress, [field]: e.target.value })}
                        />
                      ))}
                      <button onClick={handleSaveAddress} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                        Save Address
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Order Type & Packaging */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <h2 className="text-xl font-semibold">Order Type & Packaging</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold text-green-800">
                        Selected Order Type: {summary.orderType === "group" ? "Group Order" : "Individual Order"}
                      </div>
                      <div className="text-sm text-green-600">
                        {summary.orderType === "group"
                          ? "This will be grouped with nearby orders."
                          : "Will be delivered individually."}
                      </div>
                    </div>
                    <Check className="text-green-600" />
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold text-blue-800">
                        Selected Packaging: {summary.packaging?.title}
                      </div>
                      <div className="text-sm text-blue-600">{summary.packaging?.desc}</div>
                      <div className="text-sm text-blue-500 mt-1">Cost: ₹{summary.packaging?.price}</div>
                    </div>
                    <Truck className="text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Amazon Pay Balance */}
            <div className="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200 flex items-center gap-4 mt-6">
              <FaWallet className="text-yellow-500 text-2xl" />
              <div className="flex-1">
                <div className="font-semibold text-yellow-800">Amazon Pay Balance</div>
                <div className="text-sm text-yellow-700">Available: <span className="font-bold">{walletPoints} Points</span></div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useWallet}
                  onChange={e => {
                    setUseWallet(e.target.checked);
                    setWalletUsed(e.target.checked ? Math.min(walletPoints, getTotalPrice() + (summary.shipping || 0) + (summary.packaging?.price || 0) - (summary.discount || 0)) : 0);
                  }}
                  className="accent-yellow-500 w-5 h-5"
                />
                <span className="text-sm font-medium text-yellow-900">Use Amazon Pay</span>
              </label>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-sm rounded-lg sticky top-4 flex flex-col max-h-screen overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Order Summary</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex space-x-3">
                    <Image src={item.image} alt="product" width={64} height={64} className="object-contain rounded-lg" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="font-semibold">₹{(item.price.toFixed(2) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t space-y-1 text-sm">
                  <div className="flex justify-between">Items: <span>₹{getTotalPrice().toFixed(2)}</span></div>
                  <div className="flex justify-between">Shipping: <span>₹{summary.shipping.toFixed(2)}</span></div>
                  <div className="flex justify-between">Packaging: <span>₹{summary.packaging.price}</span></div>
                  <div className="flex justify-between text-green-700">Discount: <span>- ₹{summary.discount.toFixed(2)}</span></div>
                  {useWallet && walletUsed > 0 && (
                    <div className="flex justify-between text-blue-700 font-medium">Amazon Pay Used: <span>- ₹{walletUsed}</span></div>
                  )}
                  <div className="border-t pt-2 font-bold flex justify-between text-lg text-red-600">
                    <span>Total:</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t bg-gray-50">
                <button onClick={handleProceed} className="w-full bg-yellow-400 hover:bg-yellow-500 py-3 px-4 font-semibold rounded-lg">
                  Proceed to Payment
                </button>
                <p className="text-xs text-center mt-2 text-gray-500">By continuing, you agree to our Terms & Privacy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
