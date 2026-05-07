"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import GayatriProductTile from "@/components/GayatriProductTile";

function buildPlaceholderProducts(title) {
  return Array.from({ length: 8 }).map((_, i) => {
    const hasDiscount = i !== 0;
    const sale = ["8", "10", "11", "14", "20", "22", "23", "18"][i] || "15";
    return {
      id: `dummy-${title}-${i}`,
      name: `Product ${i + 1}`,
      images: [{ image_url: "/gayatri/product.svg" }],
      min_variant_price: String(120 + i * 15),
      variant_combinations: [
        {
          id: i + 1,
          quantity: 10,
          extra_price: String(hasDiscount ? Math.round((120 + i * 15) * 1.12) : 120 + i * 15),
          discount: hasDiscount ? Number(sale) : 0,
          name: i % 3 === 0 ? `${200 + i * 50}g` : "",
        },
      ],
    };
  });
}

/**
 * @param {"weekly" | "inline"} carouselNavVariant weekly: promo strip + seam arrow; inline: side arrows (Smart Cart style)
 * @param fallbackProducts Optional food-style placeholders when `products` is empty (from `homeSectionsDummy`).
 */
export default function HomeSectionCarousel({
  title,
  viewAllText = "View all",
  leftPromoImage = "/gayatri/weekly-offers.svg",
  products = [],
  fallbackProducts,
  onViewAll,
  showLeftBanner = true,
  /** ~12px gutters between product cards (reference) */
  spacedCards = true,
  carouselNavVariant = "weekly",
}) {
  const list =
    products.length > 0 ? products : fallbackProducts ?? buildPlaceholderProducts(title);

  // Reference: big circular arrows, vertically centered (desktop).
  const arrowBase =
    "z-20 h-12 w-12 rounded-full border border-gray-200 bg-white text-black shadow-lg hover:bg-white disabled:pointer-events-none disabled:opacity-30";

  // Weekly: arrows should float inside the product slider like the reference.
  const prevWeekly = `hidden lg:flex left-3 top-1/2 -translate-y-1/2 ${arrowBase}`;
  const nextWeekly = `hidden lg:flex right-3 top-1/2 -translate-y-1/2 ${arrowBase}`;

  // Inline sections: arrows inside the container.
  const prevInline = `bottom-auto left-2 top-1/2 -translate-y-1/2 ${arrowBase} h-10 w-10 shadow-md sm:left-3`;
  const nextInline = `bottom-auto right-2 top-1/2 -translate-y-1/2 ${arrowBase} h-10 w-10 shadow-md sm:right-3`;

  const referenceCardGap = spacedCards ? "gap-[10px]" : "gap-0";
  const referenceTrackPad = spacedCards ? "px-[6px]" : "px-0";

  return (
    <section className="mt-10 sm:mt-12">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{title}</h2>
        <button
          type="button"
          onClick={() => onViewAll?.()}
          className="shrink-0 text-sm font-medium text-[#99ca20] hover:underline"
        >
          {viewAllText}
        </button>
      </div>

      <div className={`mt-4 flex flex-col ${showLeftBanner ? "gap-3 lg:flex-row lg:items-stretch" : ""}`}>
        {/* LEFT PROMO BANNER (Weekly Offers) */}
        {showLeftBanner ? (
          <div className="relative hidden h-[360px] w-full shrink-0 overflow-hidden rounded-sm border border-gray-200 bg-white sm:h-[340px] lg:flex lg:w-[360px] xl:w-[380px]">
            <img src={leftPromoImage} alt="" className="h-full w-full object-cover" />
          </div>
        ) : null}

        {/* PRODUCT SLIDER */}
        <div className="relative h-[360px] min-w-0 flex-1 bg-white sm:h-[340px] lg:overflow-visible">
          <Carousel
            opts={{
              align: "start",
              dragFree: false,
            }}
            className="h-full w-full"
          >
            <CarouselContent className={`-ml-0 ${referenceCardGap} ${referenceTrackPad}`}>
              {list.map((p) => (
                <CarouselItem
                  key={p.id}
                  className={
                    spacedCards
                      ? "pl-0 basis-[82%] sm:basis-[48%] md:basis-[32%] lg:basis-[20%] xl:basis-[20%]"
                      : "pl-0 basis-[78%] sm:basis-[48%] md:basis-[32%] lg:basis-[20%] xl:basis-[20%]"
                  }
                >
                  <GayatriProductTile
                    product={p}
                    offerStripLayout
                    spacedOfferCards={spacedCards}
                    showRightDivider={false}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className={carouselNavVariant === "weekly" ? prevWeekly : prevInline} />
            <CarouselNext className={carouselNavVariant === "weekly" ? nextWeekly : nextInline} />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
