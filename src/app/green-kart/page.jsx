"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FaLeaf } from "react-icons/fa";
import GreenNavbar from "@/components/GreenNavbar";
import GreenFooter from "@/components/GreenFooter";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cartContext";
import { useProduct } from "@/context/ProductContext";
import { toast } from "react-toastify";
import GoGreenIntro from "@/components/GoGreenIntro";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { greenKartProducts: products } = useProduct();

  const [visibleCategoryCount, setVisibleCategoryCount] = useState(30);
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem("hasSeenGreenIntro");
    }
    return true;
  });

  const [isLoading, setIsLoading] = useState(true);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.productId,
      title: product.name,
      price: parseFloat(product.basePrice).toFixed(2),
      description: product.description,
      category: product.category || "Others",
      image: product.images?.[0] || "/default.jpg",
      rating: { rate: 4.5, count: 100 },
    });

    toast.success(`Green item added to cart`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      icon: "🛒",
    });
  };
  useEffect(() => {
    if (products.length > 0) {
      setIsLoading(false);
    }
  }, [products]);


  const featuredProducts = useMemo(() => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 90);
  }, [products]);

  const categoryCards = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      Array.isArray(p.tags) &&
        p.tags.forEach((tag) => {
          const t = tag.trim();
          if (!t || map.has(t)) return;
          map.set(t, {
            title: t,
            image: p.images?.[0] || "https://pngimg.com/uploads/amazon/amazon_PNG11.png",
            link: `/green-products?tag=${encodeURIComponent(t)}`,
          });
        });
    });
    return Array.from(map.values());
  }, [products]);

  return (

    <>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {showIntro ? (
            <GoGreenIntro
              onComplete={() => {
                sessionStorage.setItem("hasSeenGreenIntro", "true");
                setShowIntro(false);
              }}
            />

          ) : (
            <>
              <GreenNavbar />

              {/* Hero */}
              <section className="bg-green-50 py-8 px-4 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="max-w-xl text-center md:text-left">
                  <h1 className="text-3xl md:text-5xl font-bold text-green-800 flex items-center gap-2 animate-bounce">
                    <FaLeaf className="text-green-600" /> Greenkart
                  </h1>
                  <p className="mt-4 text-green-700 text-lg">
                    Every green purchase plants a better future.
                  </p>
                  <button
                    onClick={() => router.push("/profile")}
                    className="mt-6 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                  >
                    Explore Green Contribution
                  </button>
                </div>
                <img
                  loading="lazy"
                  src="/Green_Image.jpeg"
                  alt="Green Mission"
                  className="w-full md:w-1/2 h-48 md:h-64 rounded-xl shadow-lg object-cover"
                />
              </section>

              {/* Featured Products */}
              <section className="py-8 px-4 md:px-16 bg-green-50">
                <h2 className="text-2xl font-bold text-green-800 mb-4">Featured Organic Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {featuredProducts.map((product) => {
                    const price = parseFloat(product.basePrice).toFixed(2) || 0;
                    const image = product.images?.[0] || "/default.jpg";
                    return (
                      <div
                        key={product.productId}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
                      >
                        <div
                          className="relative cursor-pointer"
                          onClick={() =>
                            router.push(`/green-products/${product.productId}`)
                          }
                        >
                          <img
                            loading="lazy"
                            src={image}
                            alt={product.name}
                            className="w-full h-36 object-contain"
                          />
                          <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {product.sustainableScore >= 90
                              ? "A"
                              : product.sustainableScore >= 75
                                ? "B"
                                : product.sustainableScore >= 60
                                  ? "C"
                                  : product.sustainableScore >= 45
                                    ? "D"
                                    : "E"}
                          </span>
                        </div>
                        <div className="p-4 space-y-2">
                          <h3 className="text-green-800 font-semibold truncate">{product.name}</h3>
                          <p className="text-gray-500 text-xs">Eco Brand</p>
                          <p className="text-green-700 font-bold">₹{price}</p>

                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Green Points</span>
                              <span>{product.greenPoints.toFixed(0) || 0}</span>
                            </div>
                            <div className="w-full bg-green-100 rounded h-2">
                              <div
                                className="bg-green-500 h-2 rounded"
                                style={{ width: `${product.greenPoints.toFixed(0) || 0}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-gray-600 mt-1">
                              <span>Sustainable Score</span>
                              <span>{product.sustainableScore || 0}</span>
                            </div>
                            <div className="w-full bg-green-100 rounded h-2">
                              <div
                                className="bg-green-700 h-2 rounded"
                                style={{ width: `${product.sustainableScore || 0}%` }}
                              />
                            </div>
                          </div>

                          <div className="mt-4 flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() =>
                                router.push(`/green-products/${product.productId}`)
                              }
                              className="flex-1 bg-green-600 text-white text-sm py-1 rounded-md hover:bg-green-700 transition"
                            >
                              🌿 Details
                            </button>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="flex-1 border border-pink-600 text-black text-sm py-1 rounded-md hover:bg-pink-700 hover:text-white transition cursor-pointer"
                            >
                              🛒 Add
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Shop by Category */}
              <section className="py-8 px-4 md:px-16 bg-white">
                <h2 className="text-3xl font-bold text-green-700 mb-6">Shop by Category</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {categoryCards.slice(0, visibleCategoryCount).map((cat, idx) => (
                    <div
                      key={idx}
                      onClick={() => router.push(cat.link)}
                      className="cursor-pointer bg-green-50 hover:bg-green-100 rounded-xl shadow p-4 flex flex-col items-center transition"
                    >
                      <img
                        loading="lazy"
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <h3 className="mt-3 text-green-800 font-semibold text-center">{cat.title}</h3>
                    </div>
                  ))}
                </div>
                {categoryCards.length > 12 && (
                  <div className="flex justify-center mt-6 gap-4 flex-wrap">
                    {visibleCategoryCount < categoryCards.length && (
                      <button
                        onClick={() =>
                          setVisibleCategoryCount((prev) =>
                            Math.min(prev + 12, categoryCards.length)
                          )
                        }
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
                      >
                        View More
                      </button>
                    )}
                    {visibleCategoryCount > 12 && (
                      <button
                        onClick={() =>
                          setVisibleCategoryCount((prev) => Math.max(prev - 12, 12))
                        }
                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded"
                      >
                        View Less
                      </button>
                    )}
                  </div>
                )}
              </section>
            </>
          )}
          <GreenFooter />
        </>
      )}
    </>
  );
}

