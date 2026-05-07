"use client";

import React from "react";
import { SHOP_BY_BRANDS_IMAGES } from "@/lib/homeSectionsDummy";

export default function BrandStrip({
  title = "Shop By Brands",
  brands = SHOP_BY_BRANDS_IMAGES,
  onViewAll,
}) {
  const labels = ["Fudco", "MDH", "Haldiram's", "Jaimin", "KTC", "Aashirvaad"];

  return (
    <section className="mt-10 sm:mt-12">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{title}</h2>
        <button
          type="button"
          onClick={() => onViewAll?.()}
          className="shrink-0 text-sm font-medium text-[#99ca20] underline underline-offset-2 hover:opacity-90"
        >
          View All
        </button>
      </div>

      <div className="mt-6 flex flex-wrap justify-between gap-x-10 gap-y-10 sm:mt-8 sm:flex-nowrap sm:justify-between sm:gap-x-12 md:gap-x-16">
        {brands.map((src, idx) => (
          <div
            key={`${src}-${idx}`}
            className="flex w-[28%] flex-col items-center sm:w-auto sm:min-w-0 sm:flex-1 sm:max-w-[170px]"
          >
            <div className="flex h-[64px] w-full items-center justify-center sm:h-[72px]">
              <img src={src} alt="" className="h-full w-auto object-contain" />
            </div>
            <p className="mt-3 text-center text-sm font-normal text-gray-900">
              {labels[idx % labels.length]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
