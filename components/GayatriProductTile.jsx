"use client";

import React, { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function GayatriProductTile({
  product,
  currencySymbol = "£",
  offerStripLayout = false,
  showRightDivider = true,
  /** When true with offer strip: full border + rounding and gaps between cards (reference spacing). */
  spacedOfferCards = false,
}) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  const fallbackImg = "/Fudco.avif";

  const primaryImage =
    product?.images?.find?.((img) => img?.is_primary && img?.image_url)?.image_url ||
    product?.images?.find?.((img) => img?.image_url)?.image_url ||
    product?.image ||
    fallbackImg;

  const variants = product?.variant_combinations || [];
  const firstVariant = variants[0] || null;
  const inStockVariant =
    variants.find((v) => Number(v?.quantity || 0) > 0) || firstVariant;

  const price = useMemo(() => {
    return (
      toNumber(product?.min_variant_price) ??
      toNumber(product?.final_price) ??
      toNumber(inStockVariant?.amount) ??
      toNumber(inStockVariant?.extra_price) ??
      toNumber(product?.price) ??
      0
    );
  }, [product, inStockVariant]);

  const originalPrice = useMemo(() => {
    return (
      toNumber(inStockVariant?.extra_price) ??
      toNumber(firstVariant?.extra_price) ??
      toNumber(product?.price) ??
      null
    );
  }, [inStockVariant, firstVariant, product]);

  const discountPercent = useMemo(() => {
    if (originalPrice && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    const raw =
      toNumber(inStockVariant?.discount) ??
      toNumber(firstVariant?.discount) ??
      toNumber(product?.discount) ??
      null;
    if (raw && raw > 0 && raw <= 100) return Math.round(raw);
    return null;
  }, [originalPrice, price, inStockVariant, firstVariant, product]);

  const stock = Number(inStockVariant?.quantity || 0);
  const isUnavailable = stock <= 0;

  const unitText =
    product?.unit ||
    product?.weight ||
    product?.pack_size ||
    product?.size ||
    product?.variant_combinations?.[0]?.name ||
    "";

  const handleAdd = () => {
    if (isUnavailable) return;
    const selectedVariant = inStockVariant || firstVariant;
    addToCart({
      id: product.id ?? product.sku ?? product.name,
      variationId: selectedVariant?.id ?? product.id ?? product.name,
      name: product.name || "Product",
      price: price || 0,
      image: primaryImage,
      stock,
    });
  };

  const cartBtnClass = offerStripLayout
    ? "w-full h-10 bg-[#99ca20] hover:bg-[#88b71c] text-black text-sm font-semibold"
    : "flex-1 h-10 bg-[#99ca20] hover:bg-[#88b71c] text-black text-sm font-semibold";

  const stripOuterClass =
    offerStripLayout && spacedOfferCards
      ? "relative flex h-full min-h-[280px] flex-col rounded-sm border border-gray-200 bg-white"
      : offerStripLayout
        ? `relative flex h-full min-h-[280px] flex-col bg-white ${showRightDivider ? "border-r border-gray-200" : ""}`
        : "";

  if (offerStripLayout) {
    return (
      <div className={stripOuterClass}>
        {discountPercent ? (
          <div
            className={`absolute left-2 top-2 z-[1] bg-[#ffeb3b] px-2 py-0.5 text-[11px] font-bold text-black ${spacedOfferCards ? "rounded-sm" : ""}`}
          >
            {discountPercent}% off
          </div>
        ) : null}

        <div
          className={`flex flex-1 flex-col px-3 pb-4 ${
            spacedOfferCards ? "pt-8" : "pt-7"
          }`}
        >
          <div className="flex flex-1 items-center justify-center py-2">
            <img
              src={primaryImage}
              alt={product?.name || "Product"}
              className="max-h-[128px] w-auto object-contain sm:max-h-[140px]"
              loading="lazy"
              onError={(e) => {
                if (e?.currentTarget?.src?.includes(fallbackImg)) return;
                e.currentTarget.src = fallbackImg;
              }}
            />
          </div>

          {product?.ui_low_stock ? (
            <div className="-mt-1 mb-1">
              <span className="inline-block rounded-sm bg-orange-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                Low Stock
              </span>
            </div>
          ) : null}

          <div className="min-h-[40px]">
            <p className="line-clamp-2 text-sm font-bold leading-snug text-gray-900">
              {product?.name || "Product"}
            </p>
          </div>
          {unitText ? (
            <p className="mt-1 text-xs text-gray-500">{unitText}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">&nbsp;</p>
          )}

          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0">
            <span className="text-sm font-bold text-gray-900">
              {currencySymbol}
              {Number(price || 0).toLocaleString("en-IN")}
            </span>
            {originalPrice && originalPrice > price ? (
              <span className="text-xs text-gray-400 line-through">
                {currencySymbol}
                {Number(originalPrice).toLocaleString("en-IN")}
              </span>
            ) : null}
          </div>

          <div className="mt-auto pt-4">
            {isUnavailable ? (
              <button
                type="button"
                className="h-10 w-full cursor-not-allowed bg-gray-200 text-sm font-semibold text-gray-500"
                disabled
              >
                Unavailable
              </button>
            ) : (
              <button type="button" onClick={handleAdd} className={cartBtnClass}>
                Add To Cart
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative border border-gray-200 bg-white">
      {discountPercent ? (
        <div className="absolute left-0 top-0 z-[1] bg-[#ffeb3b] px-2 py-0.5 text-[11px] font-bold text-black">
          {discountPercent}% off
        </div>
      ) : null}

      <div className="p-3">
        <div className="flex aspect-[4/3] items-center justify-center">
          <img
            src={primaryImage}
            alt={product?.name || "Product"}
            className="max-h-[120px] w-auto object-contain"
            loading="lazy"
            onError={(e) => {
              if (e?.currentTarget?.src?.includes(fallbackImg)) return;
              e.currentTarget.src = fallbackImg;
            }}
          />
        </div>
      </div>

      <div className="px-3 pb-3">
        <div className="min-h-[44px]">
          <p className="line-clamp-2 text-sm font-semibold text-gray-900">{product?.name || "Product"}</p>
        </div>
        {unitText ? (
          <p className="mt-1 text-xs text-gray-500">{unitText}</p>
        ) : (
          <p className="mt-1 text-xs text-gray-500">&nbsp;</p>
        )}

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0">
          <span className="text-sm font-bold text-gray-900">
            {currencySymbol}
            {Number(price || 0).toLocaleString("en-IN")}
          </span>
          {originalPrice && originalPrice > price ? (
            <span className="text-xs text-gray-400 line-through">
              {currencySymbol}
              {Number(originalPrice).toLocaleString("en-IN")}
            </span>
          ) : null}
        </div>

        <div className="mt-3">
          {isUnavailable ? (
            <button
              type="button"
              className="h-10 w-full cursor-not-allowed bg-gray-200 text-sm font-semibold text-gray-500"
              disabled
            >
              Unavailable
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex h-10 items-center border border-gray-200">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="inline-flex h-10 w-10 items-center justify-center hover:bg-gray-50"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="w-10 text-center text-sm font-semibold text-gray-900">
                  {qty}
                </div>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="inline-flex h-10 w-10 items-center justify-center hover:bg-gray-50"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button type="button" onClick={handleAdd} className={cartBtnClass}>
                Add To Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

