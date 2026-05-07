"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "@/components/ProductCard";

export default function ProductSection({
  title,
  viewAllText = "View all",
  products = [],
  variant = "default",
}) {
  return (
    <section className="mt-10 sm:mt-12">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
        <button className="text-sm text-[#99ca20] hover:underline font-medium">
          {viewAllText}
        </button>
      </div>

      {/* Mobile slider */}
      <div className="mt-4 md:hidden">
        <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
          <CarouselContent className="-ml-3">
            {products.map((p) => (
              <CarouselItem key={p.id} className="pl-3 basis-[80%]">
                <ProductCard product={p} variant={variant} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-3 border-gray-300" />
          <CarouselNext className="-right-3 border-gray-300" />
        </Carousel>
      </div>

      {/* Desktop grid */}
      <div className="mt-4 hidden md:grid grid-cols-5 gap-4">
        {products.slice(0, 10).map((p) => (
          <ProductCard key={p.id} product={p} variant={variant} />
        ))}
      </div>
    </section>
  );
}

