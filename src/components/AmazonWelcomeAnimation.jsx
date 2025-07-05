"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Star, Gift, Zap } from "lucide-react";

export default function AmazonWelcomeAnimation() {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate 20 particles only on client
    const generated = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${i * 150}ms`
    }));
    setParticles(generated);

    const timer1 = setTimeout(() => setAnimationPhase(1), 500);
    const timer2 = setTimeout(() => setAnimationPhase(2), 500);
    const timer3 = setTimeout(() => setAnimationPhase(3), 3000);
    const hideTimer = setTimeout(() => setIsVisible(false), 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden p-4">
      {/* Background particles */}
      <div className="absolute inset-0">
        {particles.map(({ id, left, top, delay }) => (
          <div
            key={id}
            className={`absolute w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transform transition-all duration-3000 shadow-lg shadow-orange-400/30 ${
              animationPhase >= 1 ? "animate-pulse scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
            style={{
              left,
              top,
              animationDelay: delay
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-screen-md">
        {/* Amazon logo */}
        <div
          className={`transform transition-all duration-1000 ${
            animationPhase >= 0 ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-75"
          }`}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500 mr-3 animate-bounce drop-shadow-xl" />
              <div className="absolute inset-0 w-full h-full bg-orange-400/20 blur-xl animate-pulse"></div>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
              amazon
            </h1>
          </div>
        </div>

        {/* Welcome text */}
        <div
          className={`transform transition-all duration-1000 delay-500 ${
            animationPhase >= 1 ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="text-xl sm:text-3xl font-bold text-white mb-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full px-6 py-2 sm:px-8 sm:py-3 shadow-2xl shadow-orange-500/40">
            Welcome to Your World of Shopping
          </h2>
          <p className="text-base sm:text-xl text-gray-700 font-semibold drop-shadow-sm">
            Discover millions of products at unbeatable prices
          </p>
        </div>

        {/* Feature icons */}
        <div
          className={`flex flex-wrap justify-center gap-8 mt-8 transform transition-all duration-1000 delay-1000 ${
            animationPhase >= 2 ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-75"
          }`}
        >
          <FeatureIcon icon={Star} label="Premium Quality" />
          <FeatureIcon icon={Zap} label="Fast Delivery" delay="0.5s" />
          <FeatureIcon icon={Gift} label="Great Deals" delay="1s" />
        </div>

        {/* Loading Bar */}
        <div
          className={`mt-12 transform transition-all duration-1000 delay-1500 ${
            animationPhase >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        >
          <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden border border-orange-200">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full animate-pulse shadow-lg shadow-orange-400/40"
              style={{ width: "100%", animation: "slideIn 1.5s ease-out forwards" }}
            />
          </div>
          <p className="text-gray-600 mt-4 font-semibold drop-shadow-sm">
            Loading your shopping experience...
          </p>
        </div>
      </div>

      {/* Decorative blur circles */}
      <DecorativeBlur />

      <style jsx>{`
        @keyframes slideIn {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
          }
          40%, 43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }
      `}</style>
    </div>
  );
}

function FeatureIcon({ icon: Icon, label, delay }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-xl shadow-orange-400/50"
        style={{ animationDelay: delay }}
      >
        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
      </div>
      <span className="text-orange-600 font-bold mt-2 text-sm sm:text-base drop-shadow-sm">{label}</span>
    </div>
  );
}

function DecorativeBlur() {
  return (
    <>
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-xl animate-ping" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-r from-orange-400/20 to-red-500/20 rounded-full blur-xl animate-ping" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-20 w-16 h-16 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 rounded-full blur-xl animate-ping" style={{ animationDelay: "2s" }} />
      <div className="absolute top-20 right-32 w-20 h-20 bg-gradient-to-r from-yellow-300/20 to-orange-400/20 rounded-full blur-xl animate-ping" style={{ animationDelay: "0.5s" }} />
      <div className="absolute bottom-32 left-32 w-28 h-28 bg-gradient-to-r from-orange-500/20 to-amber-600/20 rounded-full blur-xl animate-ping" style={{ animationDelay: "1.5s" }} />
    </>
  );
}
