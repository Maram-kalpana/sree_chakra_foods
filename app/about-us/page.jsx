"use client";

import React from "react";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function AboutUsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-10">
          <h1 className="text-3xl font-bold text-[#8B1D3D] mb-8 text-center">
            About Us
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left Image */}
            <div className="flex justify-center">
              <img
                src="/sreelogo.jpeg"
                alt="Sridevi Herbal & Co"
                className="w-full max-w-md object-contain"
              />
            </div>

            {/* Right Content */}
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <span className="font-semibold text-gray-900">Sree Chakra Foods</span> is a UK-based
                Indian grocery store bringing the taste of India to your doorstep.
              </p>

              <p>
                We stock everyday essentials and speciality items—spices, lentils, rice, snacks,
                ready-to-cook mixes, pooja items, and more—so you can shop all your favourites in
                one place.
              </p>

              <p>
                Our focus is simple: authentic products, good quality, and a smooth shopping
                experience for customers across the UK.
              </p>

              <p className="text-[#8B1D3D] font-semibold">
                Need help choosing products? Contact us—we’re happy to help.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
