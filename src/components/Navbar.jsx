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
      <div className="flex items-center bg-[#131921] px-4 py-1 h-[60px] justify-between">
        {/* Logo */}
        <div className="flex items-center sm:flex-grow-0">
          <Image
            onClick={() => router.push("/")}
            alt="Logo"
            src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
            width={90}
            height={30}
            className="cursor-pointer object-contain mt-2"
          />
        </div>

        {/* Delivery Location and Search Bar (hidden on mobile, shown on sm and up) */}
        <div className="hidden md:flex flex-grow items-center">
          <div className="text-white ml-8 flex flex-col cursor-pointer">
            <p className="text-xs">Deliver to {city}</p>
            <p className="font-bold text-sm">{stateName}</p>
          </div>


          <div className="relative flex-grow mx-4">
            <form onSubmit={handleSearch} className="relative flex items-center h-9 mx-4 rounded-md flex-grow bg-yellow-500">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white h-full p-2 flex-grow flex-shrink rounded-l-md focus:outline-none px-4 text-black"
              />
              <button type="submit">
                <MagnifyingGlassIcon className="h-10 p-2 text-black" />
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
          <p className="cursor-pointer text-green-400 font-semibold flex items-center gap-1  text-xl"
            onClick={() => router.push("/green-kart")}>
            <LeafIcon className="h-9 w-7" />
            GreenKart
          </p>

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
            className="hidden sm:block cursor-pointer"
            onClick={() => router.push("/orders")}
          >
            <p>Returns</p>
            <p className="font-extrabold md:text-sm">& Orders</p>
          </div>

          <div
            className="relative flex items-center cursor-pointer"
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

      {/* Bottom nav */}
      <div className="bg-[#232F3E] text-white text-sm w-full px-6 py-2">
        <div className="flex flex-wrap justify-between items-center max-w-7xl mx-auto gap-x-6 gap-y-2">
          <p className="flex items-center cursor-pointer">
            <Bars3Icon className="h-6 mr-1" /> All
          </p>
          <p className="cursor-pointer">Today's Deals</p>
          <p className="cursor-pointer hidden lg:inline-flex">Registry</p>
          <p className="cursor-pointer hidden lg:inline-flex">
            Customer Service
          </p>
          <p className="cursor-pointer hidden lg:inline-flex">Gift Cards</p>
          <p className="cursor-pointer hidden lg:inline-flex">Sell</p>
          <p className="cursor-pointer hidden lg:inline-flex">Amazon Pay</p>
          <p className="cursor-pointer hidden lg:inline-flex">Best Sellers</p>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
