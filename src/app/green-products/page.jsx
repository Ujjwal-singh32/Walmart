"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState ,Suspense } from "react";
import { useCart } from "@/context/cartContext";
import { useProduct } from "@/context/ProductContext";
import GreenNavbar from "@/components/GreenNavbar";
import GreenFooter from "@/components/GreenFooter";
import LoadingSpinner from "@/components/LoadingSpinner";
import axios from "axios";

const SearchPageContent  = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { organicProducts: totalProducts, loading } = useProduct();
    const query = searchParams.get("query")?.toLowerCase() || "";
    const { addToCart } = useCart();
    const [results, setResults] = useState([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [sortBy, setSortBy] = useState("");
    const [page, setPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (loading || !query) return;

        const fetchRecommendations = async () => {
            setIsFetching(true);
            try {
                const res = await axios.post("/api/green-ml-recommendation", {
                    query,
                    page
                }, {
                    headers: { "Content-Type": "application/json" }
                });


                const data = await res.data;
                if (data?.recommended?.length > 0) {
                    setResults((prev) => [...prev, ...data.recommended]);
                } else {
                    setResults([]);
                }
            } catch (err) {
                console.error("Recommendation fetch error:", err);
                setResults([]);
            }
        };

        fetchRecommendations();


    }, [query, totalProducts, loading, page]);

    useEffect(() => {
        setResults([]);
        setPage(1);
    }, [query]);


    const sortResults = (items) => {
        let sorted = [...items];
        if (sortBy === "price-low") sorted.sort((a, b) => a.price - b.price);
        else if (sortBy === "price-high") sorted.sort((a, b) => b.price - a.price);
        else if (sortBy === "name-asc") sorted.sort((a, b) => a.name.localeCompare(b.name));
        else if (sortBy === "name-desc") sorted.sort((a, b) => b.name.localeCompare(a.name));
        return sorted;
    };

    // const sortedResults = sortResults(results);
    const sortedResults = (results);
    if ((loading || (isFetching && results.length === 0)) && query) {
    return (
      <>
        <GreenNavbar />
        <div className="min-h-screen flex items-center justify-center bg-green-100">
          <LoadingSpinner />
        </div>
        <GreenFooter />
      </>
    );
  }

    return (
        <>
            <GreenNavbar />
            <div className="bg-green-200">
                <div className="p-4 max-w-7xl mx-auto ">
                    <h1 className="text-2xl font-bold mb-6 text-center">
                        {query && (
                            <>Search Results for: <span className="text-purple-600">"{query.replace(/%/g, " ")}"</span></>
                        )}
                        {!query && !tag && "All Products"}
                    </h1>

                    <div className="lg:hidden text-right mb-4">
                        <button
                            className="bg-purple-600 text-white px-4 py-2 rounded"
                            onClick={() => setShowMobileFilters(true)}
                        >
                            Filter
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        <aside className="hidden lg:block w-full lg:w-1/4 bg-white p-4 rounded shadow-md sticky top-28 max-h-[calc(100vh-7rem)] overflow-auto">
                            <Filters sortBy={sortBy} setSortBy={setSortBy} />
                        </aside>

                        <div className="w-full lg:w-3/4">
                            {sortedResults.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {sortedResults.map((product, idx) => (
                                        <div
                                            key={`${product.productId}-${idx}`}
                                            className={`${product.isOrganic ? "bg-green-50" : "bg-white"
                                                } shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300 relative`}
                                        >

                                            {/* Organic Badge */}
                                            {product.isOrganic && (
                                                <span className="absolute top-[10px] right-[10px] bg-green-500/90 text-white text-xs font-bold px-3 py-1 rounded-full z-30 shadow-md ring-1 ring-green-300 backdrop-blur-sm">
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
                                            )}


                                            <div
                                                onClick={() => router.push(`/green-products/${product.productId}`)}
                                                className="cursor-pointer"
                                            >
                                                <Image
                                                    src={product.images?.[0] || "/fallback.jpg"}
                                                    alt={product.name}
                                                    width={250}
                                                    height={250}
                                                    className="w-full h-[250px] object-contain mx-auto"
                                                />
                                            </div>

                                            <div className="mt-3">
                                                <h2 className="text-md font-semibold line-clamp-2 h-[40px] cursor-pointer"onClick={() => router.push(`/green-products/${product.productId}`)}>{product.name}</h2>
                                                <p className="text-gray-600 text-sm line-clamp-2 h-[38px] mt-1 cursor-pointer"onClick={() => router.push(`/green-products/${product.productId}`)}>
                                                    {product.description}
                                                </p>
                                                <p className="text-black font-bold text-lg mt-2">₹{product.basePrice.toFixed(2)}</p>


                                                {/* Green Points + Sustainable Score */}
                                                {product.isOrganic && (
                                                    <div className="mt-2 space-y-2">
                                                        <div className="flex justify-between text-xs text-gray-600">
                                                            <span>Green Points</span>
                                                            <span>{product.greenPoints.toFixed(0) || 0}</span>
                                                        </div>
                                                        <div className="w-full bg-green-100 rounded h-2">
                                                            <div
                                                                className="bg-green-500 h-2 rounded"
                                                                style={{ width: `${product.greenPoints || 0}%` }}
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
                                                )}

                                                <button
                                                    className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded shadow"
                                                    onClick={() =>
                                                        addToCart({
                                                            id: product.productId,
                                                            name: product.name,
                                                            price: product.basePrice.toFixed(2),
                                                            image: product.images?.[0],
                                                        })
                                                    }
                                                >
                                                    Add to cart
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : isFetching ? (
                                <div className="flex justify-center items-center py-16">
                                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent" />
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">No products found.</p>
                            )}
                            {sortedResults.length > 0 && (
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={() => setPage((prev) => prev + 1)}
                                        className="px-6 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700 transition"
                                    >
                                        Load More
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Filters Modal */}
                {showMobileFilters && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded w-[90%] max-w-sm max-h-[90%] overflow-y-auto shadow-lg relative">
                            <div className="text-right mb-2">
                                <button
                                    className="text-gray-600 font-bold text-lg"
                                    onClick={() => setShowMobileFilters(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            <Filters sortBy={sortBy} setSortBy={setSortBy} />
                        </div>
                    </div>
                )}
            </div>
            <GreenFooter />
        </>
    );
};

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchPageContent />
    </Suspense>
  );
}

const Filters = ({ sortBy, setSortBy }) => (
    <>
        <div className="mb-6">
            <h3 className="font-semibold mb-2">Sort By</h3>
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
            >
                <option value="">Select</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
            </select>
        </div>

        <div className="mb-6">
            <h3 className="font-semibold mb-2">Delivery Day</h3>
            <div className="space-y-1 text-sm">
                <label className="block"><input type="checkbox" className="mr-2" />Get It Today</label>
                <label className="block"><input type="checkbox" className="mr-2" />Get It by Tomorrow</label>
                <label className="block"><input type="checkbox" className="mr-2" />Get It in 2 Days</label>
            </div>
        </div>

        <div className="mb-6">
            <h3 className="font-semibold mb-2">Brands</h3>
            <div className="space-y-1 text-sm">
                {["EcoWave", "Greenify", "PureLeaf", "UrbanRoot", "Freshora", "Plantica"].map((brand) => (
                    <label className="block" key={brand}>
                        <input type="checkbox" className="mr-2" />
                        {brand}
                    </label>
                ))}
            </div>
        </div>

        <div className="mb-6">
            <h3 className="font-semibold mb-2">Type</h3>
            <div className="space-y-1 text-sm">
                <label className="block"><input type="checkbox" className="mr-2" />Organic</label>
                <label className="block"><input type="checkbox" className="mr-2" />Inorganic</label>
            </div>
        </div>

        <div>
            <h3 className="font-semibold mb-2">Availability</h3>
            <div className="space-y-1 text-sm">
                <label className="block"><input type="checkbox" className="mr-2" />Include Out of Stock</label>
            </div>
        </div>
    </>
);
