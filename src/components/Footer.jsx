"use client";
import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <div className="bg-[#232F3E] text-white">
      {/* Back to top button */}
      <div className="bg-[#37475A] hover:bg-[#485769] text-center py-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <p>Back to top</p>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="font-bold mb-3">Get to Know Us</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="https://www.aboutamazon.in/" className="hover:underline" target="_blank" rel="noopener noreferrer">About Amazon</Link></li>
              <li><Link href="https://www.amazon.jobs/en/" className="hover:underline" target="_blank" rel="noopener noreferrer">Careers</Link></li>
              <li><Link href="https://www.aboutamazon.in/news/press-releases" className="hover:underline" target="_blank" rel="noopener noreferrer">Press Releases</Link></li>
              <li><Link href="https://www.amazon.science/" className="hover:underline" target="_blank" rel="noopener noreferrer">Amazon Science</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-bold mb-3">Connect with Us</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="https://www.facebook.com/AmazonIN" className="hover:underline" target="_blank" rel="noopener noreferrer">Facebook</Link></li>
              <li><Link href="https://twitter.com/AmazonIN" className="hover:underline" target="_blank" rel="noopener noreferrer">Twitter</Link></li>
              <li><Link href="https://www.instagram.com/amazondotin/" className="hover:underline" target="_blank" rel="noopener noreferrer">Instagram</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-bold mb-3">Make Money with Us</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="https://services.amazon.in/" className="hover:underline" target="_blank" rel="noopener noreferrer">Sell on Amazon</Link></li>
              <li><Link href="https://accelerator.amazon.in/" className="hover:underline" target="_blank" rel="noopener noreferrer">Sell under Amazon Accelerator</Link></li>
              <li><Link href="https://brandservices.amazon.in/" className="hover:underline" target="_blank" rel="noopener noreferrer">Protect and Build Your Brand</Link></li>
              <li><Link href="https://services.amazon.in/services/amazon-global-selling.html" className="hover:underline" target="_blank" rel="noopener noreferrer">Amazon Global Selling</Link></li>
              <li><Link href="https://services.amazon.in/services/amazon-business.html" className="hover:underline" target="_blank" rel="noopener noreferrer">Supply to Amazon</Link></li>
              <li><Link href="https://affiliate-program.amazon.in/" className="hover:underline" target="_blank" rel="noopener noreferrer">Become an Affiliate</Link></li>
              <li><Link href="https://services.amazon.in/services/fulfilment-by-amazon.html" className="hover:underline" target="_blank" rel="noopener noreferrer">Fulfilment by Amazon</Link></li>
              <li><Link href="https://advertising.amazon.in/" className="hover:underline" target="_blank" rel="noopener noreferrer">Advertise Your Products</Link></li>
              <li><Link href="https://www.amazon.in/b?node=20221305031" className="hover:underline" target="_blank" rel="noopener noreferrer">Amazon Pay on Merchants</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-bold mb-3">Let Us Help You</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="https://www.amazon.in/gp/css/homepage.html" className="hover:underline" target="_blank" rel="noopener noreferrer">Your Account</Link></li>
              <li><Link href="https://www.amazon.in/returns" className="hover:underline" target="_blank" rel="noopener noreferrer">Returns Centre</Link></li>
              <li><Link href="https://www.amazon.in/gp/help/customer/display.html?nodeId=200972340" className="hover:underline" target="_blank" rel="noopener noreferrer">Recalls and Product Safety Alerts</Link></li>
              <li><Link href="https://www.amazon.in/gp/help/customer/display.html?nodeId=201889730" className="hover:underline" target="_blank" rel="noopener noreferrer">100% Purchase Protection</Link></li>
              <li><Link href="https://www.amazon.in/mobile-apps/b?node=1569405031" className="hover:underline" target="_blank" rel="noopener noreferrer">Amazon App Download</Link></li>
              <li><Link href="https://www.amazon.in/gp/help/customer/display.html" className="hover:underline" target="_blank" rel="noopener noreferrer">Help</Link></li>
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

export default Footer;
