"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import { useProduct } from "@/context/ProductContext";
import AmazonWelcomeAnimation from "@/components/AmazonWelcomeAnimation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import teaBeveragesImg from "@/assets/Coffee Tea and Beverages.jpg";
import homedecorImg from "@/assets/Diet and Nutrition.jpg";

const ProductCard = dynamic(() => import("@/components/ProductCard"), {
  ssr: false,
});
const ProductSlider = dynamic(() => import("@/components/ProductSlider"), {
  ssr: false,
});
import { Button } from "@/components/ui/button";

const fixedCategories = [
  "Baby Care",
  "Beauty and Grooming",
  "Coffee Tea and Beverages",
  "Diet and Nutrition",
  "Exercise and Fitness",
  "Garden and Outdoors",
  "Gourmet and Grocery",
  "Health and personal care",
  "Home and Kitchen",
  "Home Decor",
  "Household supplies",
  "Kitchen and Dining",
  "Kitchen Storage and containers",
  "Sports and fitness",
  "Yoga",
];

const shuffleArray = (array) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(18);
  const { homeProducts } = useProduct();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [dealsProducts, setDealsProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [showSplash, setShowSplash] = useState(true);
  const [countdown, setCountdown] = useState({ hours: 8, minutes: 50 });
  const router = useRouter();
  const [teaProducts, setTeaProducts] = useState([]);
  const [homeDecorProducts, setHomeDecorProducts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        let { hours, minutes } = prev;
        if (minutes > 0) {
          minutes -= 1;
        } else if (hours > 0) {
          hours -= 1;
          minutes = 59;
        }
        return { hours, minutes };
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("hasSeenHomeSplash");
    if (!hasSeen) {
      const timeout = setTimeout(() => {
        sessionStorage.setItem("hasSeenHomeSplash", "true");
        setShowSplash(false);
      }, 2500);
      return () => clearTimeout(timeout);
    } else {
      setShowSplash(false);
    }
  }, []);

  useEffect(() => {
    if (homeProducts && homeProducts.length > 0) {
      const filteredTea = homeProducts.filter(
        (p) =>
          Array.isArray(p.tags) &&
          p.tags.some((tag) => {
            const normalized = tag.toLowerCase().replace(/[^a-z]/g, "");
            return (
              normalized.includes("tea") ||
              normalized.includes("beverage") ||
              normalized.includes("coffee")
            );
          })
      );
      setTeaProducts(filteredTea);
      const filteredDecor = homeProducts.filter(
        (p) =>
          Array.isArray(p.tags) &&
          p.tags.some((tag) => {
            const normalized = tag.toLowerCase().replace(/[^a-z]/g, "");
            return (
              normalized.includes("protein") ||
              normalized.includes("nutrition") ||
              normalized.includes("diet")
            );
          })
      );
      setHomeDecorProducts(filteredDecor);
    } else {
      setTeaProducts([]);
      setHomeDecorProducts([]);
    }
  }, [homeProducts]);

  useEffect(() => {
    setIsClient(true);
    const shuffled = shuffleArray(homeProducts);
    const maxFeatured = 20;
    const maxDeals = 16;
    const maxBestSellers = 16;
    const maxRecommended = 16;
    const featured = shuffled.slice(0, maxFeatured);
    const deals = shuffled.slice(maxFeatured, maxFeatured + maxDeals);
    const best = shuffled.slice(
      maxFeatured + maxDeals,
      maxFeatured + maxDeals + maxBestSellers
    );
    const recommended = shuffled.slice(
      maxFeatured + maxDeals + maxBestSellers,
      maxFeatured + maxDeals + maxBestSellers + maxRecommended
    );
    const categoryImages = {
      "Baby Care": require("@/assets/Baby Care.jpg"),
      "Beauty and Grooming": require("@/assets/Beauty and Grooming.jpg"),
      "Coffee Tea and Beverages": require("@/assets/Coffee Tea and Beverages.jpg"),
      "Diet and Nutrition": require("@/assets/Diet and Nutrition.jpg"),
      "Exercise and Fitness": require("@/assets/Exercise and Fitness.jpg"),
      "Garden and Outdoors": require("@/assets/Garden and Outdoors.jpg"),
      "Gourmet and Grocery": require("@/assets/Gourmet and Grocery.jpg"),
      "Health and personal care": require("@/assets/Health and personal care.jpg"),
      "Home and Kitchen": require("@/assets/Home and Kitchen.jpg"),
      "Home Decor": require("@/assets/Home Decor.jpg"),
      "Household supplies": require("@/assets/Household supplies.jpg"),
      "Kitchen and Dining": require("@/assets/Kitchen and Dining.jpg"),
      "Kitchen Storage and containers": require("@/assets/Kitchen Storage and containers.jpg"),
      "Sports and fitness": require("@/assets/Sports and fitness.jpg"),
      Yoga: require("@/assets/Yoga.jpg"),
    };
    const categoryArray = fixedCategories.map((cat) => ({
      title: cat,
      image: categoryImages[cat],
      link: `/products?query=${encodeURIComponent(cat)}`,
    }));
    setAllCategories(categoryArray);
    setFeaturedProducts(featured);
    setDealsProducts(deals);
    setBestSellers(best);
    setRecommendedProducts(recommended);
  }, [homeProducts]);

  if (showSplash) {
    return <AmazonWelcomeAnimation />;
  }

  const visibleCategories = allCategories.slice(0, visibleCategoryCount);
  const isExpanded =
    visibleCategoryCount >= Math.min(allCategories.length, 18 + 12);
  const canExpand = visibleCategoryCount < allCategories.length;
  const canCollapse = visibleCategoryCount > 18;

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <Navbar />
      <main className="py-0 px-2">
        <div className="mt-1" />
        <section className="w-full mb-8">
          <div
            className="flex flex-auto pa3 mv3 shadow-1 rounded-xl relative"
            style={{
              backgroundColor: "#ffc220",
              minHeight: 80,
              minWidth: 100,
              borderRadius: "16px",
            }}
          >
            <div className="flex flex-auto flex-col items-center justify-center px-6 md:flex-row md:justify-between w-full">
              <div className="flex flex-row items-center mb-3 md:mb-0">
                <div
                  className="flex items-center justify-center mr-4"
                  style={{ flexShrink: 0 }}
                >
                  <img
                    alt="Walmart plus"
                    height="36"
                    width="112"
                    src="https://i5.walmartimages.com/dfw/4ff9c6c9-db09/k2-_4e215051-95a0-4cfc-a030-25d5b45898f1.v1.png"
                  />
                </div>
                <h3
                  className="text-[#00296b] text-lg md:text-2xl font-normal"
                  style={{ flex: 1 }}
                >
                  Get 50% off a year of Walmart+ to shop hot Deals first
                </h3>
              </div>
              <div className="flex items-center flex-row">
                <div className="flex flex-col justify-center items-center pr-4 mr-4">
                  <div className="text-xs md:text-sm font-semibold text-[#00296b] mb-1">
                    Early Access starts in:
                  </div>
                  <div className="flex" aria-hidden="true">
                    <div className="flex flex-col text-center font-bold mr-2">
                      <div className="flex text-[#00296b] text-xl md:text-2xl">
                        <div style={{ width: "1.1em" }} className="mx-1">
                          {String(countdown.hours).padStart(2, "0")}
                        </div>
                        <div className="self-center">:</div>
                      </div>
                      <div className="text-xs text-[#00296b]">hours</div>
                    </div>
                    <div className="flex flex-col text-center font-bold">
                      <div className="flex text-[#00296b] text-xl md:text-2xl">
                        <div style={{ width: "1.1em" }} className="mx-1">
                          {String(countdown.minutes).padStart(2, "0")}
                        </div>
                      </div>
                      <div className="text-xs text-[#00296b]">mins</div>
                    </div>
                  </div>
                </div>
                <button
                  className="border border-[#00296b] rounded-full px-6 py-2 font-semibold text-[#00296b] bg-white hover:bg-[#e6f1fb] transition"
                  style={{ fontWeight: 600, fontSize: "1rem" }}
                  type="button"
                  onClick={() =>
                    window.open("https://www.walmart.com/plus", "_blank")
                  }
                >
                  Join Walmart+
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full mb-10 px-2 md:px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4">
            <div
              className="bg-[#e6f1fb] rounded-2xl p-6 flex flex-col justify-between shadow transition-shadow hover:shadow-xl hover:scale-[1.02] duration-200"
              style={{ minHeight: 240 }}
            >
              <div>
                <h2 className="text-2xl font-bold text-[#0071ce] mb-2 tracking-tight leading-snug">
                  Save on La Roche-
                  <br />
                  Posay Anthelios
                </h2>
                <a
                  href="#"
                  className="text-[#0071ce] underline font-semibold hover:text-[#005fa3] transition-colors"
                >
                  Shop now
                </a>
              </div>
              <div className="w-full h-32 md:h-40 overflow-hidden rounded-xl mt-4">
                <img
                  src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
                  alt="Mountain Lake Scenery"
                  className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                />
              </div>
            </div>
            <div
              className="bg-[#0071ce] rounded-2xl p-6 flex flex-col h-full shadow row-span-2 md:row-span-2 md:col-span-1 transition-shadow hover:shadow-2xl hover:scale-[1.01] duration-200"
              style={{ minHeight: 400 }}
            >
              <div>
                <div className="text-lg font-bold text-[#ffc220] mb-2 tracking-tight">
                  Get it delivered fast!
                </div>
                <h1 className="text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                  Yes to savings on top-
                  <br />
                  rated tech
                </h1>
                <button className="border border-[#ffc220] rounded-full px-6 py-2 font-semibold text-[#ffc220] bg-[#0071ce] hover:bg-[#005fa3] transition mb-4 shadow-sm">
                  Shop now
                </button>
              </div>
              <div className="flex flex-col flex-grow h-0 gap-2 mt-6">
                <div className="flex-1 w-full overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80"
                    alt="Tech Promo"
                    className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                  />
                </div>
                <div className="flex-1 w-full overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
                    alt="Tech Deals"
                    className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                  />
                </div>
              </div>
            </div>
            <div
              className="bg-[#e6f1fb] rounded-2xl p-6 flex flex-col justify-between shadow transition-shadow hover:shadow-xl hover:scale-[1.02] duration-200"
              style={{ minHeight: 240 }}
            >
              <div>
                <h2 className="text-2xl font-bold text-[#0071ce] mb-2 tracking-tight leading-snug">
                  Up to 40% off
                  <br />
                  organic products
                </h2>
                <a
                  href="#"
                  className="text-[#0071ce] underline font-semibold hover:text-[#005fa3] transition-colors"
                >
                  Shop now
                </a>
              </div>
              <div className="w-full h-32 md:h-40 overflow-hidden rounded-xl mt-4">
                <img
                  src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
                  alt="Mountain Lake Scenery"
                  className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                />
              </div>
            </div>
            <div
              className="bg-[#ffc220] rounded-2xl p-6 flex flex-col justify-between shadow transition-shadow hover:shadow-xl hover:scale-[1.02] duration-200"
              style={{ minHeight: 180 }}
            >
              <div>
                <h2 className="text-2xl font-bold text-[#00296b] mb-2 tracking-tight leading-snug">
                  Classroom supplies for teachers
                </h2>
                <a
                  href="#"
                  className="text-[#00296b] underline font-semibold hover:text-[#005fa3] transition-colors"
                >
                  Shop now
                </a>
              </div>
              <div className="w-full h-32 md:h-40 overflow-hidden rounded-xl mt-4">
                <img
                  src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&h=240&q=80"
                  alt="Supplies"
                  className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                />
              </div>
            </div>
            <div
              className="bg-[#0a4c1a] rounded-2xl p-6 flex flex-col justify-between shadow transition-shadow hover:shadow-xl hover:scale-[1.02] duration-200"
              style={{ minHeight: 180 }}
            >
              <div>
                <h2 className="text-2xl font-bold text-[#ffc220] mb-2 tracking-tight leading-snug">
                  Hot new arrivals
                </h2>
                <a
                  href="#"
                  className="text-[#ffc220] underline font-semibold hover:text-white transition-colors"
                >
                  Shop now
                </a>
              </div>
              <div className="w-full h-32 md:h-40 overflow-hidden rounded-xl mt-4">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
                  alt="Sneakers"
                  className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full flex flex-col md:flex-row gap-8 my-12 max-w-full md:max-w-[1470px] mx-auto px-2 md:px-0">
          <div className="bg-[#f5f6fa] rounded-2xl p-8 flex flex-col justify-between shadow min-w-[320px] md:w-1/3 mb-4 md:mb-0 items-center">
            <div className="w-full">
              <h2 className="text-3xl font-extrabold text-[#00296b] mb-4 leading-tight">
                Tea & Beverages
                <br />
                that are wow
              </h2>
              <button
                className="border-2 border-[#00296b] rounded-full px-7 py-2 font-semibold text-[#00296b] bg-white hover:bg-[#e6f1fb] transition mb-4 text-lg shadow-sm"
                onClick={() =>
                  router.push("/products?query=Coffee%20Tea%20and%20Beverages")
                }
              >
                Shop now
              </button>
            </div>
            <div className="w-full h-44 relative rounded-xl mb-4 overflow-hidden flex items-center justify-center bg-white">
              <Image
                src={teaBeveragesImg}
                alt="Tea & Beverages"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-xl"
              />
            </div>
            <div className="text-lg font-bold text-[#00296b] w-full">
              From $10
            </div>
          </div>
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-6 pb-2">
              {teaProducts.length === 0 && (
                <div className="text-gray-500 text-lg p-8">
                  No Tea & Beverages products found.
                </div>
              )}
              {teaProducts.map((product) => (
                <div
                  key={product.productId}
                  className="min-w-[260px] max-w-[260px] bg-white rounded-2xl shadow-lg p-5 flex flex-col cursor-pointer hover:shadow-2xl transition border border-[#e6f1fb] relative"
                  onClick={() => router.push(`/products/${product.productId}`)}
                  style={{ height: "410px" }}
                >
                  {product.isDiscounted && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow">
                      Rollback
                    </span>
                  )}
                  <img
                    src={
                      product.images[0] ||
                      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
                    }
                    alt={product.name}
                    className="w-full h-36 object-contain rounded mb-3 bg-[#f5f6fa]"
                  />
                  <div className="font-bold text-base mb-1 text-[#00296b] line-clamp-2 min-h-[48px]">
                    {product.name}
                  </div>
                  <div className="text-green-700 font-bold text-lg mb-1">
                    {product.discountedPrice ? (
                      <>
                        Now ${product.discountedPrice}{" "}
                        <span className="line-through text-gray-400 text-sm ml-1">
                          ${product.basePrice}
                        </span>
                      </>
                    ) : (
                      <>${product.basePrice}</>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mb-3 line-clamp-2 min-h-[32px]">
                    {product.description?.slice(0, 60)}...
                  </div>
                  <button
                    className="border-2 border-[#00296b] rounded-full px-4 py-1 font-semibold text-[#00296b] bg-white hover:bg-[#e6f1fb] transition mt-auto text-sm shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/products/${product.productId}`);
                    }}
                  >
                    Options
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full flex flex-col md:flex-row gap-8 my-12 max-w-full md:max-w-[1470px] mx-auto px-2 md:px-0">
          <div className="flex-1 overflow-x-auto order-2 md:order-1">
            <div className="flex gap-6 pb-2">
              {homeDecorProducts.length === 0 && (
                <div className="text-gray-500 text-lg p-8">
                  Diet and Nutrition products loading...
                </div>
              )}
              {homeDecorProducts.map((product) => (
                <div
                  key={product.productId}
                  className="min-w-[260px] max-w-[260px] bg-white rounded-2xl shadow-lg p-5 flex flex-col cursor-pointer hover:shadow-2xl transition border border-[#e6f1fb] relative"
                  onClick={() => router.push(`/products/${product.productId}`)}
                  style={{ height: "410px" }}
                >
                  {product.isDiscounted && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow">
                      Rollback
                    </span>
                  )}
                  <img
                    src={
                      product.images[0] ||
                      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
                    }
                    alt={product.name}
                    className="w-full h-36 object-contain rounded mb-3 bg-[#f5f6fa]"
                  />
                  <div className="font-bold text-base mb-1 text-[#00296b] line-clamp-2 min-h-[48px]">
                    {product.name}
                  </div>
                  <div className="text-green-700 font-bold text-lg mb-1">
                    {product.discountedPrice ? (
                      <>
                        Now ${product.discountedPrice}{" "}
                        <span className="line-through text-gray-400 text-sm ml-1">
                          ${product.basePrice}
                        </span>
                      </>
                    ) : (
                      <>${product.basePrice}</>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mb-3 line-clamp-2 min-h-[32px]">
                    {product.description?.slice(0, 60)}...
                  </div>
                  <button
                    className="border-2 border-[#00296b] rounded-full px-4 py-1 font-semibold text-[#00296b] bg-white hover:bg-[#e6f1fb] transition mt-auto text-sm shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/products/${product.productId}`);
                    }}
                  >
                    Options
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#f5f6fa] rounded-2xl p-8 flex flex-col justify-between shadow min-w-[320px] md:w-1/3 mb-4 md:mb-0 items-center order-1 md:order-2">
            <div className="w-full">
              <h2 className="text-3xl font-extrabold text-[#00296b] mb-4 leading-tight">
                Make your way towards <br />
                a healthy life
              </h2>
              <button
                className="border-2 border-[#00296b] rounded-full px-7 py-2 font-semibold text-[#00296b] bg-white hover:bg-[#e6f1fb] transition mb-4 text-lg shadow-sm"
                onClick={() => router.push("/products?query=Home%20Decor")}
              >
                Shop now
              </button>
            </div>
            <div className="w-full h-44 relative rounded-xl mb-4 overflow-hidden flex items-center justify-center bg-white">
              <Image
                src={homedecorImg}
                alt="Home & Decor"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-xl"
              />
            </div>
            <div className="text-lg font-bold text-[#00296b] w-full">
              From $10
            </div>
          </div>
        </section>
        <section className="w-full max-w-full md:max-w-[1470px] mx-auto px-2 md:px-0 mb-12">
          <h2 className="text-2xl font-bold mb-4 px-2 text-[#0071ce]">
            Get it all right here
          </h2>
          <div
            className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {allCategories.slice(0, 15).map((cat) => (
              <div
                key={cat.title}
                className="flex flex-col items-center min-w-[120px]"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  width={96}
                  height={96}
                  className="w-24 h-24 object-contain rounded-xl bg-[#e6f1fb] mb-2 border-2 border-[#0071ce]"
                />
                <span className="text-base font-semibold text-[#00296b]">
                  {cat.title}
                </span>
              </div>
            ))}
          </div>
        </section>
        <div className="w-full mb-10 px-2 md:px-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 px-2 text-[#0071ce]">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.productId}
                id={product.productId}
                title={product.name}
                price={product.basePrice}
                description={product.description}
                category={product.tags[0]}
                image={
                  product.images[0] ||
                  "https://pngimg.com/uploads/amazon/amazon_PNG11.png"
                }
                rating={product.rating || "⭐⭐⭐⭐"}
                isOrganic={product.isOrganic}
                sustainableScore={product.sustainableScore}
                greenPoints={product.greenPoints.toFixed(0)}
                buttonColor="#0071ce"
                buttonTextColor="#fff"
                cardBg="#fff"
                cardBorderColor="#0071ce22"
                cardShadow="0 4px 16px 0 #0071ce11"
              />
            ))}
          </div>
        </div>
        <div className="w-full mb-10 px-2 md:px-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 px-2 text-[#0071ce]">
              Deals of the Day
            </h2>
            <ProductSlider>
              {dealsProducts.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.productId}
                  id={product.productId}
                  title={product.name}
                  price={product.basePrice}
                  description={product.description}
                  category={product.tags[0]}
                  image={
                    product.images[0] ||
                    "https://pngimg.com/uploads/amazon/amazon_PNG11.png"
                  }
                  rating={product.rating || "⭐⭐⭐⭐"}
                  isOrganic={product.isOrganic}
                  sustainableScore={product.sustainableScore}
                  greenPoints={product.greenPoints.toFixed(0)}
                  buttonColor="#0071ce"
                  buttonTextColor="#fff"
                  cardBg="#fff"
                  cardBorderColor="#0071ce22"
                  cardShadow="0 4px 16px 0 #0071ce11"
                />
              ))}
            </ProductSlider>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 px-2 text-[#0071ce]">
              Best Sellers
            </h2>
            <ProductSlider>
              {bestSellers.slice(4, 12).map((product) => (
                <ProductCard
                  key={product.productId}
                  id={product.productId}
                  title={product.name}
                  price={product.basePrice}
                  description={product.description}
                  category={product.tags[0]}
                  image={
                    product.images[0] ||
                    "https://pngimg.com/uploads/amazon/amazon_PNG11.png"
                  }
                  rating={product.rating || "⭐⭐⭐⭐"}
                  isOrganic={product.isOrganic}
                  sustainableScore={product.sustainableScore}
                  greenPoints={product.greenPoints.toFixed(0)}
                  buttonColor="#0071ce"
                  buttonTextColor="#fff"
                  cardBg="#fff"
                  cardBorderColor="#0071ce22"
                  cardShadow="0 4px 16px 0 #0071ce11"
                />
              ))}
            </ProductSlider>
          </div>
        </div>
        <section className="bg-white rounded-lg shadow-md mb-8 py-6 border border-[#0071ce22]">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0071ce]">
                Recommended Products
              </h2>
              <Button
                variant="link"
                className="text-[#ffc220] hover:text-[#0071ce] text-base font-semibold"
              >
                Discover more
              </Button>
            </div>
            <ProductSlider>
              {recommendedProducts.map((product) => (
                <ProductCard
                  key={product.productId}
                  id={product.productId}
                  title={product.name}
                  price={product.basePrice}
                  description={product.description}
                  category={product.tags[0]}
                  image={
                    product.images[0] ||
                    "https://pngimg.com/uploads/amazon/amazon_PNG11.png"
                  }
                  rating={product.rating || "⭐⭐⭐⭐"}
                  isOrganic={product.isOrganic}
                  sustainableScore={product.sustainableScore}
                  greenPoints={product.greenPoints.toFixed(0)}
                  buttonColor="#0071ce"
                  buttonTextColor="#fff"
                  cardBg="#fff"
                  cardBorderColor="#0071ce22"
                  cardShadow="0 4px 16px 0 #0071ce11"
                />
              ))}
            </ProductSlider>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
