"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";

export default function RewardsPage() {
  const { user } = useUser();
  const [greenPoints, setGreenPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    axios
      .get("/api/users/points", {
        headers: { "x-user-id": user.id },
      })
      .then((res) => {
        setGreenPoints(res.data.points || 0);
      })
      .catch((err) => {
        console.error("Failed to fetch green points:", err);
      });
  }, [user]);

  const handleRedeem = async (reward) => {
  if (greenPoints < reward.points) {
    toast.error("Not enough points to redeem this reward.");
    return;
  }

  setLoading(true);
  try {
    await axios.post("/api/rewards/redeem", {
      userId: user.id,
      product: {
        name: reward.name,
        image: reward.image,
        greenPoints: reward.points,
      },
    });

    setGreenPoints((prev) => prev - reward.points);

    toast.success(`🎉 ${reward.name} redeemed successfully!`, {
      position: "top-right",
      autoClose: 3000,
      className: "bg-green-100 text-green-800 font-semibold border border-green-300",
    });
  } catch (err) {
    console.error("Redeem failed", err);
    toast.error("Something went wrong while redeeming.");
  } finally {
    setLoading(false);
  }
};


  const rewards = [
    {
      name: "Bamboo Cutlery Set",
      points: 25,
      price: "₹349",
      image: "/rwimages/i1.jpg",
    },
    {
      name: "Stainless Steel Insulated Water Bottle",
      points: 700,
      price: "₹1,499",
      image: "/rwimages/i2.jpg",
    },
    {
      name: "Beeswax Food Wraps",
      points: 350,
      price: "₹599",
      image: "/rwimages/i3.jpg",
    },
    {
      name: "Organic Cotton Tote Bag",
      points: 300,
      price: "₹499",
      image: "/rwimages/i4.jpg",
    },
    {
      name: "Biodegradable Phone Case",
      points: 600,
      price: "₹899",
      image: "/rwimages/i5.jpg",
    },
    {
      name: "Natural Loofah Sponge",
      points: 180,
      price: "₹149",
      image: "/rwimages/i6.jpg",
    },
    {
      name: "Solar Power Bank",
      points: 200,
      price: "₹2,199",
      image: "/rwimages/i7.jpg",
    },
    {
      name: "Reusable Silicone Food Storage Bags",
      points: 400,
      price: "₹799",
      image: "/rwimages/i8.jpg",
    },
    {
      name: "Eco Laundry Detergent Sheets",
      points: 350,
      price: "₹499",
      image: "/rwimages/i9.jpg",
    },
    {
      name: "Compost Bin for Kitchen Counter",
      points: 800,
      price: "₹1,299",
      image: "/rwimages/i10.jpg",
    },
    {
      name: "Reusable Facial Rounds",
      points: 220,
      price: "₹299",
      image: "/rwimages/i11.jpg",
    },
    {
      name: "Soy Wax Candle in Recycled Jar",
      points: 200,
      price: "₹349",
      image: "/rwimages/i12.jpg",
    },
    {
      name: "Recycled Paper Pencils or Pens",
      points: 120,
      price: "₹99",
      image: "/rwimages/i13.jpg",
    },
    {
      name: "Eco-Friendly Yoga Mat",
      points: 950,
      price: "₹1,899",
      image: "/rwimages/i14.jpg",
    },
    {
      name: "Fair-Trade Coffee or Tea Sampler",
      points: 500,
      price: "₹799",
      image: "/rwimages/i15.jpg",
    },
    {
      name: "Shampoo & Conditioner Bars",
      points: 300,
      price: "₹399",
      image: "/rwimages/i16.jpg",
    },
    {
      name: "Recycled Fabric Travel Pouch",
      points: 350,
      price: "₹599",
      image: "/rwimages/i17.jpg",
    },
    {
      name: "Bamboo Plant Grow Kit",
      points: 600,
      price: "₹999",
      image: "/rwimages/i18.jpg",
    },
    {
      name: "Collapsible Reusable Coffee Cup",
      points: 320,
      price: "₹399",
      image: "/rwimages/i19.jpg",
    },
    {
      name: "Wheat Straw Lunch Box",
      points: 550,
      price: "₹899",
      image: "/rwimages/i20.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 py-8">
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-green-400 to-green-600 rounded-xl shadow-lg p-4 mb-8 border border-green-200 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-0 tracking-tight drop-shadow-lg">
              Redeem Your Green Points
            </h2>
            <div className="flex items-center gap-2 bg-white bg-opacity-90 px-6 py-2 rounded-full shadow border border-green-100">
              <span className="text-2xl">🌱</span>
              <span className="text-lg font-bold text-green-700 tracking-wide">
                {greenPoints} Points
              </span>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {rewards.map((product, index) => (
              <Card
                key={index}
                className="h-full flex flex-col justify-between border-2 border-green-100 bg-white/90 transition-all duration-300"
              >
                <CardHeader className="flex flex-col items-center p-4 pb-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-xl shadow-md border border-green-100 transition"
                  />
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-2 py-4 flex-1">
                  <CardTitle className="text-base font-bold text-green-900 text-center min-h-[48px] flex items-center justify-center">
                    {product.name}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow"
                  >
                    {product.points.toFixed(0)} Points
                  </Badge>
                  <span className="text-gray-400 line-through text-sm">
                    {product.price}
                  </span>
                </CardContent>
                <CardFooter className="flex justify-center pb-4 mt-auto">
                  <Button
                    disabled={loading || greenPoints < product.points}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 rounded-full shadow-md transition cursor-pointer hover:scale-105"
                    onClick={() => handleRedeem(product)}
                  >
                    Redeem Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-2xl p-8 shadow-xl text-center relative border border-green-100">
            <div className="absolute left-4 top-4 text-4xl text-green-700 opacity-30 select-none">
              ❝
            </div>
            <p className="italic text-xl text-green-900 font-medium">
              Every act of kindness towards our planet deserves recognition, and
              every green choice you make today plants the seeds for a
              sustainable tomorrow.
            </p>
            <div className="absolute right-4 bottom-4 text-4xl text-green-700 opacity-30 select-none">
              ❞
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
