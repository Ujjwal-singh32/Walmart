"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FaWallet, FaHistory, FaGift, FaArrowRight, FaQrcode, FaPaperPlane } from "react-icons/fa";

// Dummy data for static design
const walletPoints = 1200;
const history = [
  {
    id: 1,
    type: "credit",
    points: 500,
    date: "2025-06-10",
    description: "Group Buy Bonus (Order #A1234)",
    orderId: "A1234",
  },
  {
    id: 2,
    type: "debit",
    points: 200,
    date: "2025-06-12",
    description: "Used on Checkout (Order #A1235)",
    orderId: "A1235",
  },
  {
    id: 3,
    type: "credit",
    points: 300,
    date: "2025-06-15",
    description: "Group Buy Bonus (Order #A1236)",
    orderId: "A1236",
  },
];

export default function WalletPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoaded && !user) router.push("/home");
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-[80vh] pb-10">
        <div className="max-w-3xl mx-auto pt-8 space-y-8">
          {/* Header */}
          <h1 className="text-3xl font-semibold text-black tracking-tight mb-2">Amazon Pay</h1>

          {/* Wallet Card */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-br from-yellow-200 to-green-100 rounded-xl shadow p-6 border border-yellow-200">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-3 shadow border">
                <FaWallet className="text-yellow-500 text-2xl" />
              </div>
              <div>
                <div className="text-base font-medium">Amazon Pay Balance</div>
                <div className="text-2xl font-bold flex items-end gap-1">{walletPoints} <span className="text-sm mb-1">Points</span></div>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold shadow hover:bg-yellow-500 transition border border-yellow-300">
              Add Points <FaArrowRight />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{icon: <FaGift className='text-[#ff9900] text-xl' />, label: 'Rewards'},
              {icon: <FaHistory className='text-[#007185] text-xl' />, label: 'History'},
              {icon: <FaQrcode className='text-[#ff9900] text-xl' />, label: 'Scan & Pay'},
              {icon: <FaPaperPlane className='text-[#007185] text-xl' />, label: 'Send Money'}].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border shadow flex flex-col items-center justify-center py-5 min-h-[100px]">
                {item.icon}
                <span className="font-medium text-sm mt-1 text-center">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Points History */}
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><FaHistory className="text-[#007185]" /> Points History</h2>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-700 border-b">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Order</th>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3">Points</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-yellow-50/40 transition">
                    <td className="py-2 px-3 whitespace-nowrap">{item.date}</td>
                    <td className="py-2 px-3 text-xs text-gray-500">#{item.orderId}</td>
                    <td className="py-2 px-3">{item.description}</td>
                    <td className={`py-2 px-3 font-bold ${item.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                      {item.type === "credit" ? "+" : "-"}{item.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}