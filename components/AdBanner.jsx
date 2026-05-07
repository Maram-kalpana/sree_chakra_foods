"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    image: "/gayatri/banner-1.svg",
  },
  {
    image: "/gayatri/banner-2.svg",
  },
  {
    image: "/gayatri/banner-1.svg",
  },
];

const INTERVAL = 5000;

const AdBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = slides[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full bg-white border-b border-gray-200">
      <div className="mx-auto max-w-[1320px] px-3 sm:px-4 md:px-6 lg:px-8 py-3">
        <div className="hidden md:grid grid-cols-3 gap-3">
          {slides.slice(0, 3).map((s, idx) => (
            <div
              key={`${s.image}-${idx}`}
              className="border border-gray-200 bg-gray-50 overflow-hidden h-[170px] lg:h-[190px]"
            >
              <img src={s.image} alt="Banner" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="md:hidden relative overflow-hidden border border-gray-200 bg-gray-50 h-[170px]">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide.image + currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              src={currentSlide.image}
              alt="Banner"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-6 bg-[#99ca20]" : "w-1.5 bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdBanner;
