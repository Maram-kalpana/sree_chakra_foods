"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const LoadingAnimation = ({ onComplete }) => {
  const [currentItem, setCurrentItem] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [logoVisible, setLogoVisible] = useState(false);
  const logo = "/sreelogo.jpeg";

  const herbalItems = [
    { emoji: "❄️", name: "Fresh & Frozen" },
    { emoji: "🧺", name: "Cupboards" },
    { emoji: "🌶️", name: "Ingredients" },
    { emoji: "🧴", name: "Health & Beauty" },
    { emoji: "🪔", name: "Pooja" },
  ];

  useEffect(() => {
    // Logo pop-in
    const logoTimer = setTimeout(() => setLogoVisible(true), 200);

    const interval = setInterval(() => {
      setCurrentItem((prev) => {
        if (prev < herbalItems.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500);
          }, 800);
          return prev;
        }
      });
    }, 600);

    return () => {
      clearTimeout(logoTimer);
      clearInterval(interval);
    };
  }, [onComplete, herbalItems.length]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-white opacity-0 transition-opacity duration-500 z-50" />
    );
  }

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo */}
        <div
          className={`mb-8 transition-all duration-700 ease-out ${
            logoVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
        >
          <Image
            src={logo}
            alt="Sree Chakra Foods"
            width={140}
            height={140}
            priority
            className="mx-auto"
          />
        </div>

        {/* Herbal Items Animation */}
        <div className="flex justify-center items-center space-x-6 mb-8">
          {herbalItems.map((item, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${
                index <= currentItem
                  ? "opacity-100 scale-100"
                  : "opacity-30 scale-75"
              }`}
            >
              <div className="text-4xl mb-2">{item.emoji}</div>
              <div className="text-sm text-gray-600">{item.name}</div>
            </div>
          ))}
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-2 bg-green-100 rounded-full mx-auto overflow-hidden">
          <div
            className="h-full bg-green-600 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${((currentItem + 1) / herbalItems.length) * 100}%`,
            }}
          />
        </div>

        {/* Loading Text */}
        <div className="text-gray-700 mt-4 text-base">
          {currentItem === herbalItems.length - 1
            ? "Welcome to Sree Chakra Foods"
            : "Preparing your store..."}
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
