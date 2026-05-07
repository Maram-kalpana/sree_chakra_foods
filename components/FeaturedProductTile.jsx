"use client";

import React from "react";
import { Clock, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function FeaturedProductTile({
  id,
  name,
  qtyLine,
  price,
  image,
  currencySymbol = "£",
  categoryLabel,
  rating,
  showLowStock,
  superSaver,
  stripLayout = false,
  showRightDivider = false,
}) {
  const { addToCart } = useCart();
  const fallbackImg = "/Fudco.avif";

  const handleAdd = () => {
    addToCart({
      id,
      variationId: id,
      name,
      price,
      image,
      stock: showLowStock ? 3 : 99,
    });
  };

  return (
    <div
      className={
        stripLayout
          ? "relative flex h-full w-full min-h-[280px] flex-col rounded-sm border border-gray-200 bg-white"
          : "relative flex h-full min-h-[310px] flex-col rounded-sm border border-gray-200 bg-white"
      }
    >
      {superSaver ? (
        <div className="absolute right-2 top-2 z-[2] rounded-sm bg-[#fdd835] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-black shadow-sm">
          Super Saver
        </div>
      ) : null}

      <div
        className={
          stripLayout
            ? "relative flex flex-1 items-center justify-center px-3 pt-8"
            : "relative flex min-h-[120px] flex-1 items-center justify-center px-3 pt-4"
        }
      >
        <img
          src={image || fallbackImg}
          alt=""
          className={
            stripLayout
              ? "max-h-[140px] w-auto object-contain"
              : "max-h-[120px] w-auto object-contain sm:max-h-[130px]"
          }
          loading="lazy"
          onError={(e) => {
            if (e?.currentTarget?.src?.includes(fallbackImg)) return;
            e.currentTarget.src = fallbackImg;
          }}
        />
      </div>

      <div className={stripLayout ? "flex flex-1 flex-col px-4" : "flex shrink-0 flex-col px-3"}>
        <div className={`flex min-h-[22px] justify-end ${categoryLabel ? "" : "mt-2"}`}>
          {showLowStock ? (
            <span className="inline-flex items-center gap-1 rounded-sm bg-orange-500 px-2 py-0.5 text-[10px] font-semibold text-white">
              <Clock className="h-3 w-3 shrink-0" aria-hidden />
              Low Stock
            </span>
          ) : null}
        </div>

        {categoryLabel ? (
          <p className="mt-2 text-xs font-medium text-[#99ca20]">{categoryLabel}</p>
        ) : null}

        <p
          className={`line-clamp-2 text-sm font-bold leading-snug text-gray-900 ${
            categoryLabel ? "mt-2" : "mt-3"
          }`}
        >
          {name}
        </p>
        {qtyLine ? <p className="mt-1 text-xs text-gray-500">{qtyLine}</p> : null}

        <div className="mt-3 flex items-baseline justify-between gap-2">
          <span className="text-base font-bold text-gray-900">
            {currencySymbol}
            {Number(price).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </span>
          {typeof rating === "number" ? (
            <span className="flex items-center gap-0.5 text-xs font-semibold text-gray-700">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
              {rating.toFixed(1)}
            </span>
          ) : (
            <span />
          )}
        </div>

        <div className={stripLayout ? "mt-auto pb-5 pt-4" : "mt-auto pb-4 pt-4"}>
          <button
            type="button"
            onClick={handleAdd}
            className="h-10 w-full bg-[#99ca20] text-sm font-semibold text-black hover:bg-[#88b71c]"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}

