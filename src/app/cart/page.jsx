"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Recycle,
  Leaf,
  ShoppingCart,
  Search,
  User,
  ArrowLeft,
  Plus,
  Minus,
  Heart,
  RotateCcw,
  MapPin,
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cartContext";
import Image from "next/image";

export default function AmazonCart() {
  const router = useRouter();
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    total,
    getTotalPrice,
    addToCart,
  } = useCart();
  const [orderType, setOrderType] = useState("group");
  const [packaging, setPackaging] = useState("reusable");
  const [isClient, setIsClient] = useState(false);
  const [gpts, setGpts] = useState(150);
  const packagingOptions = {
    minimal: { price: 0, points: 0 },
    compostable: { price: 25, points: 100 },
    reusable: { price: 30, points: 150 },
  };


  useEffect(() => {
    // Hydration-safe check
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Avoid rendering until mounted on client
    return null;
  }
  const itemsTotal = getTotalPrice();
  const shipping = 100;
  const discount = 15;
  const packagingPrice = packagingOptions[packaging].price;
  const getOrderTotal = () => {

    const finalTotal = itemsTotal + shipping + packagingPrice - discount;
    return finalTotal.toFixed(2);
  };
  const options = [
    {
      key: "minimal",
      icon: <Package className="w-5 h-5 text-gray-600 mr-3" />,
      title: "Minimal Packaging",
      desc: "Essential packaging only, no frills",
      price: packagingOptions["minimal"].price,
      points: packagingOptions["minimal"].points,
    },
    {
      key: "compostable",
      icon: <Leaf className="w-5 h-5 text-green-600 mr-3" />,
      title: "Compostable Packaging",
      desc: "Made from cornstarch and mushroom materials",
      price: packagingOptions["compostable"].price,
      points: packagingOptions["compostable"].points,
    },
    {
      key: "reusable",
      icon: <Recycle className="w-5 h-5 text-green-600 mr-3" />,
      title: "Reusable Packaging",
      desc: "Returnable packaging that can be reused",
      price: packagingOptions["reusable"].price,
      points: packagingOptions["reusable"].points,
    },
  ];
  //  console.log("cartItems", cartItems);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Cart Header */}
            <div className="bg-white rounded-lg border p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Shopping Cart
                  </h1>
                  <div className="flex items-center text-gray-600">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    <span className="text-lg">{total} items</span>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-blue-600 font-medium">
                      Subtotal ({total})
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      ₹ {getTotalPrice().toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-2xl font-medium mb-6">Choose your delivery option</h2>

              <div className="space-y-4">
                {/* Individual Order */}
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition duration-200 ${orderType === "individual"
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200"
                    }`}
                  onClick={() => setOrderType("individual")}
                >
                  <div className="flex items-center mb-2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${orderType === "individual"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                        }`}
                    >
                      {orderType === "individual" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-semibold text-lg">Individual Order</span>
                  </div>
                  <p className="text-gray-600 ml-7 mb-1">
                    Standard delivery, ships individually
                  </p>
                  <p className="text-green-600 font-medium ml-7 mb-2">
                    Delivery: 2-3 business days
                  </p>
                  <p className="text-gray-900 font-medium ml-7">Shipping: ₹{shipping}</p>
                </div>

                {/* Group Order */}
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition duration-200 ${orderType === "group"
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 bg-yellow-50"
                    }`}
                  onClick={() => setOrderType("group")}
                >
                  <div className="flex items-center mb-2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${orderType === "group"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                        }`}
                    >
                      {orderType === "group" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-semibold text-lg">Group Order</span>
                    <span className="ml-2 bg-yellow-400 text-black text-sm px-2 py-1 rounded font-medium">
                      SAVE MONEY
                    </span>
                  </div>
                  <p className="text-gray-600 ml-7 mb-1">
                    Grouped with nearby customers to reduce shipping costs
                  </p>
                  <p className="text-green-600 font-medium ml-7 mb-2">
                    Delivery: 3-5 business days
                  </p>
                  <p className="text-gray-900 font-medium ml-7 mb-3">
                    Shipping charges remain the same, but when grouped, shared delivery reduces costs — the savings are credited to your wallet.
                  </p>
                  <div className="ml-7 flex items-center text-blue-600 text-sm">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-bold">i</span>
                    </div>
                    <span>
                      Orders within 5 km radius are grouped and shipped together. Shipping
                      costs are shared.
                    </span>
                  </div>
                </div>
              </div>
            </div>



            {/* Packaging Selection */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center mb-4">
                <Leaf className="w-5 h-5 text-green-600 mr-2" />
                <h2 className="text-lg font-medium">Choose Packaging</h2>
              </div>

              <div className="space-y-3">
                {options.map((option) => (
                  <div
                    key={option.key}
                    className={`border rounded-lg p-4 cursor-pointer flex items-center justify-between transition ${packaging === option.key
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                      }`}
                    onClick={() => {
                      setPackaging(option.key);
                      setGpts(option.points);
                    }}

                  >
                    <div className="flex items-center">
                      {option.icon}
                      <div>
                        <div className="font-medium">{option.title}</div>
                        <div className="text-sm text-gray-600">{option.desc}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {option.points > 0 && (
                        <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                          +{option.points} Green Points
                        </div>
                      )}
                      <div className="text-sm text-gray-600 mt-1">
                        {option.price === 0 ? "FREE" : `₹${option.price.toFixed(2)}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items in Cart */}

            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-medium mb-6">Items in your cart</h2>

              <div className="space-y-6">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500">Your cart is empty.</p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row gap-4 pb-6 border-b"
                    >
                      <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden relative cursor-pointer" onClick={() => router.push(`/products/${item.id}`)}>
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={"Product image"}
                            width={128}
                            height={128}
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-2">
                          {item.name || item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.description || "Standard Item"}
                        </p>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl font-bold text-red-600">
                            ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">
                              ₹{parseFloat(item.originalPrice).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center border rounded">
                            <button
                              className="p-2 hover:bg-gray-100"
                              onClick={() => decreaseQuantity(item.id)}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 border-x">
                              {item.quantity}
                            </span>
                            <button
                              className="p-2 hover:bg-gray-100"
                              onClick={() => increaseQuantity(item.id)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Delete
                          </button>
                          <button className="text-blue-600 hover:text-blue-800">
                            Save for later
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>



          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg border sticky top-30 max-h-screen overflow-y-auto">
              <div className="p-6 border-b">
                <h2 className="text-xl font-medium">Order Summary</h2>
              </div>

              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Items ({total}):</span>
                    <span>₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping & handling:</span>
                    <span>₹{shipping} </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packaging fee:</span>
                    <span>₹{packagingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>- ₹{discount.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Order total:</span>
                    <span>₹{getOrderTotal()}</span>
                  </div>
                </div>


                {gpts > 0 && (
                  <div className="flex justify-center mb-6">
                    <div className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium">
                      🎉 Congratulations, you will earn {gpts} green points on this order
                    </div>
                  </div>
                )}


                <button
                  className="w-full bg-yellow-400 text-black py-3 rounded-full text-lg font-medium hover:bg-yellow-500 mb-4"
                  onClick={() => {
                    const packagingDetails = packagingOptions[packaging];
                    const isGroupOrder = orderType === "group";

                    const summaryData = {
                      orderType, // "individual" or "group"
                      packaging: {
                        key: packaging,
                        title: options.find((opt) => opt.key === packaging)?.title,
                        desc: options.find((opt) => opt.key === packaging)?.desc,
                        price: packagingDetails.price.toFixed(2),
                        points: packagingDetails.points,
                      },
                      itemsTotal: itemsTotal,
                      isGroupOrder,
                      shipping: shipping,
                      discount: discount,
                      finalTotal: +getOrderTotal(),
                    };

                    localStorage.setItem("checkoutSummary", JSON.stringify(summaryData));
                    router.push("/checkout");
                  }}
                >
                  Proceed to Buy
                </button>

                <p className="text-xs text-gray-600 text-center">
                  By placing your order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

}
