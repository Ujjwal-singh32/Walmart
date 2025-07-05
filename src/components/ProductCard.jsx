"use client";
import React from 'react';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useCart } from "@/context/cartContext";
import { toast } from 'react-toastify';

function ProductCard({
  id,
  title,
  price,
  description,
  category,
  image,
  rating,
  isOrganic = false,
  sustainableScore = 0,
  greenPoints = 0,
}) {
  const router = useRouter();
  const { rate, count } = {
    rate: (Math.random() * 2 + 3).toFixed(1),
    count: Math.floor(Math.random() * 50000 + 20),
  };
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      id,
      title,
      price,
      image,
      quantity: 1,
    });
    toast.success("Added to Cart");
  };

  const getSustainabilityGrade = (score) => {
    if (score >= 90) return "A";
    if (score >= 75) return "B";
    if (score >= 60) return "C";
    if (score >= 45) return "D";
    return "E";
  };

  const grade = getSustainabilityGrade(sustainableScore);

  return (
    <Card
      className={`group cursor-pointer min-w-[220px] max-w-[280px] min-h-[480px] flex flex-col transition-shadow shadow-md ${isOrganic ? "bg-green-50 border border-green-200" : ""
        }`}
      onClick={() => router.push(`/products/${id}`)}
    >
      <CardHeader className="relative p-4 flex-shrink-0">
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title || "image title is missing"}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
          {isOrganic && (
            <span className="absolute top-0 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-md z-10">
              {grade}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 flex flex-col min-h-[180px] gap-2">
        <div className="h-[56px] flex-shrink-0">
          <h4 className="font-semibold text-lg line-clamp-2 text-gray-900 group-hover:text-[#0f03faba] transition-colors">
            {title}
          </h4>
        </div>

        <div className="flex items-center mb-2 flex-shrink-0">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-4 w-4 ${i < Math.floor(rate) ? "text-yellow-400" : "text-gray-200"
                }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({count})</span>
        </div>

        <p className="text-sm text-gray-700 line-clamp-2">{description}</p>

        <div className="mt-2 flex flex-col gap-2 text-sm">
          {/* Sustainable Score */}


          {/* Green Points */}
          <div>
            <p className={`font-medium mb-1 ${isOrganic ? "text-green-800" : "text-red-500"}`}>
              🌱 Green Points: {isOrganic ? greenPoints : 0}
            </p>
            <div className={`w-full ${isOrganic ? "bg-green-100" : "bg-red-100"} rounded h-2`}>

              <div
                className={`h-2 rounded-full ${isOrganic ? "bg-green-500" : "bg-red-300"}`}
                style={{ width: `${isOrganic ? Math.min(greenPoints / 10, 100) : 0}%` }}
              ></div>
            </div>
          </div>

          <div>
            <p className={`font-medium mb-1 ${isOrganic ? "text-green-800" : "text-red-500"}`}>
              ♻️ Sustainable Score: {isOrganic ? sustainableScore : 0}
            </p>
            <div className={`w-full ${isOrganic ? "bg-green-100" : "bg-red-100"} rounded h-2`}>
              <div
                className={`h-2 rounded-full ${isOrganic ? "bg-green-500" : "bg-gray-300"}`}
                style={{ width: `${isOrganic ? Math.min(sustainableScore, 100) : 0}%` }}
              ></div>

            </div>
          </div>
        </div>


        <div className="flex items-center justify-between mt-4 flex-shrink-0">
          <p className="text-lg font-bold">₹{price.toFixed(2)}</p>
          <Button
            variant=" "
            className="bg-yellow-500 hover:bg-yellow-600 transition"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
