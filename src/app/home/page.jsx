"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useProduct } from "@/context/ProductContext";
import AmazonWelcomeAnimation from "@/components/AmazonWelcomeAnimation";

const ImageCarousel = dynamic(() => import("@/components/ImageCarousel"), {
  ssr: false,
});
const ProductCard = dynamic(() => import("@/components/ProductCard"), {
  ssr: false,
});
const CategoryCard = dynamic(() => import("@/components/CategoryCard"), {
  ssr: false,
});
const ProductSlider = dynamic(() => import("@/components/ProductSlider"), {
  ssr: false,
});
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Fixed list of 15 categories
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
  "Yoga"
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
  const [displayCategories, setDisplayCategories] = useState([]);
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(18); // initial
  const { homeProducts, loading } = useProduct();
  // console.log("totalpr", homeProducts);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [dealsProducts, setDealsProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingSections, setLoadingSections] = useState(true);
  const [showSplash, setShowSplash] = useState(true);



  useEffect(() => {
  const hasSeen = sessionStorage.getItem("hasSeenHomeSplash");

  if (!hasSeen) {
    // First time: show splash for 2.5s
    const timeout = setTimeout(() => {
      sessionStorage.setItem("hasSeenHomeSplash", "true");
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timeout);
  } else {
    // Skip splash if already seen
    setShowSplash(false);
  }
}, []);




  // Guard any DOM-dependent logic until after hydration
  useEffect(() => {
    setIsClient(true);

    if (!homeProducts || homeProducts.length === 0) {
      console.warn("⚠️ homeProducts is empty or undefined");
      return;
    }

    const shuffled = shuffleArray(homeProducts);
    const maxFeatured = 20;
    const maxDeals = 16;
    const maxBestSellers = 16;
    const maxRecommended = 16;

    const featured = shuffled.slice(0, maxFeatured);
    const deals = shuffled.slice(maxFeatured, maxFeatured + maxDeals);
    const best = shuffled.slice(maxFeatured + maxDeals, maxFeatured + maxDeals + maxBestSellers);
    const recommended = shuffled.slice(
      maxFeatured + maxDeals + maxBestSellers,
      maxFeatured + maxDeals + maxBestSellers + maxRecommended
    );

    // Only show these 15 categories with their images (jpg)
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
      "Yoga": require("@/assets/Yoga.jpg"),
    };
    const categoryArray = fixedCategories.map((cat) => ({
      title: cat,
      image: categoryImages[cat],
      link: `/products?query=${encodeURIComponent(cat)}`
    }));
    setAllCategories(categoryArray);
    setDisplayCategories(categoryArray.slice(0, 18));

    setFeaturedProducts(featured);
    setDealsProducts(deals);
    setBestSellers(best);
    setRecommendedProducts(recommended);

    // console.log("Sections loaded");
    setLoadingSections(false); // Done loading
  }, [homeProducts]);


  if (showSplash) {
    return <AmazonWelcomeAnimation />;
  }

  const visibleCategories = allCategories.slice(0, visibleCategoryCount);
  const isExpanded = visibleCategoryCount >= Math.min(allCategories.length, 18 + 12); // or a safer dynamic check
  // Fixing this to recompute accurately every time
  const canExpand = visibleCategoryCount < allCategories.length;
  const canCollapse = visibleCategoryCount > 18;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      
      <Navbar />

      <main className="py-0 space-y-8 px-2">
        {/* Image Carousel */}
        <div className="relative mb-8 shadow-lg">
          <ImageCarousel />
        </div>

        {/* Prime Banner */}
        <Card className="mb-8 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-lg shadow-xl">
          <div className="p-6 flex flex-col md:flex-row items-center justify-between">
            <p className="text-lg md:text-xl font-semibold mb-4 md:mb-0">
              Unlock exclusive benefits with Amazon Prime.{" "}
              <span className="font-bold">Join today!</span>
            </p>
            <Button
              variant="secondary"
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 px-6 rounded-full shadow-md"
            >
              Try Prime free for 30 days
            </Button>
          </div>
        </Card>

        {/* Featured Products */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 px-2">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.productId}
                id={product.productId}
                title={product.name}
                price={product.basePrice}
                description={product.description}
                category={product.tags[0]}
                image={product.images[0] || "https://pngimg.com/uploads/amazon/amazon_PNG11.png"}
                rating={product.rating || "⭐⭐⭐⭐"}
                isOrganic={product.isOrganic}
                sustainableScore={product.sustainableScore}
                greenPoints={product.greenPoints.toFixed(0)}
              />
            ))}
          </div>
        </div>

        {/* Product Sliders */}
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 px-2">Deals of the Day</h2>
            <ProductSlider>
              {dealsProducts.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.productId}
                  id={product.productId}
                  title={product.name}
                  price={product.basePrice}
                  description={product.description}
                  category={product.tags[0]}
                  image={product.images[0] || "https://pngimg.com/uploads/amazon/amazon_PNG11.png"}
                  rating={product.rating || "⭐⭐⭐⭐"}
                  isOrganic={product.isOrganic}
                  sustainableScore={product.sustainableScore}
                  greenPoints={product.greenPoints.toFixed(0)}
                />
              ))}
            </ProductSlider>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 px-2">Best Sellers</h2>
            <ProductSlider>
              {bestSellers.slice(4, 12).map((product) => (
                <ProductCard
                  key={product.productId}
                  id={product.productId}
                  title={product.name}
                  price={product.basePrice}
                  description={product.description}
                  category={product.tags[0]}
                  image={product.images[0] || "https://pngimg.com/uploads/amazon/amazon_PNG11.png"}
                  rating={product.rating || "⭐⭐⭐⭐"}
                  isOrganic={product.isOrganic}
                  sustainableScore={product.sustainableScore}
                  greenPoints={product.greenPoints.toFixed(0)}
                />
              ))}
            </ProductSlider>
          </div>
        </div>

        {/* Shop by Category */}
        <section className="bg-white rounded-lg shadow-md mb-8 py-6">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
              {visibleCategories.map((category) => (
                <CategoryCard
                  key={category.title}
                  title={category.title}
                  image={category.image}
                  link={category.link}
                />
              ))}
            </div>

            {allCategories.length > 18 && (
              <div className="flex justify-center mt-6 gap-4">
                {visibleCategoryCount < allCategories.length && (
                  <Button
                    onClick={() =>
                      setVisibleCategoryCount((prev) =>
                        Math.min(prev + 12, allCategories.length)
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
                  >
                    View More
                  </Button>
                )}
                {visibleCategoryCount > 18 && (
                  <Button
                    onClick={() =>
                      setVisibleCategoryCount((prev) =>
                        Math.max(prev - 12, 18)
                      )
                    }
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded"
                  >
                    View Less
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Recommended Products (Product Cards) */}
        <section className="bg-white rounded-lg shadow-md mb-8 py-6">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Recommended Products
              </h2>
              <Button
                variant="link"
                className="text-blue-600 hover:text-blue-800 text-base"
              >
                Discover more
              </Button>
            </div>
            <ProductSlider>
              {recommendedProducts.map((product) => (
                <ProductCard key={product.productId}
                  id={product.productId}
                  title={product.name}
                  price={product.basePrice}
                  description={product.description}
                  category={product.tags[0]}
                  image={product.images[0] || "https://pngimg.com/uploads/amazon/amazon_PNG11.png"}
                  rating={product.rating || "⭐⭐⭐⭐"}
                  isOrganic={product.isOrganic}
                  sustainableScore={product.sustainableScore}
                  greenPoints={product.greenPoints.toFixed(0)}
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
