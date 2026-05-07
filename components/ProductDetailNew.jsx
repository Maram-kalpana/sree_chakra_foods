"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Heart, Share2, ShoppingCart, ArrowLeft, Truck, Shield, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import ProductCard from "./ProductCard";

export default function ProductDetailNew({ product, onBack }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  /* ================= NORMALIZE VARIANTS ================= */
  const variations = useMemo(() => {
    return (
      product.variant_combinations?.map((v) => ({
        id: v.id,
        name: v.values?.map((val) => val.value).join(" / ") || "Variant",
        price: Number(v.amount || v.extra_price),
        originalPrice: Number(v.extra_price),
        stock: v.quantity,
        colorCode: v.values?.find(val => val.color_code)?.color_code,
      })) || []
    );
  }, [product.variant_combinations]);

  /* ================= STATE ================= */
  const [selectedVariation, setSelectedVariation] = useState(
    variations.find((v) => v.stock > 0) || variations[0] || null
  );
  const [selectedImage, setSelectedImage] = useState(0);

  const inWishlist = isInWishlist(product.id);

  /* ================= DERIVED ================= */
  const price = selectedVariation?.price ?? 0;
  const originalPrice = selectedVariation?.originalPrice ?? 0;
  const stock = selectedVariation?.stock ?? 0;
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const images = useMemo(() => {
    const productImages =
      product.images?.map((img) => img.image_url).filter(Boolean) || [];
    return productImages.length ? productImages : ["/banner1.webp"];
  }, [product.images]);

  const videoUrl = product.videos?.[0]?.video_url;

  useEffect(() => {
    if (variations.length && !selectedVariation) {
      setSelectedVariation(variations[0]);
    }
  }, [variations, selectedVariation]);

  /* ================= ACTIONS ================= */
  const handleAddToCart = () => {
    if (!selectedVariation) return;

    if (stock === 0) {
      toast.error("This product is out of stock");
      return;
    }

    addToCart({
      id: product.id,
      variationId: selectedVariation.id,
      name: `${product.name} (${selectedVariation.name})`,
      price,
      image: images[0],
      stock,
    });
    toast.success("Added to cart!");
  };

  const handleWishlistToggle = () => {
    inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  // Static similar products for now
  const similarProducts = [
    {
      id: 999,
      name: "Similar Saree 1",
      slug: "similar-1",
      min_variant_price: "3500",
      category: { name: "Silk Sarees" },
      images: [{ image_url: images[0] }],
      variant_combinations: [{ extra_price: "4000", discount: "10", quantity: 10 }],
    },
    {
      id: 998,
      name: "Similar Saree 2",
      slug: "similar-2",
      min_variant_price: "4200",
      category: { name: "Cotton Sarees" },
      images: [{ image_url: images[1] || images[0] }],
      variant_combinations: [{ extra_price: "4500", discount: "5", quantity: 15 }],
    },
    {
      id: 997,
      name: "Similar Saree 3",
      slug: "similar-3",
      min_variant_price: "3800",
      category: { name: "Designer Sarees" },
      images: [{ image_url: images[2] || images[0] }],
      variant_combinations: [{ extra_price: "4200", discount: "8", quantity: 20 }],
    },
    {
      id: 996,
      name: "Similar Saree 4",
      slug: "similar-4",
      min_variant_price: "5000",
      category: { name: "Bridal Sarees" },
      images: [{ image_url: images[3] || images[0] }],
      variant_combinations: [{ extra_price: "5500", discount: "12", quantity: 8 }],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* BACK BUTTON */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </motion.button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* MAIN PRODUCT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* LEFT: IMAGES */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-4"
          >
            {/* Vertical Thumbnails */}
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px]">
              {images.map((img, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${
                    selectedImage === i
                      ? "border-red-900 ring-2 ring-red-900 ring-offset-2"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>

            {/* Main Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex-1 aspect-square bg-white rounded-2xl overflow-hidden shadow-lg relative group"
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                  {discount}% OFF
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* RIGHT: DETAILS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Category */}
            <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">
              {product.category?.name || product.category_name || "Product"}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">4.3 (120 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-red-900">
                £{price.toLocaleString('en-IN')}
              </span>
              {originalPrice > price && (
                <>
                  <span className="text-2xl text-gray-400 line-through">
                    £{originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-green-600 font-semibold">
                    Save £{(originalPrice - price).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {stock > 0 ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">In Stock ({stock} available)</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Variants */}
            {variations.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 text-gray-700">Select Variant</h3>
                <div className="flex flex-wrap gap-3">
                  {variations.map((v) => (
                    <motion.button
                      key={v.id}
                      whileHover={{ scale: v.stock > 0 ? 1.05 : 1 }}
                      whileTap={{ scale: v.stock > 0 ? 0.95 : 1 }}
                      disabled={v.stock === 0}
                      onClick={() => setSelectedVariation(v)}
                      className={`px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        selectedVariation?.id === v.id
                          ? "border-red-900 bg-red-50 text-red-900 shadow-md"
                          : v.stock === 0
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 hover:border-red-900 hover:bg-red-50"
                      }`}
                    >
                      {v.colorCode && (
                        <div
                          className="w-4 h-4 rounded-full inline-block mr-2 border border-gray-300"
                          style={{ backgroundColor: v.colorCode }}
                        />
                      )}
                      {v.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: stock > 0 ? 1.02 : 1 }}
                whileTap={{ scale: stock > 0 ? 0.98 : 1 }}
                onClick={handleAddToCart}
                disabled={stock === 0}
                className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-3 font-semibold text-lg transition-all shadow-lg ${
                  stock === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-900 hover:bg-red-800 text-white shadow-red-900/30"
                }`}
              >
                <ShoppingCart className="w-6 h-6" />
                {stock === 0 ? "Out of Stock" : "Add to Cart"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWishlistToggle}
                className={`p-4 rounded-xl border-2 transition-all ${
                  inWishlist
                    ? "border-red-300 bg-red-50 text-red-500"
                    : "border-gray-300 text-gray-600 hover:border-red-900 hover:bg-red-50"
                }`}
              >
                <Heart className={`w-6 h-6 ${inWishlist ? "fill-current" : ""}`} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 rounded-xl border-2 border-gray-300 text-gray-600 hover:border-gray-400 transition-all"
              >
                <Share2 className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-red-900" />
                <p className="text-xs font-medium text-gray-700">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders above £999</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-red-900" />
                <p className="text-xs font-medium text-gray-700">Secure Payment</p>
                <p className="text-xs text-gray-500">100% Protected</p>
              </div>
              <div className="text-center">
                <Package className="w-8 h-8 mx-auto mb-2 text-red-900" />
                <p className="text-xs font-medium text-gray-700">Easy Returns</p>
                <p className="text-xs text-gray-500">7 Days Return</p>
              </div>
            </div>

            {/* Description */}
            <div className="pt-6 border-t">
              <h3 className="font-semibold text-lg mb-3 text-gray-900">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description || "No description available for this product."}
              </p>
            </div>
          </motion.div>
        </div>

        {/* PRODUCT VIDEO SECTION */}
        {videoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-16"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Product Video</h2>
                <p className="text-gray-600 mt-1">See this product in action</p>
              </div>
              
              <div className="relative bg-gray-100">
                <video
                  src={videoUrl}
                  controls
                  loop
                  playsInline
                  className="w-full h-auto max-h-[600px] object-contain"
                  controlsList="nodownload"
                  poster={images[0]}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </motion.div>
        )}

        {/* SIMILAR PRODUCTS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Similar Products</h2>
            <button className="text-red-900 font-semibold hover:underline">View All</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarProducts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              >
                <ProductCard product={item} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Video Popup - Removed, using inline video instead */}
    </div>
  );
}
