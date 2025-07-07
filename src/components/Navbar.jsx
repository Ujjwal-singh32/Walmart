"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { LeafIcon } from 'lucide-react';
import { useRouter } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  useUser,
} from "@clerk/nextjs";
import { useCart } from "@/context/cartContext";
import { useProduct } from "@/context/ProductContext";
import { toast } from "react-toastify";


function Navbar() {
  const router = useRouter();
  const { total } = useCart();
  const items = [];
  const { totalProducts, loading } = useProduct();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [city, setCity] = useState("Jamshedpur");
  const [stateName, setStateName] = useState("Jharkhand");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Replace all spaces with %
    // const formattedQuery = searchTerm.trim().replace(/\s+/g, "%");
    const formattedQuery = searchTerm.trim();
    router.push(`/products?query=${formattedQuery}`);
    setSearchTerm("");
  };
  const { user } = useUser();

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




  return (
    <div className="sticky top-0 z-50">
      {/* Top nav */}
      <div className="flex items-center bg-[#2538e6] px-4 py-1 h-[80px] justify-between">

        {/* Logo */}
        <div
          className="flex items-center sm:flex-grow-0  px-4 py-3 rounded-full cursor-pointer
             hover:bg-[#012169] transition duration-200"
          onClick={() => router.push("/")}
        >
          <Image
            alt="Logo"
            src="https://i5.walmartimages.com/dfw/63fd9f59-14e2/9d304ce6-96de-4331-b8ec-c5191226d378/v1/spark-icon.svg"
            width={40}
            height={10}
            className="object-contain"
          />
        </div>

        {/* Delivery Location and Search Bar (hidden on mobile, shown on sm and up) */}
        <div className="hidden md:flex items-center flex-grow gap-4 mx-6">
          {/* Pickup or Delivery Button */}
          <div
            className="flex items-center bg-[#210074] text-white py-2 px-4 rounded-full min-w-[200px]
             hover:bg-[#0b2e84] transition duration-200 cursor-pointer group"
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


          {/* Search Bar */}
          <div className="flex-grow">
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-white rounded-full px-3 h-10"
            >
              <input
                type="text"
                placeholder="Search Walmart"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow bg-transparent text-black placeholder-gray-500 px-4 py-2 focus:outline-none rounded-l-full"
              />
              <button
                type="submit"
                className="bg-[#002d72] rounded-full p-2 ml-2 flex items-center justify-center"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-white" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Nav items (including mobile menu button for small screens) */}
        <div className="text-white flex items-center text-xs space-x-4 md:space-x-6 whitespace-nowrap">
          {/* Mobile Menu Button - visible only on md and smaller */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
          <div
            onClick={() => router.push("/green-kart")}
            className="cursor-pointer flex items-center gap-2 px-5 py-3 rounded-full transition duration-200
             hover:bg-[#012169] group"
          >
            <LeafIcon className="h-8 w-8 text-[#32cd32] group-hover:text-green-500" />
            <span className="text-[#11ff3c] font-semibold text-base group-hover:text-green-500">
              GreenKart
            </span>
          </div>


          <div
            className="hidden sm:flex flex-col items-center justify-center px-5 py-3 rounded-full transition duration-200 cursor-pointer
             bg-transparent hover:bg-[#012169] hover:text-white group font-extrabold"
            onClick={() => router.push("/orders")}
          >
            <p className="text-sm leading-tight group-hover:text-white">Reorder</p>
            <p className="text-sm font-extrabold leading-tight group-hover:text-white">My Items</p>
          </div>

          <SignedIn>
            <div className="cursor-pointer flex items-center space-x-2">
              <UserButton afterSignOutUrl="/home" />
              {user && (
                <div
                  onClick={() => router.push("/profile")}
                  className="hidden sm:flex flex-col items-center justify-center px-5 py-3 rounded-full transition duration-200
                   bg-transparent hover:bg-[#012169] hover:text-white group font-extrabold"
                >
                  <p className="text-sm leading-tight group-hover:text-white">Hi</p>
                  <p className="text-sm font-extrabold leading-tight group-hover:text-white">{user.firstName}</p>
                </div>
              )}
            </div>
          </SignedIn>

          <SignedOut>
            <div
              className="cursor-pointer"
              onClick={() => router.push("/home")}
            >
              <SignInButton mode="modal">
                <p className="hover:underline">Sign In</p>
              </SignInButton>
            </div>
          </SignedOut>

          <div
            className="relative flex items-center justify-center px-4 py-3 rounded-full transition duration-200
             hover:bg-[#012169] cursor-pointer group"
            onClick={() => {
              if (total === 0) {
                toast.error("Add items in Cart", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: false,
                  progress: undefined,
                  style: {
                    background: "#fee2e2", // red-100
                    color: "#b91c1c",       // red-700
                    fontWeight: "600",
                    border: "1px solid #fca5a5", // red-300
                  },
                });
                return; // prevent redirect
              }
              router.push("/cart");
            }}

          >
            <div className="relative">
              <ShoppingCartIcon className="h-10 w-10 text-white" />
              <span className="absolute top-[4.5px] right-2 h-4 w-4 bg-yellow-400 rounded-full text-black text-[10px] font-bold flex items-center justify-center shadow-sm">
                {total}
              </span>
            </div>
            {/* <p className="hidden md:inline font-extrabold md:text-sm ml-1">
              Cart
            </p> */}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#131921] text-white p-4">
          <form
            onSubmit={handleSearch}
            className="flex items-center h-9 rounded-md bg-yellow-500 mb-4"
          >
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white h-full p-2 flex-grow rounded-l-md focus:outline-none px-4 text-black"
            />
            <button type="submit">
              <MagnifyingGlassIcon className="h-10 p-2 text-black" />
            </button>
          </form>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <p className="text-sm">Deliver to {city}</p>
              <p className="font-bold">{stateName}</p>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <p className="font-bold mb-2">Account & Lists</p>
              <SignedIn>
                <div className="space-y-2">
                  <p>Hi, {user?.firstName}</p>
                  <button
                    onClick={() => router.push("/profile")}
                    className="text-sm hover:underline"
                  >
                    Your Account
                  </button>
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <p className="hover:underline">Sign In</p>
                </SignInButton>
              </SignedOut>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <p className="font-bold mb-2">Shopping</p>
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/orders")}
                  className="block hover:underline"
                >
                  Returns & Orders
                </button>
                <button
                  onClick={() => router.push("/cart")}
                  className="block hover:underline"
                >
                  Cart ({items.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Navbar;
