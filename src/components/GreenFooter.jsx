"use client";
import React from "react";
import Link from "next/link";

function GreenFooter() {
  return (
    <div className="bg-green-600 text-white">
      {/* Back to top button */}
      <div
        className="bg-green-600 hover:bg-[#0b2e84] text-center py-3 cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <p>Back to top</p>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="font-bold mb-3">Get to Know Us</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:underline">Careers</Link></li>
              <li><Link href="#" className="hover:underline">Blog</Link></li>
              <li><Link href="#" className="hover:underline">About Walmart</Link></li>
              <li><Link href="#" className="hover:underline">Investor Relations</Link></li>
              <li><Link href="#" className="hover:underline">Walmart Devices</Link></li>
              <li><Link href="#" className="hover:underline">Walmart Labs</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-bold mb-3">Make Money with Us</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:underline">Sell products on Walmart</Link></li>
              <li><Link href="#" className="hover:underline">Sell on Walmart Marketplace</Link></li>
              <li><Link href="#" className="hover:underline">Advertise with Walmart</Link></li>
              <li><Link href="#" className="hover:underline">Become a Supplier</Link></li>
              <li><Link href="#" className="hover:underline">Affiliate Program</Link></li>
              <li><Link href="#" className="hover:underline">Marketplace Developer Portal</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-bold mb-3">Walmart Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:underline">Walmart Credit Card</Link></li>
              <li><Link href="#" className="hover:underline">Reload Your Cash</Link></li>
              <li><Link href="#" className="hover:underline">Money Services</Link></li>
              <li><Link href="#" className="hover:underline">Check Printing</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-bold mb-3">Let Us Help You</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:underline">Walmart and COVID-19</Link></li>
              <li><Link href="#" className="hover:underline">Your Account</Link></li>
              <li><Link href="#" className="hover:underline">Your Orders</Link></li>
              <li><Link href="#" className="hover:underline">Shipping & Delivery</Link></li>
              <li><Link href="#" className="hover:underline">Returns & Refunds</Link></li>
              <li><Link href="#" className="hover:underline">Help Center</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2gDqrv5_6oNsLRvFci90cgiRBkHC6YESsjL3HcoxtHyHKQKSLzWSFQ5WB33tIO7NKQaE&usqp=CAU"
              alt="Walmart Logo"
              className="h-8 object-contain"
            />
          </div>
          <div className="text-center text-sm mt-4">
            <p>© 2025 Walmart.com, Inc. or its affiliates</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GreenFooter;
