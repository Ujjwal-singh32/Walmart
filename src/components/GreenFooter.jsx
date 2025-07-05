"use client";
import React from "react";
import Link from "next/link";

function GreenFooter() {
  return (
    <div className="bg-green-600 text-white">
      {/* Back to top button */}
      <div className="bg-green-600 hover:bg-pink-400 text-center py-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
              <li><Link href="#" className="hover:underline">About Amazon</Link></li>
              <li><Link href="#" className="hover:underline">Investor Relations</Link></li>
              <li><Link href="#" className="hover:underline">Amazon Devices</Link></li>
              <li><Link href="#" className="hover:underline">Amazon Science</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-bold mb-3">Make Money with Us</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:underline">Sell products on Amazon</Link></li>
              <li><Link href="#" className="hover:underline">Sell on Amazon Business</Link></li>
              <li><Link href="#" className="hover:underline">Sell apps on Amazon</Link></li>
              <li><Link href="#" className="hover:underline">Become an Affiliate</Link></li>
              <li><Link href="#" className="hover:underline">Advertise Your Products</Link></li>
              <li><Link href="#" className="hover:underline">Self-Publish with Us</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-bold mb-3">Amazon Payment Products</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:underline">Amazon Business Card</Link></li>
              <li><Link href="#" className="hover:underline">Shop with Points</Link></li>
              <li><Link href="#" className="hover:underline">Reload Your Balance</Link></li>
              <li><Link href="#" className="hover:underline">Amazon Currency Converter</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-bold mb-3">Let Us Help You</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:underline">Amazon and COVID-19</Link></li>
              <li><Link href="#" className="hover:underline">Your Account</Link></li>
              <li><Link href="#" className="hover:underline">Your Orders</Link></li>
              <li><Link href="#" className="hover:underline">Shipping Rates & Policies</Link></li>
              <li><Link href="#" className="hover:underline">Returns & Replacements</Link></li>
              <li><Link href="#" className="hover:underline">Help</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-center">
            <img 
              src="https://pngimg.com/uploads/amazon/amazon_PNG11.png" 
              alt="Amazon Logo" 
              className="h-8"
            />
          </div>
          <div className="text-center text-sm mt-4">
            <p>© 1996-{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GreenFooter;
