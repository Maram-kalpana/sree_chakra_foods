"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    image: "/banner1.webp",
  },
  {
    image: "/banner1.webp",
  },
  {
    image: "/banner1.webp",
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
    <section className="relative w-full h-[360px] md:h-[500px] lg:h-[620px] overflow-hidden rounded-b-3xl border border-[#e7dccf] shadow-[0_18px_40px_-22px_rgba(61,23,34,0.55)] mb-14">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentSlide.image + currentIndex}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          src={currentSlide.image}
          alt="Collection banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
    </section>
  );
};

export default AdBanner;
