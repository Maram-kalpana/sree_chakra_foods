"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_SLIDES = [
  { image: "/Mango_Desktop.png", alt: "Mango banner" },
  { image: "/Mango_Desktop.png", alt: "Mango banner" },
  { image: "/Mango_Desktop.png", alt: "Mango banner" },
];

/** Hero promos — reference: ~15–20px gutters, rounded cards, roomy horizontal padding */
export default function HeroCarousel({ slides = DEFAULT_SLIDES, intervalMs = 5000 }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % slides.length), intervalMs);
    return () => clearInterval(t);
  }, [slides.length, intervalMs]);

  const current = slides[idx] ?? slides[0];

  return (
    <section className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-[1320px] px-4 pb-6 pt-5 sm:px-5 md:px-8 lg:px-10">
        <div className="hidden gap-5 md:grid md:grid-cols-3">
          {slides.slice(0, 3).map((s, i) => (
            <div
              key={`${s.image}-${i}`}
              className="multi-image-item overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-[0_1px_2px_rgba(15,72,41,0.06)]"
            >
              <img
                src={s.image}
                alt={s.alt || "Banner"}
                loading="lazy"
                className="desktop-image w-full h-auto"
              />
            </div>
          ))}
        </div>

        <div className="multi-image-item relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 md:hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={current.image + idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              src={current.image}
              alt={current.alt || "Banner"}
              loading="lazy"
              className="desktop-image w-full h-auto"
            />
          </AnimatePresence>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === idx ? "w-6 bg-[#99ca20]" : "w-1.5 bg-white/90 shadow-sm"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
