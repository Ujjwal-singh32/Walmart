"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
// import { products } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/cartContext"; // ⬅️ import this
import { toast, ToastContainer } from "react-toastify";
import { useProduct } from "@/context/ProductContext";
import Footer from "@/components/Footer";
import Lottie from "lottie-react";
import leafAnimation from "@/animations/leaf.json";
import GreenNavbar from "@/components/GreenNavbar";
import GreenFooter from "@/components/GreenFooter";
import LoadingSpinner from "@/components/LoadingSpinner";
const ProductDetailsPage = () => {
    const { productId } = useParams();
    const { addToCart } = useCart();
    const router = useRouter();
    const { organicProducts: totalProducts } = useProduct();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(null);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch("/api/products/detailsById", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId }),
                });

                const data = await res.json();

                if (data.success) {
                    setProduct(data.product);
                    setSelectedImage(data.product.images[0]);
                } else {
                    toast.error(data.error || "Failed to fetch product");
                }
            } catch (error) {
                toast.error("Error loading product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) return <LoadingSpinner />;
    if (!product) return <div className="p-4">Product not found.</div>;



    const productTags = (product.tags || [])
        .flatMap(tag => tag.split(","))
        .map(tag => tag.toLowerCase().trim())
        .filter(Boolean);

    // Utility to shuffle an array
    const shuffleArray = (arr) => {
        return [...arr].sort(() => Math.random() - 0.5);
    };

    // Step 1: Get products with matchCount
    const matchedProducts = totalProducts
        .filter((p) => p.productId !== product.productId) // Exclude the same product
        .map((p) => {
            const pTags = (p.tags || [])
                .flatMap(tag => tag.split(","))
                .map(tag => tag.toLowerCase().trim())
                .filter(Boolean);

            const matchCount = pTags.reduce((count, tag) =>
                productTags.includes(tag) ? count + 1 : count,
                0
            );

            return { ...p, matchCount };
        })
        .filter(p => p.matchCount > 0);

    // Step 2: Group by matchCount
    const grouped = {};
    matchedProducts.forEach(p => {
        if (!grouped[p.matchCount]) grouped[p.matchCount] = [];
        grouped[p.matchCount].push(p);
    });

    // Step 3: Shuffle each group
    Object.keys(grouped).forEach(key => {
        grouped[key] = shuffleArray(grouped[key]);
    });

    // Step 4: Sort keys by descending matchCount and flatten
    const similarProducts = Object.keys(grouped)
        .sort((a, b) => b - a)
        .flatMap(key => grouped[key])
        .slice(0, 20); // Top N similar



    // ✅ Handle Add to Cart
    const handleAddToCart = (item, size = null) => {
        // console.log("add to cart clicked");

        // if (item._id === product._id && !size) {
        //   toast.error("Please Select a Size");
        //   return;
        // }

        addToCart({
            id: item.productId,
            name: item.name,
            price: item.basePrice.toFixed(2),
            image: item.images[0],
            size: size,
            quantity: 1,
        });
        toast.success("Added to Cart");
    };
    const computeGrade = (score) => {
        if (score >= 90) return "A";
        if (score >= 70) return "B";
        if (score >= 60) return "C";
        if (score >= 40) return "D";
        return "E";
    };

    return (
        <>
            <GreenNavbar />
            <div className={`${product.isOrganic ? "bg-green-100" : "bg-white"} min-h-screen w-full`}>
                <div className="p-4 sm:p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-4">
                    {/* Left Section - Images */}
                    {/* Left Section - Images + animation */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-1/2">
                        <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible">
                            {Array.isArray(product.images) &&
                                product.images.map((img, index) => (
                                    <Image
                                        key={index}
                                        src={img || "https://pngimg.com/uploads/amazon/amazon_PNG11.png"}
                                        alt={product.name + " thumb"}
                                        width={60}
                                        height={60}
                                        className={`cursor-pointer border rounded-md ${selectedImage === img
                                            ? "border-purple-500"
                                            : "border-gray-300"
                                            }`}
                                        onClick={() => setSelectedImage(img)}
                                    />
                                ))}
                        </div>

                        <div className="relative w-full flex flex-col gap-4 items-center">
                            <Image
                                src={selectedImage || "https://pngimg.com/uploads/amazon/amazon_PNG11.png"}
                                alt={product.name}
                                width={600}
                                height={600}
                                className="rounded-lg object-contain w-full max-h-[400px]"
                            />

                            {/* 🌿 Lottie Animation below image if Organic */}
                            {product.isOrganic && (
                                <>
                                    <div className="w-52 h-52 mt-2">
                                        <Lottie animationData={leafAnimation} loop={true} />
                                    </div>

                                    {/* ✨ Motivational Eco Message */}
                                    <div className="bg-gradient-to-r from-green-100 via-emerald-50 to-lime-100 text-green-800 text-center rounded-md px-6 py-3 text-sm font-semibold shadow-inner">
                                        🌍 Thank you for making a conscious choice! Your purchase supports a greener, cleaner planet. 💚
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {/* Right Section - Details */}
                    <div className="flex-1">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 flex items-center gap-2 flex-wrap">
                            {product.name}
                            {product.isOrganic && (
                                <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md ring-1 ring-green-300 backdrop-blur-sm">
                                    {computeGrade(product.sustainableScore)}
                                </span>
                            )}
                        </h1>
                        <p className="text-gray-700 text-sm mb-2">
                            ⭐⭐⭐⭐ (1,892 ratings & 21,212 reviews)
                        </p>
                        <p className="text-gray-700 text-sm mb-4">{product.description}</p>
                        <p className="text-purple-700 font-bold text-lg sm:text-xl mb-4">
                            ₹{product.basePrice.toFixed(2)}
                        </p>
                        {product.isOrganic && (
                            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-lime-100 border border-emerald-200 rounded-xl p-5 mb-6 text-sm space-y-4 shadow-sm">
                                <h3 className="font-semibold text-emerald-700 text-base flex items-center gap-2 mb-1">
                                    🌱 Sustainability Metrics
                                </h3>

                                {[
                                    { label: "🌿 Green Points", value: product.greenPoints },
                                    { label: "🌍 Sustainable Score", value: product.sustainableScore },
                                    { label: "💧 Water Saved (L)", value: product.waterSaved },
                                    { label: "🌫️ Emissions Avoided (kg)", value: product.emissions },
                                    { label: "⚡ Energy Used (kWh)", value: product.energyUsed },
                                    { label: "🧴 Plastic Avoided (g)", value: product.plasticAvoided },
                                ].map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-gray-700 text-xs font-medium mb-1">
                                            <span>{item.label}</span>
                                            <span>{item.value}</span>
                                        </div>
                                        <div className="w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ease-out ${item.value < 0 ? 'bg-red-400' : 'bg-gradient-to-r from-lime-500 to-green-600'}`}
                                                style={{ width: `${Math.min(Math.abs(item.value), 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}



                        <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100 p-5 mt-6 mr-10 rounded-xl text-sm mb-10 shadow-md border border-yellow-200">
                            <h2 className="font-semibold text-yellow-800 text-base mb-3 flex items-center gap-2">
                                🎁 Available Offers
                            </h2>
                            <ul className="space-y-3 text-gray-700 font-medium">
                                <li className="flex items-start gap-2">
                                    <span>💳</span>
                                    <span>10% Instant Discount on Credit Cards</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span>💰</span>
                                    <span>5% Cashback on Amazon Pay</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span>📦</span>
                                    <span>No Cost EMI available</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span>🎉</span>
                                    <span>Get additional ₹50 cashback on select wallets</span>
                                </li>
                            </ul>
                        </div>

                        {/* Feature Icons */}
                        <div className="flex flex-wrap gap-4 text-sm mb-4">
                            <div className="flex items-center gap-2">
                                <span>🚚</span> <span>Free Delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>🔁</span> <span>7-Day Return</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>💳</span> <span>Cash on Delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>✔️</span> <span>100% Original</span>
                            </div>
                        </div>

                        <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-md w-full sm:w-auto"
                            onClick={() => handleAddToCart(product)}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>

                {/* Similar Products */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                    {similarProducts.map((item) => {
                        const score = item.sustainableScore || 0;
                        const greenPoints = item.greenPoints || 0;
                        const grade = computeGrade(score);
                        const isOrganic = item.isOrganic;

                        return (
                            <div
                                key={item.productId}
                                className={`rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-[440px] w-full relative ${isOrganic ? "bg-green-50" : "bg-white"
                                    }`}
                            >
                                {/* Grade Badge only for Organic */}
                                {isOrganic && (
                                    <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full z-30 shadow-md ring-1 ring-green-300 backdrop-blur-sm">
                                        {grade}
                                    </span>
                                )}

                                {/* Product Image */}
                                <div
                                    className="relative w-full h-[220px] cursor-pointer"
                                    onClick={() => router.push(`/green-products/${item.productId}`)}
                                >
                                    <Image
                                        src={item.images?.[0] || "/fallback.jpg"}
                                        alt={item.name}
                                        fill
                                        className="rounded-t-xl object-contain"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex flex-col justify-between flex-grow p-4">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-medium text-center line-clamp-2 cursor-pointer" onClick={() => router.push(`/green-products/${item.productId}`)}>{item.name}</p>
                                        <p className="text-center text-purple-700 font-bold">₹{item.basePrice.toFixed(2)}</p>

                                        {/* Show only for Organic Products */}
                                        {isOrganic ? (
                                            <div className="mt-2 space-y-1 text-xs">
                                                {/* Green Points */}
                                                <div className="flex justify-between text-gray-700">
                                                    <span>Green Points</span>
                                                    <span>{greenPoints}</span>
                                                </div>
                                                <div className="w-full bg-green-100 rounded-full h-2">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full"
                                                        style={{ width: `${greenPoints > 100 ? 95 : greenPoints}%` }}
                                                    ></div>
                                                </div>

                                                {/* Sustainable Score */}
                                                <div className="flex justify-between text-gray-700 mt-1">
                                                    <span>Sustainable Score</span>
                                                    <span>{score}</span>
                                                </div>
                                                <div className="w-full bg-green-100 rounded-full h-2">
                                                    <div
                                                        className="bg-green-700 h-2 rounded-full"
                                                        style={{ width: `${score}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ) : (<>
                                            <div className="mt-2 text-center text-s text-red-500 italic flex items-center justify-center gap-1">
                                                ⚠️ Not eco-certified – may impact the environment
                                            </div>
                                            <div className="text-center text-xs text-green-600 mt-1 italic flex items-center justify-center gap-1">
                                                🌿 Choose green alternatives for a healthier planet
                                            </div>
                                        </>)}
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold py-2 rounded-full"
                                        onClick={() => handleAddToCart(item)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>




                {/* Customer Review */}
                <div className="max-w-7xl mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6">
                    {/* Graph Section */}
                    <div className="md:w-1/3">
                        <h2 className="text-lg sm:text-xl font-bold mb-4">Ratings Summary</h2>
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((stars, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span className="w-8">{stars}★</span>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-yellow-400 h-3 rounded-full"
                                            style={{ width: `${60 - stars * 10}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="md:w-2/3">
                        <h2 className="text-lg sm:text-xl font-bold mb-4">
                            Customer Reviews
                        </h2>
                        <div className="space-y-4">
                            {[
                                {
                                    name: "Rahul Sharma",
                                    rating: "★★★★★",
                                    comment:
                                        "Really impressed with the quality of the product. Looks exactly like shown in the images. Delivery was fast and the packaging was neat.",
                                },
                                {
                                    name: "Anjali Mehta",
                                    rating: "★★★★☆",
                                    comment:
                                        "Good quality and fit. However, delivery took a bit longer than expected.",
                                },
                                {
                                    name: "Sandeep Yadav",
                                    rating: "★★★★★",
                                    comment: "Excellent! Totally worth the price. Will buy again.",
                                },
                            ].map((review, index) => (
                                <div key={index} className="bg-gray-100 p-4 rounded-md shadow-sm">
                                    <p className="font-semibold text-purple-800">{review.name}</p>
                                    <p className="text-sm text-yellow-600 mb-1">{review.rating}</p>
                                    <p className="text-gray-700 text-sm">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <GreenFooter />
        </>
    );
};

export default ProductDetailsPage;
