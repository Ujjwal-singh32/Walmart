"use client";

import { useState, useEffect } from "react";

// Walmart Spark SVG Icon
function WalmartSpark({ className = "", size = 64 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 0 10px #ffc22088)" }}
    >
      <g>
        {/* No white circle, just the spark */}
        <g>
          <path
            d="M32 13v15"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M32 36v15"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M51 32h-15"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M28 32H13"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M45.25 18.75l-10.6 10.6"
            stroke="#ffc220"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M18.75 45.25l10.6-10.6"
            stroke="#ffc220"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M45.25 45.25l-10.6-10.6"
            stroke="#ffc220"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M18.75 18.75l10.6 10.6"
            stroke="#ffc220"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}

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
      delay: `${i * 150}ms`,
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
    <div className="fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center bg-[#0071ce] overflow-hidden p-4">
      {/* Background particles */}
      <div className="absolute inset-0">
        {particles.map(({ id, left, top, delay }) => (
          <div
            key={id}
            className={`absolute w-2 h-2 rounded-full bg-[#ffc220] opacity-70 shadow-lg shadow-[#ffc220]/30 transition-all duration-3000 ${
              animationPhase >= 1
                ? "animate-pulse scale-100 opacity-100"
                : "scale-0 opacity-0"
            }`}
            style={{
              left,
              top,
              animationDelay: delay,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-screen-md">
        {/* Walmart Spark logo */}
        <div
          className={`transform transition-all duration-1000 ${
            animationPhase >= 0
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-12 opacity-0 scale-75"
          }`}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <WalmartSpark className="w-20 h-20 sm:w-24 sm:h-24 mr-3" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-[0_2px_8px_#0071ce99]">
              Walmart
            </h1>
          </div>
        </div>

        {/* Welcome text */}
        <div
          className={`transform transition-all duration-1000 delay-500 ${
            animationPhase >= 1
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="bg-white border-4 border-[#0071ce] rounded-2xl px-8 py-6 shadow-xl inline-block">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0071ce] mb-2">
              Welcome to Walmart
            </h2>
            <p className="text-base sm:text-xl text-[#00296b] font-semibold">
              Save more. Live better. Shop millions of products at unbeatable
              prices.
            </p>
          </div>
        </div>

        {/* Feature icons */}
        <div
          className={`flex flex-wrap justify-center gap-8 mt-8 transform transition-all duration-1000 delay-1000 ${
            animationPhase >= 2
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-75"
          }`}
        >
          <FeatureIcon
            iconType="star"
            label="Everyday Low Prices"
            color="#0071ce"
            bg="#ffc220"
          />
          <FeatureIcon
            iconType="zap"
            label="Fast Delivery"
            color="#ffc220"
            bg="#0071ce"
            delay="0.5s"
          />
          <FeatureIcon
            iconType="gift"
            label="Walmart+ Benefits"
            color="#0071ce"
            bg="#fff"
            border="#ffc220"
            delay="1s"
          />
        </div>

        {/* Loading Bar */}
        <div
          className={`mt-12 transform transition-all duration-1000 delay-1500 ${
            animationPhase >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        >
          <div className="w-64 h-2 bg-white rounded-full mx-auto overflow-hidden border-2 border-[#ffc220]">
            <div
              className="h-full bg-[#0071ce] rounded-full animate-slideIn"
              style={{ width: "100%" }}
            />
          </div>
          <p className="text-[#0071ce] mt-4 font-semibold">
            Loading your Walmart experience...
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
        .animate-slideIn {
          animation: slideIn 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

function FeatureIcon({ iconType, label, color, bg, border, delay }) {
  let Icon;
  if (iconType === "star") {
    Icon = (props) => (
      <svg
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          fill={color}
        />
      </svg>
    );
  } else if (iconType === "zap") {
    Icon = (props) => (
      <svg
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} />
      </svg>
    );
  } else if (iconType === "gift") {
    Icon = (props) => (
      <svg
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" fill={color} />
        <path d="M12 7V21" stroke="#0071ce" strokeWidth="2" />
        <path d="M2 11h20" stroke="#0071ce" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shadow-xl"
        style={{
          background: bg,
          border: border ? `2.5px solid ${border}` : undefined,
          borderRadius: "9999px",
          animation: delay ? `pulse 2s infinite ${delay}` : undefined,
        }}
      >
        <Icon className="w-7 h-7 sm:w-9 sm:h-9" />
      </div>
      <span className="text-[#0071ce] font-bold mt-2 text-sm sm:text-base">
        {label}
      </span>
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 ${bg}44;
          }
          50% {
            box-shadow: 0 0 0 8px ${bg}22;
          }
        }
      `}</style>
    </div>
  );
}

function DecorativeBlur() {
  return (
    <>
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#ffc220]/20 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-[#0071ce]/20 rounded-full blur-2xl" />
      <div className="absolute top-1/2 left-20 w-16 h-16 bg-[#ffc220]/20 rounded-full blur-2xl" />
      <div className="absolute top-20 right-32 w-20 h-20 bg-[#0071ce]/20 rounded-full blur-2xl" />
      <div className="absolute bottom-32 left-32 w-28 h-28 bg-[#ffc220]/20 rounded-full blur-2xl" />
    </>
  );
}
