"use client";

import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import axios from 'axios';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Custom tooltip component for better styling

const CustomTooltip = ({ active, payload, label, unit = "" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="text-gray-600 font-medium">{label}</p>
        <p className="text-emerald-600 font-bold">
          <span >
            {payload[0].value} {unit}
          </span>
        </p>
      </div>
    );
  }

  return null;
};

export default function WalmartDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!user?.id) return;

    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Step 1: Try to fetch the user
        const res = await axios.get("/api/users", {
          headers: {
            "x-user-id": user.id,
          },
        });

        if (res.data?.user) {
          setUserData(res.data.user);
        } else {
          console.warn("User not found. Creating minimal user profile...");

          // Step 2: Create minimal user profile
          await axios.post("/api/users/create", {
            userId: user.id,
            name: user.fullName,
            email: user.emailAddresses[0]?.emailAddress,
            phone: user.phoneNumbers[0]?.phoneNumber || "",
          });

          // Step 3: Re-fetch after creation
          const reFetch = await axios.get("/api/users", {
            headers: {
              "x-user-id": user.id,
            },
          });

          if (reFetch.data?.user) {
            setUserData(reFetch.data.user);
          } else {
            console.warn("User still not found after creation.");
          }
        }
      } catch (error) {
        console.error("Error during fetch or fallback creation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);






  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const greenStats = userData?.greenStats || {
    monthlyCarbonData: [],
    monthlyPointsData: [],
    monthlyEmissionsData: [],
    monthlyPlasticsData: [],
    monthlyWaterData: [],
    monthlyGroupedOrdersData: []
  };
  // console.log("Green Stats:", greenStats);
  // Compute derived totals
  const emissionsSavedKg = greenStats.monthlyEmissionsData.reduce((sum, item) => sum + (item.value || 0), 0);
  const plasticsAvoidedKg = greenStats.monthlyPlasticsData.reduce((sum, item) => sum + (item.value || 0), 0);
  const greenPoints = greenStats.monthlyPointsData.reduce((sum, item) => sum + (item.value || 0), 0);
  const waterSavedLiters = greenStats.monthlyWaterData.reduce((sum, item) => sum + (item.value || 0), 0);
  const groupedOrders = greenStats.monthlyGroupedOrdersData.reduce((sum, item) => sum + (item.value || 0), 0);
  const forestAreaSavedSqM = greenStats.monthlyCarbonData.reduce((sum, item) => sum + (item.value || 0), 0) * 0.5;
  const ecoPackages = userData?.ecoPackages || 0;

  const impactData = [
    { name: 'Emissions Saved', value: emissionsSavedKg },
    { name: 'Plastics Avoided', value: plasticsAvoidedKg },
    { name: 'Water Saved', value: waterSavedLiters },
    { name: 'Forest Area Saved', value: forestAreaSavedSqM }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">Your Account</h1>

        {/* User Profile Section */}
        <div className="bg-white rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mb-4 sm:mb-0 sm:mr-4">
              <span className="text-white text-xl font-semibold">
                {userData?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold">{userData?.name}</h2>
              <p className="text-gray-600">
                {userData?.isPrimeMember ? 'Prime Member' : 'Member'} since {(new Date(userData?.createdAt)).toISOString().split("T")[0]}
              </p>
              {userData?.isTrustedReviewer && (
                <div className="flex items-center justify-center sm:justify-start mt-1">
                  <span className="text-orange-400 text-sm">★</span>
                  <span className="text-sm text-gray-600 ml-1">Trusted Reviewer</span>
                </div>
              )}
            </div>
          </div>

          {/* User Details Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-blue-600 mr-2">✉</span>
                <span className="font-medium text-gray-700">Email</span>
              </div>
              <p className="text-gray-800 text-sm sm:text-base break-all">{userData?.email || user?.primaryEmailAddress?.emailAddress}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-green-600 mr-2">📞</span>
                <span className="font-medium text-gray-700">Phone</span>
              </div>
              <p className="text-gray-800">{userData?.phone || 'Not provided'}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg sm:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-2">
                <span className="text-purple-600 mr-2">📍</span>
                <span className="font-medium text-gray-700">Address</span>
              </div>
              <p className="text-gray-800 text-sm sm:text-base">
                {userData?.address?.[0] ?
                  `${userData.address[0].street}, ${userData.address[0].city}, ${userData.address[0].state} ${userData.address[0].pincode}` :
                  'No address provided'}
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-orange-600 mr-2">💳</span>
                <span className="font-medium text-gray-700">Wallet Points</span>
              </div>
              <p className="text-gray-800">{userData?.walletPoints}</p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-red-600 mr-2">📦</span>
                <span className="font-medium text-gray-700">Orders Placed</span>
              </div>
              <p className="text-gray-800">{userData?.ordersPlaced || 0}</p>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-indigo-600 mr-2">⭐</span>
                <span className="font-medium text-gray-700">Prime Member</span>
              </div>
              <p className="text-gray-800">{userData?.isPrimeMember ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        {/* Green Dashboard */}
        <div className="bg-green-100 rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="flex items-center mb-6">
            <span className="text-green-600 text-2xl mr-3">🌱</span>
            <h2 className="text-xl sm:text-2xl font-semibold text-green-800">GREEN DASHBOARD</h2>
          </div>

          {/* Stats Grid - Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
            <div className="bg-blue-400 text-white p-4 sm:p-6 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="mr-2">☁️</span>
                <span className="text-sm">Emissions Saved</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold">{emissionsSavedKg.toFixed(2)} kg CO2</div>
              <div className="text-xs opacity-90">saved this month</div>
              <div className="text-xs mt-1 opacity-80">Equivalent to planting a small tree</div>
            </div>

            <div className="bg-purple-400 text-white p-4 sm:p-6 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="mr-2">♻️</span>
                <span className="text-sm">Plastics Avoided</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold">{plasticsAvoidedKg.toFixed(2)} kg</div>
              <div className="text-xs opacity-90">plastic waste prevented</div>
              <div className="text-xs mt-1 opacity-80">Enough to fill a medium recycling bin</div>
            </div>

            <div className="bg-green-400 text-white p-6 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="mr-2">🎯</span>
                <span className="text-sm">Green Points</span>
              </div>
              <div className="text-2xl font-bold">{greenPoints.toFixed(0)}</div>
              <div className="text-xs opacity-90 mb-3">Current Balance</div>
              <button
                className="bg-white hover:bg-yellow-300 text-green-800 font-medium px-3 py-1 rounded text-xs transition duration-200 w-full sm:w-auto"
                onClick={() => router.push('/rewards')}
              >
                Redeem Now
              </button>
            </div>

            <div className="bg-cyan-400 text-white p-4 sm:p-6 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="mr-2">💧</span>
                <span className="text-sm">Water Saved</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold">{waterSavedLiters.toFixed(2)} L</div>
              <div className="text-xs opacity-90">this month</div>
              <div className="text-xs mt-1 opacity-80">Equivalent to 2.5 bathtubs</div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
            <div className="bg-orange-400 text-white p-4 sm:p-6 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="mr-2">📦</span>
                <span className="text-sm">Eco Packages</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold">{ecoPackages}</div>
              <div className="text-xs opacity-90">Sustainable Deliveries</div>
            </div>

            <div className="bg-pink-400 text-white p-4 sm:p-6 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="mr-2">🚴</span>
                <span className="text-sm">Grouped Orders</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold">{groupedOrders}</div>
              <div className="text-xs opacity-90">Eco-Friendly and Cost-Effective Delivery</div>
            </div>

            <div className="bg-indigo-400 text-white p-4 sm:p-6 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="mr-2">🌲</span>
                <span className="text-sm">Forest Impact</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold">{forestAreaSavedSqM.toFixed(2)} m²</div>
              <div className="text-xs opacity-90">forest area protected</div>
            </div>
          </div>


          {/* Enhanced Graphs Section with Vibrant Colors */}
          <div className="space-y-8">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Emissions Saved Graph */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                  <span className="w-2 h-6 bg-violet-500 rounded-full mr-3"></span>
                  Emissions Saved Over Time
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={greenStats.monthlyEmissionsData}>
                      <defs>
                        <linearGradient id="emissionsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip content={<CustomTooltip unit="kg CO₂" />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#8B5CF6"
                        fillOpacity={1}
                        fill="url(#emissionsGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Plastics Avoided Graph */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                  <span className="w-2 h-6 bg-emerald-500 rounded-full mr-3"></span>
                  Plastics Avoided Over Time
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={greenStats.monthlyPlasticsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip content={<CustomTooltip unit="kg" />} />
                      <Legend />
                      <Bar
                        dataKey="value"
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={60}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Water Saved Graph */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                  <span className="w-2 h-6 bg-sky-500 rounded-full mr-3"></span>
                  Water Saved Over Time
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={greenStats.monthlyWaterData}>
                      <defs>
                        <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip content={<CustomTooltip unit="liters" />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#0EA5E9"
                        strokeWidth={2}
                        dot={{ fill: '#0EA5E9', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#0EA5E9' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Grouped Orders Graph */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                  <span className="w-2 h-6 bg-amber-500 rounded-full mr-3"></span>
                  Grouped Orders Over Time
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={greenStats.monthlyGroupedOrdersData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip content={<CustomTooltip unit="orders" />} />
                      <Legend />
                      <Bar
                        dataKey="value"
                        fill="#F59E0B"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={60}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Distribution Chart */}
          <div className="bg-white p-4 sm:p-6 rounded-lg mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">Environmental Impact Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={impactData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {impactData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => {
                      const units = {
                        "Water Saved": "liters",
                        "Plastics Avoided": "kg",
                        "Emissions Saved": "kg CO₂",
                        "Forest Area Saved": "sqr ft",
                      };
                      const formatted = typeof value === "number"
                        ? value.toFixed(2)
                        : value;
                      return [`${formatted} ${units[name] || ""}`, name];
                    }}
                  />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quote Section */}
          <div className="bg-green-600 text-white p-4 sm:p-6 rounded-lg text-center">
            <div className="text-3xl sm:text-4xl mb-4">🌱</div>
            <blockquote className="text-base sm:text-lg italic mb-2">
              "Every small action towards sustainability creates ripples of positive change for our planet."
            </blockquote>
            <p className="text-sm opacity-90">Thank you for making a difference with every order! 🌿</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}