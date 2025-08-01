import React, { useState, useEffect } from 'react';
import { Leaf, TreePine, Recycle, Heart, Globe, Sun } from 'lucide-react';

const GoGreenComponent = ({ onComplete }) => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [leafPositions, setLeafPositions] = useState([]);

  useEffect(() => {
    const positions = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 80 + 10}%`,
      top: `${Math.random() * 80 + 10}%`,
      delay: `${i * 0.5}s`,
      duration: `${3 + Math.random() * 2}s`,
    }));
    setLeafPositions(positions);
  }, []);

  const quotes = [
    {
      text: "Small acts, when multiplied by millions of people, can transform the world.",
      author: "Howard Zinn",
      icon: Heart
    },
    {
      text: "The best time to plant a tree was 20 years ago. The second best time is now.",
      author: "Chinese Proverb",
      icon: TreePine
    }
  ];

  useEffect(() => {
  let count = 0; // how many quotes have shown
  const interval = setInterval(() => {
    setIsVisible(false);

    setTimeout(() => {
      setCurrentQuote((prev) => {
        const next = (prev + 1) % quotes.length;
        setIsVisible(true);
        return next;
      });

      count++;
      if (count === quotes.length) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete?.(); // safely trigger after full cycle
        }, 100);
      }
    }, 300); // fade duration
  }, 1200); // 1.2 seconds per quote

  return () => clearInterval(interval);
}, [quotes.length, onComplete]);


  const CurrentIcon = quotes[currentQuote].icon;

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-green-200 via-emerald-100 to-lime-200 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-4 left-4 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-green-400 rounded-full animate-pulse"></div>
        <div className="absolute top-24 right-12 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-emerald-500 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-12 left-24 w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-lime-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-24 right-24 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-500 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-radial from-green-300/60 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
      </div>

      {/* Floating leaves animation */}
      <div className="absolute inset-0 pointer-events-none">
        {leafPositions.map(({ id, left, top, delay, duration }) => (
          <div
            key={id}
            className="absolute animate-float"
            style={{ left, top, animationDelay: delay, animationDuration: duration }}
          >
            <Leaf className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 opacity-60" />
          </div>
        ))}
      </div>

      {/* Walmart Logo - improved visibility */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center space-x-2 z-20">
        <div className="bg-white bg-opacity-90 p-2 sm:p-2 md:p-3 rounded-lg shadow-xl border-2 border-blue-400 flex items-center">
          <span className="text-blue-700 font-extrabold text-base sm:text-lg md:text-2xl tracking-wide drop-shadow">walmart</span>
        </div>
        <div className="bg-gradient-to-br from-yellow-400 to-blue-400 p-2 sm:p-2 md:p-3 rounded-full shadow-lg animate-spin-slow border-2 border-white">
          <Recycle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white drop-shadow" />
        </div>
      </div>

      {/* Go Green Badge */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-gradient-to-r from-green-700 to-emerald-500 px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-lg border-2 border-white z-20">
        <span className="text-white font-semibold text-xs sm:text-sm flex items-center">
          <Leaf className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          GO GREEN
        </span>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center h-full px-4 sm:px-6 md:px-8 text-center">
        {/* Animated icon */}
        <div className="mb-4 sm:mb-6 relative">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-3 sm:p-4 md:p-5 rounded-full shadow-xl">
            <CurrentIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white animate-bounce" />
          </div>
        </div>

        {/* Quote content */}
        <div className={`transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-yellow-400 bg-clip-text text-transparent">
            🌱 Go Green with Walmart
          </h2>
          <blockquote className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 italic mb-2 sm:mb-3 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl leading-relaxed px-2">
            "{quotes[currentQuote].text}"
          </blockquote>
          <cite className="text-xs sm:text-sm md:text-base text-blue-600 font-medium">
            — {quotes[currentQuote].author}
          </cite>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-8">
          <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-sm sm:text-base">
            <TreePine className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Plant a Tree
          </button>
          <button className="bg-gradient-to-r from-blue-500 to-teal-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-sm sm:text-base">
            <Recycle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Recycle More
          </button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {quotes.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentQuote ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Eco stats */}
      <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 text-xs sm:text-sm text-green-600">
        <div className="flex items-center space-x-1">
          <Sun className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Carbon Neutral Shipping</span>
          <span className="sm:hidden">Carbon Neutral</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(5deg); }
          50% { transform: translateY(-5px) rotate(-5deg); }
          75% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default GoGreenComponent;
