"use client";

import React, { useMemo } from "react";
import { foodImg } from "@/lib/homeSectionsDummy";

const FALLBACK = [
  { id: 1, name: "Fresh & Frozen", slug: "fresh-frozen" },
  { id: 2, name: "Cupboards", slug: "cupboard" },
  { id: 3, name: "Ingredients", slug: "ingredients" },
  { id: 4, name: "Health & Beauty", slug: "health-beauty" },
  { id: 5, name: "Pooja", slug: "pooja" },
];

const IMAGES = [
  // Food-photo placeholders (avoid cartoon icons)
  // Use known-good Unsplash IDs (avoid 404s that show broken icons)
  foodImg("photo-1517248135467-4c7edcad34c4", 420), // fresh & frozen
  foodImg("photo-1589308078059-be1415eab4c3", 420), // cupboards (pantry)
  foodImg("photo-1589985270744-068a9c8dcb6f", 420), // ingredients (spices)
  foodImg("photo-1570172619644-dfd03ed8d097", 420), // health & beauty (wellness)
  foodImg("photo-1604909053196-7d0d6a3a0c4d", 420), // pooja (fallback food-style)
];

export default function CategoryGrid({
  title = "Shop by Categories",
  categories = [],
  onSelect,
  onViewAll,
}) {
  // Keep integration as-is, but force the UI to show only the requested top categories.
  const items = useMemo(() => {
    const desired = FALLBACK;
    const incoming = Array.isArray(categories) ? categories : [];

    const bySlug = new Map(incoming.map((c) => [String(c?.slug || "").toLowerCase(), c]));
    const byName = new Map(incoming.map((c) => [String(c?.name || "").toLowerCase(), c]));

    return desired.map((d) => {
      const slugKey = String(d.slug).toLowerCase();
      const nameKey = String(d.name).toLowerCase();
      return bySlug.get(slugKey) || byName.get(nameKey) || d;
    });
  }, [categories]);
  const fallbackImg = "/Fudco.avif";

  return (
    <section className="pt-6 sm:pt-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
        <button
          type="button"
          onClick={() => onViewAll?.()}
          className="shrink-0 text-sm text-[#99ca20] underline underline-offset-2 font-medium hover:opacity-90"
        >
          View All
        </button>
      </div>

      <div
        className="mt-5 grid w-full gap-x-3 gap-y-10 sm:gap-x-5 md:gap-x-6 lg:gap-x-8 justify-items-center"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))",
        }}
      >
        {items.slice(0, 10).map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect?.(c)}
            className="group flex w-full max-w-[160px] flex-col items-center sm:max-w-none"
          >
            <div className="h-[112px] w-[112px] overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center">
              <img
                src={IMAGES[i % IMAGES.length]}
                alt={c.name}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-[1.05]"
                loading="lazy"
                onError={(e) => {
                  if (e?.currentTarget?.src?.includes(fallbackImg)) return;
                  e.currentTarget.src = fallbackImg;
                }}
              />
            </div>
            <p className="mt-4 text-sm font-semibold text-gray-900 text-center group-hover:text-[#99ca20]">
              {c.name}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

