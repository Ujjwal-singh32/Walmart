"use client";

import { useState, useEffect } from "react";
import { FaShoppingCart, FaLeaf, FaBars, FaTimes } from "react-icons/fa";
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
    useUser,
} from '@clerk/nextjs';
import { LeafIcon } from 'lucide-react';
import Image from "next/image";
import { MagnifyingGlassIcon, ShoppingCartIcon, } from "@heroicons/react/24/outline";
import { useCart } from "@/context/cartContext";
import { useRouter } from "next/navigation";
import { useProduct } from "@/context/ProductContext";

export default function GreenNavbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const { total } = useCart();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const { user } = useUser();
    const { organicProducts: totalProducts } = useProduct();
    const [city, setCity] = useState("Jamshedpur");
    const [stateName, setStateName] = useState("Jharkhand");

    useEffect(() => {
        setIsClient(true);
    }, []);
    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        // Replace all spaces with %
        const formattedQuery = searchTerm.trim().replace(/\s+/g, "%");

        router.push(`/green-products?query=${formattedQuery}`);
        setSearchTerm("");
    };

    useEffect(() => {
        const fetchUserLocation = async () => {
            try {
                const res = await fetch("/api/users", {
                    headers: {
                        "x-user-id": user?.id,
                    },
                });

                const data = await res.json();
                console.log("User Location Data:", JSON.stringify(data));

                const addressArray = data?.user?.address;
                if (Array.isArray(addressArray) && addressArray.length > 0) {
                    const primaryAddress = addressArray[0];
                    setCity(primaryAddress.city || "Jamshedpur");
                    setStateName(primaryAddress.state || "Jharkhand");
                }
            } catch (err) {
                console.error("Error fetching user location:", err);
            }
        };

        if (user?.id) {
            fetchUserLocation();
        }
    }, [user]);

    if (!isClient) {
        return (
            <nav className="sticky top-0 z-50 bg-green-600 text-white px-4 py-2 flex items-center justify-between flex-wrap">
                {/* Basic navbar structure without dynamic content */}
                <div className="flex items-center space-x-2 text-xl font-bold">
                    <Image
                        alt="Logo"
                        src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
                        width={90}
                        height={30}
                        className="cursor-pointer object-contain mt-2"
                    />
                    <span> Greenkart</span>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <FaShoppingCart />
                        <span>Cart</span>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="sticky top-0 z-50 bg-green-600 text-white px-6 py-4 h-[80px] flex items-center justify-between flex-wrap">
            {/* Left: Logo */}
            <div className="flex items-center space-x-2 text-xl font-bold">
                <Image
                    onClick={() => router.push("/")}
                    alt="Logo"
                    src="https://i5.walmartimages.com/dfw/63fd9f59-14e2/9d304ce6-96de-4331-b8ec-c5191226d378/v1/spark-icon.svg"
                    width={40}
                    height={40}
                    className="cursor-pointer object-contain"
                />

                {/* <span> Greenkart</span> */}
                <div
                    className="flex items-center bg-[#210074] text-white py-2 px-4 rounded-full min-w-[200px]
             hover:bg-[#0b2e84] transition duration-200 cursor-pointer group ml-3"
                >
                    <Image
                        src="https://i5.walmartimages.com/dfw/4ff9c6c9-ad46/k2-_0a671c38-d307-447c-835e-7904ab143c26.v1.png"
                        alt="Pickup or Delivery"
                        width={24}
                        height={24}
                        className="rounded-full"
                    />
                    <p className="ml-2 font-semibold text-sm whitespace-nowrap group-hover:text-white">
                        Pickup or delivery?
                    </p>
                </div>

            </div>

            {/* Middle: Search bar */}
            <div className="relative flex-grow mx-4">
                <form onSubmit={handleSearch} className="relative flex items-center h-9 mx-4 rounded-md flex-grow bg-yellow-500">

                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white h-full p-2 flex-grow rounded-l-md focus:outline-none px-4 text-black"
                    />


                    <button type="submit">
                        <MagnifyingGlassIcon className="h-9 p-2 bg-[#0b2e84]" />
                    </button>
                </form>
                {suggestions.length > 0 && (
                    <div className="absolute top-[100%] left-0 right-0 bg-[#232F3E] border-t border-green-400 shadow-lg rounded-b-md z-50">
                        {suggestions.map((tag, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    router.push(`/green-products?tag=${encodeURIComponent(tag)}`);
                                    setSuggestions([]);
                                    setSearchTerm("");
                                }}
                                className="flex items-center space-x-3 px-4 py-2 hover:bg-green-500 hover:text-black cursor-pointer text-sm text-white"
                            >
                                <MagnifyingGlassIcon className="h-4 w-4 text-green-400" />
                                <span className="font-medium">{tag}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right: Buttons */}
            <div className="hidden md:flex items-center space-x-4">
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <div className="cursor-pointer flex items-center space-x-2">
                        <UserButton afterSignOutUrl="/home" />
                        {user && (
                            <button
                                onClick={() => router.push("/profile")}
                                className="hidden sm:inline font-extrabold md:text-sm text-white hover:underline"
                            >
                                <div className="text-center">Hi</div>
                                <div className="text-center">{user.firstName}</div>
                            </button>
                        )}
                    </div>
                </SignedIn>
                <div
                    className="hidden sm:block cursor-pointer"
                    onClick={() => router.push("/orders")}  
                >
                    <p>Reorder</p>
                    <p className="font-extrabold md:text-sm">My Items</p>
                </div>
                <div
                    className="relative flex items-center cursor-pointer"
                    onClick={() => router.push("/cart")}
                >
                    <div className="relative">
                        <ShoppingCartIcon className="h-10 w-10 text-white" />
                        <span className="absolute top-[4.5px] right-2 h-4 w-4 bg-[#0b2e84] rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                            {total}
                        </span>
                    </div>
                    {/* <p className="hidden md:inline font-extrabold md:text-sm ml-1">
              Cart
            </p> */}
                </div>
                <p className="cursor-pointer text-yellow-500 font-semibold flex items-center gap-1  text-xl"
                    onClick={() => router.push("/green-kart")}>
                    <LeafIcon className="h-9 w-7" />
                    GreenKart
                </p>
            </div>

            {/* Mobile Menu Toggle */}
            <button
                className="md:hidden text-white"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="w-full mt-2 flex flex-col space-y-2 md:hidden">
                    <input
                        type="text"
                        placeholder="Search green products"
                        className="p-2 text-green-700 placeholder-green-600 font-semibold rounded bg-white"
                    />

                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <div
                        className="flex items-center space-x-1 cursor-pointer"
                        onClick={() => router.push('/cart')}
                    >
                        <FaShoppingCart />
                        <span>Cart</span>
                        {cartItems.length > 0 && (
                            <span className="bg-yellow-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                {cartItems.length}
                            </span>
                        )}
                    </div>
                    <a href="/" className="font-semibold hover:underline">
                        Amazon Home
                    </a>
                </div>
            )}
        </nav>
    );
}
