"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import FeaturedProductTile from "@/components/FeaturedProductTile";

/**
 * Same outer spacing rhythm as HomeSectionCarousel (inline variant).
 */
export default function FeaturedProductCarousel({
  title,
  viewAllText = "View all",
  items = [],
  onViewAll,
  stripLayout = false,
}) {
  const prevClass = stripLayout
    ? "bottom-auto left-2 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full border-gray-200 bg-white text-gray-700 shadow-lg hover:bg-white disabled:pointer-events-none disabled:opacity-30 sm:left-3"
    : "bottom-auto left-2 top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full border-gray-300 bg-white text-gray-600 shadow-sm hover:bg-white disabled:pointer-events-none disabled:opacity-30 sm:left-3";
  const nextClass = stripLayout
    ? "bottom-auto right-2 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full border-gray-200 bg-white text-gray-700 shadow-lg hover:bg-white disabled:pointer-events-none disabled:opacity-30 sm:right-3"
    : "bottom-auto right-2 top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full border-gray-300 bg-white text-gray-600 shadow-sm hover:bg-white disabled:pointer-events-none disabled:opacity-30 sm:right-3";

  return (
    <section className="mt-10 sm:mt-12">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{title}</h2>
        <button
          type="button"
          onClick={() => onViewAll?.()}
          className="shrink-0 text-sm font-medium text-[#99ca20] underline underline-offset-2 hover:opacity-90"
        >
          {viewAllText}
        </button>
      </div>

      <div
        className={
          stripLayout
            ? "relative mt-4 h-[360px] w-full bg-white sm:h-[340px]"
            : "relative mt-4 min-h-[320px] w-full rounded-sm border border-gray-200 bg-white pb-14"
        }
      >
        <Carousel opts={{ align: "start", dragFree: true }} className="h-full w-full">
          <CarouselContent
            className={
              stripLayout ? "-ml-0 gap-[10px] px-[6px]" : "-ml-0 gap-3 px-1 sm:px-2"
            }
          >
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className={
                  stripLayout
                    ? "flex h-full basis-[82%] pl-0 sm:basis-[48%] md:basis-[32%] lg:basis-[20%] xl:basis-[20%]"
                    : "flex h-full basis-[80%] pl-0 sm:basis-[46%] md:basis-[31%] lg:basis-[24%] xl:basis-[19%]"
                }
              >
                <FeaturedProductTile
                  id={item.id}
                  name={item.name}
                  qtyLine={item.qty}
                  price={item.price}
                  image={item.image}
                  categoryLabel={item.categoryLabel}
                  rating={item.rating}
                  showLowStock={item.low}
                  superSaver={item.superSaver}
                  stripLayout={stripLayout}
                  showRightDivider={false}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className={prevClass} />
          <CarouselNext className={nextClass} />
        </Carousel>
      </div>
    </section>
  );
}

