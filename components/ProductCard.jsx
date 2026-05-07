"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Heart, Play, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import VideoPopup from "./VideoPopup";

export default function ProductCard({ product, variant = "default" }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, openLogin } = useAuth();

  const [showVideo, setShowVideo] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const variants = product.variant_combinations || [];
  const firstVariant = variants[0] || null;
  const inStockVariant =
    variants.find((v) => Number(v?.quantity || 0) > 0) || firstVariant;
  const isShowcase = variant === "showcase";

  const toNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url;
  const fallbackImg = "/Fudco.avif";

  const price =
    toNumber(product.min_variant_price) ??
    toNumber(product.final_price) ??
    toNumber(inStockVariant?.amount) ??
    toNumber(inStockVariant?.extra_price) ??
    toNumber(product.price) ??
    0;

  const originalPrice =
    toNumber(inStockVariant?.extra_price) ??
    toNumber(firstVariant?.extra_price) ??
    toNumber(product.price) ??
    null;

  const rawDiscount =
    toNumber(inStockVariant?.discount) ??
    toNumber(firstVariant?.discount) ??
    toNumber(product.discount) ??
    null;

  const computedDiscount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const discountPercent =
    computedDiscount && computedDiscount > 0
      ? computedDiscount
      : rawDiscount && rawDiscount > 0 && rawDiscount <= 100
        ? Math.round(rawDiscount)
        : null;

  const category =
    product.category?.name || product.category_name || product.category_main?.name;

  const videoUrl = product.videos?.[0]?.video_url;

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (!price || !primaryImage) {
      toast.error("Product information incomplete");
      return;
    }

    const selectedVariant =
      product.variant_combinations?.find((v) => Number(v?.quantity || 0) > 0) ||
      product.variant_combinations?.[0];

    if (!selectedVariant) {
      toast.error("No variants available");
      return;
    }

    const variantPrice =
      toNumber(selectedVariant.amount) ??
      toNumber(selectedVariant.extra_price) ??
      toNumber(selectedVariant.price) ??
      price;

    const variantStock = Number(selectedVariant.quantity || 0);

    addToCart({
      id: product.id,
      variationId: selectedVariant.id ?? product.id,
      name: product.name,
      price: variantPrice,
      image: primaryImage,
      stock: variantStock,
    });
    toast.success("Added to cart!");
  };

  const handleOpenProduct = () => {
    if (product.slug) {
      router.push(`/product/details?slug=${product.slug}`);
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      openLogin();
      return;
    }

    toggleWishlist(product);
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleVideoClick = (e) => {
    e.stopPropagation();
    setShowVideo(true);
  };

  if (!product.name) {
    return null;
  }

  const cardClasses = isShowcase
    ? "relative bg-white/95 rounded-2xl border border-[#e8ddd2] overflow-hidden group cursor-pointer shadow-[0_14px_30px_-18px_rgba(62,20,34,0.5)] hover:shadow-[0_20px_42px_-20px_rgba(62,20,34,0.56)] transition-all duration-300"
    : "relative bg-white rounded-[14px] border border-gray-200 overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]";

  const imageWrapperClasses = isShowcase
    ? "relative aspect-[4/5] overflow-hidden bg-[#f6ede1]"
    : "relative aspect-[4/3] overflow-hidden bg-white";

  const addToCartClasses = isShowcase
    ? "w-full bg-[#8b1d3d] text-white text-xs sm:text-sm font-semibold py-2 sm:py-2.5 rounded-md hover:bg-[#791733] transition-colors flex items-center justify-center gap-2 mt-2 sm:mt-3"
    : "w-full bg-[#99ca20] text-black text-sm font-semibold py-2.5 rounded-md hover:bg-[#88b71c] transition-colors flex items-center justify-center gap-2 mt-3";

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.25 }}
        className={cardClasses}
        onClick={handleOpenProduct}
      >
        {discountPercent && (
          <div className="absolute top-0 left-0 z-10 bg-[#ffeb3b] text-black text-[11px] font-bold px-2 py-1">
            {discountPercent}% off
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWishlist}
          className="absolute top-2 right-2 z-10 bg-white/95 p-2 rounded-full shadow-sm hover:shadow-md transition-all"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              inWishlist ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
            }`}
          />
        </motion.button>

        <div className={imageWrapperClasses}>
          <motion.img
            whileHover={{ scale: 1.07 }}
            transition={{ duration: 0.35 }}
            src={primaryImage || fallbackImg}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              if (e?.currentTarget?.src?.includes(fallbackImg)) return;
              e.currentTarget.src = fallbackImg;
            }}
          />

          {videoUrl && (
            <button
              onClick={handleVideoClick}
              className="absolute bottom-2 sm:bottom-2.5 right-2 sm:right-2.5 bg-black/55 hover:bg-black/70 text-white p-1 sm:p-1.5 rounded-full transition-colors"
            >
              <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          )}
        </div>

        <div className={`${isShowcase ? "p-3.5 space-y-2.5" : "px-3 pb-3"}`}>
          {category && (
            <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold mt-2">
              {category}
            </p>
          )}

          <h3 className="mt-2 text-sm font-semibold text-gray-900 line-clamp-2 min-h-[42px]">
            {product.name}
          </h3>

          {isShowcase && (
            <div className="flex items-center gap-1 text-[#d4931a]">
              {[...Array(5)].map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${idx < 4 ? "fill-current" : "text-[#d7d0c4]"}`}
                />
              ))}
              <span className="text-[10px] sm:text-[11px] text-[#8a7a6d] ml-1">(148)</span>
            </div>
          )}

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm font-bold text-gray-900">
              {"£"}
              {price.toLocaleString("en-IN")}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-gray-400 line-through">
                {"£"}
                {originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className={addToCartClasses}
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Add To Cart</span>
          </motion.button>
        </div>
      </motion.div>

      <VideoPopup
        videoUrl={videoUrl}
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
      />
    </>
  );
}
