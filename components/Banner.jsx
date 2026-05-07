"use client";

import React from "react";

export default function Banner({ src = "/gayatri/banner-1.svg", alt = "Banner" }) {
  return (
    <section className="mt-10 sm:mt-12">
      <div className="mx-auto max-w-[1320px] px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="border border-gray-200 bg-gray-50 overflow-hidden rounded-md">
          <img src={src} alt={alt} className="w-full h-[170px] sm:h-[220px] object-cover" />
        </div>
      </div>
    </section>
  );
}

