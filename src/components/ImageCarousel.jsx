"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const slides = [
  {
    id: 1,
    backgroundColor: 'bg-gradient-to-r from-yellow-300 to-yellow-500',
    headline: 'Amazon Fashion',
    subHeadline: 'Under ₹799',
    description: 'Shop sports shoes',
    promoImage: '/P1.jpg',
    promoImageAlt: 'Sports shoes',
    badges: [
      { text: 'EASY RETURNS', icon: '' }, // Placeholder for actual icon if desired
      { text: 'LATEST TRENDS', icon: '' }
    ],
    cashbackText: 'Unlimited 5%* cashback',
    cashbackDetail: 'with Amazon Pay ICICI Bank credit card',
    tnc: '*T&C apply'
  },
  {
    id: 2,
    backgroundColor: 'bg-gradient-to-r from-blue-300 to-blue-500',
    headline: 'Electronics Deals',
    subHeadline: 'Up to 40% Off',
    description: 'Discover the latest gadgets and accessories',
    promoImage: '/P2.jpg',
    promoImageAlt: 'Electronics',
    badges: [],
    cashbackText: 'Exclusive Discounts',
    cashbackDetail: 'on Top Brands',
    tnc: ''
  },
  {
    id: 3,
    backgroundColor: 'bg-gradient-to-r from-green-300 to-green-500',
    headline: 'Home Essentials',
    subHeadline: 'Starting at ₹199',
    description: 'Everything for your home and kitchen',
    promoImage: '/P3.jpg',
    promoImageAlt: 'Home essentials',
    badges: [],
    cashbackText: 'Great Savings',
    cashbackDetail: 'on Household Items',
    tnc: ''
  }
];

function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const currentSlide = slides[currentIndex];

  return (
    <div className={`relative h-[450px] w-full group ${currentSlide.backgroundColor}`}>
      <div className="absolute inset-0 flex items-center justify-between px-8 z-10">
        {/* Left Arrow */}
        <div className="cursor-pointer text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors" onClick={prevSlide}>
          <ChevronLeftIcon className="h-8 w-8" />
        </div>
        
        {/* Right Arrow */}
        <div className="cursor-pointer text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors" onClick={nextSlide}>
          <ChevronRightIcon className="h-8 w-8" />
        </div>
      </div>

      <div className="relative h-[450px] flex items-center justify-center">
        {/* Content for the current slide */}
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between h-[450px] py-8 px-4">
          {/* Left section: Text content */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left text-black w-full md:w-1/2 p-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              {currentSlide.headline}
            </h1>
            <h2 className="text-2xl md:text-4xl font-extrabold mb-4">
              {currentSlide.subHeadline}
            </h2>
            <p className="text-lg md:text-xl mb-4">
              {currentSlide.description}
            </p>
            {currentSlide.badges.length > 0 && (
              <div className="flex space-x-4 mb-4">
                {currentSlide.badges.map((badge, index) => (
                  <div key={index} className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-full shadow-md">
                    {badge.text}
                  </div>
                ))}
              </div>
            )}
            <div className="text-sm mb-2 font-semibold">
              {currentSlide.cashbackText} <span className="font-normal">{currentSlide.cashbackDetail}</span>
            </div>
            {currentSlide.tnc && (
              <p className="text-xs text-gray-700">{currentSlide.tnc}</p>
            )}
          </div>

          {/* Right section: Promo Image */}
          <div className="relative w-full md:w-1/2 flex justify-center items-center p-4">
            <div className="w-[400px] h-[300px] overflow-hidden rounded-lg shadow-xl">
              <Image
                src={currentSlide.promoImage}
                alt={currentSlide.promoImageAlt}
                width={400}
                height={300}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCarousel; 