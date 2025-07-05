"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";

function CategoryCard({ title, image, link }) {
  const router = useRouter();

  return (
    <Card 
      className="group hover:shadow-lg hover:bg-gray-200 transition-all duration-300 cursor-pointer min-w-[160px] max-w-[200px]"
      onClick={() => router.push(link)}
    >
      <CardContent className="p-4 flex flex-col items-center">
        <div className="relative h-32 w-32 mb-3 group-hover:scale-105 transition-transform duration-300">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain"
          />
        </div>
        <p className="text-sm font-medium text-center text-gray-900 group-hover:text-[#fa6103] transition-colors">
          {title}
        </p>
      </CardContent>
    </Card>
  );
}

export default CategoryCard; 