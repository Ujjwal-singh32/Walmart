import React from "react";

function Footer() {
  return (
    <footer className="bg-[#00288D] text-white text-sm mt-10">
      <div className="bg-[#EDF2F8] text-black py-6 text-center">
        <p className="text-lg mb-3">We’d love to hear what you think!</p>
        <button className="border px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
          Give feedback
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-wrap justify-center gap-4">
        {[
          'All Departments', 'Store Directory', 'Careers', 'Our Company',
          'Sell on Walmart.com', 'Help', 'Product Recalls', 'Accessibility',
          'Tax Exempt Program', 'Get the Walmart App', 'Safety Data Sheet',
          'Terms of Use', 'Privacy Notice', 'California Supply Chain Act',
          'Your Privacy Choices', 'Notice at Collection', 'AdChoices',
          'Consumer Health Data Privacy Notices', 'Brand Shop Directory',
          'Pharmacy', 'Walmart Business', '#IYKYK', 'Delete Account'
        ].map((item, idx) => (
          <a key={idx} href="#" className="hover:underline text-center text-sm text-white">
            {item}
          </a>
        ))}
      </div>

      <div className="text-center text-xs py-4 bg-[#00288D] text-white border-t border-white/10">
        © 2025 Walmart. The trademarks Walmart and the Walmart Spark design are registered with the US Patent and Trademark Office. All Rights Reserved.
      </div>
    </footer>
  );
}
export default Footer;
