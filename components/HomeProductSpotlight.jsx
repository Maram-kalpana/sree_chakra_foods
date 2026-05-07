"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { HOME_PRODUCT_SPOTLIGHT } from "@/lib/homeSectionsDummy";

export default function HomeProductSpotlight() {
  const p = HOME_PRODUCT_SPOTLIGHT;
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  const pctOff = useMemo(
    () => Math.max(0, Math.round(((p.mrp - p.price) / p.mrp) * 100)),
    [p.mrp, p.price],
  );

  const handleAddToCart = () => {
    const n = Math.min(Math.max(1, qty), p.stock);
    for (let i = 0; i < n; i += 1) {
      addToCart({
        id: p.id,
        variationId: p.variationId,
        name: `${p.name} ${p.unitLabel}`,
        price: p.price,
        image: p.image,
        stock: p.stock,
      });
    }
  };

  return (
    <section className="mt-10 border-t border-gray-200 pt-10 sm:mt-12 sm:pt-12">
      <div className="h-1 w-full max-w-xl rounded-full bg-[#99ca20]" aria-hidden />

      <div className="mt-6 grid gap-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
        <div className="flex items-center justify-center rounded-lg bg-gray-50 p-6 sm:p-10">
          <img
            src={p.image}
            alt=""
            className="max-h-[380px] w-full max-w-md object-contain"
            loading="lazy"
          />
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {p.name}
            </h2>
            <span className="text-base font-normal text-gray-500">{p.unitLabel}</span>
          </div>

          <p className="mt-4 text-[15px] leading-relaxed text-gray-600">{p.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3 gap-y-2">
            <span className="text-3xl font-bold text-gray-900">
              £{p.price.toLocaleString("en-IN")}
            </span>
            <span className="text-lg text-gray-400 line-through">£{p.mrp.toLocaleString("en-IN")}</span>
            {pctOff > 0 ? (
              <span className="rounded-md bg-[#ffeb3b] px-2.5 py-1 text-xs font-bold text-black">
                {pctOff}% off
              </span>
            ) : null}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-gray-600 sm:text-sm">
            Pay in 3 interest-free instalments for eligible orders above{" "}
            <span className="font-semibold text-gray-800">£2,499</span> with supported bank cards.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <div className="inline-flex h-12 shrink-0 items-stretch overflow-hidden rounded-md border border-[#cfe7d5] bg-[#e8f5e9]">
              <button
                type="button"
                className="w-11 text-lg font-medium text-[#99ca20] hover:bg-[#dcefe0]"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <div className="flex min-w-[3rem] items-center justify-center bg-white px-3 text-base font-semibold text-gray-900">
                {qty}
              </div>
              <button
                type="button"
                className="w-11 text-lg font-medium text-[#99ca20] hover:bg-[#dcefe0]"
                onClick={() => setQty((q) => Math.min(p.stock, q + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="h-12 flex-1 rounded-md bg-[#99ca20] px-8 text-base font-semibold text-black transition-colors hover:bg-[#88b71c] sm:min-w-[200px]"
            >
              Add To Cart
            </button>
          </div>

          <Link
            href="/product/details/"
            className="mt-6 w-fit text-sm text-gray-600 underline underline-offset-2 hover:text-gray-900"
          >
            Full details
          </Link>
        </div>
      </div>
    </section>
  );
}

