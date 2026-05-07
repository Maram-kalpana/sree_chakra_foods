"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Grid, List, Loader2, Package, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import api from "@/lib/api";

function humanizeCategory(slug) {
  if (!slug) return "All Products";
  const s = String(slug).toLowerCase();
  if (s.includes("fresh") || s.includes("frozen")) return "Fresh & Frozen";
  if (s.includes("cup")) return "Cupboard";
  if (s.includes("ingre")) return "Ingredients";
  if (s.includes("health") || s.includes("beauty")) return "Health & Beauty";
  if (s.includes("pooja") || s.includes("relig")) return "Religious Items";
  return String(slug).replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

function matchTypeKey(product, key) {
  const hay = [
    product?.category?.name,
    product?.category_name,
    product?.category_main?.name,
    product?.subcategory,
    product?.sub_category,
    product?.subCategory,
    product?.subcategory_name,
    product?.type,
    product?.type_name,
    product?.product_type,
    product?.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const tests = {
    dairy: ["dairy", "milk", "cheese", "curd", "yogurt", "butter"],
    frozen: ["frozen", "ice", "fries", "nugget"],
    fruits: ["fruit", "apple", "banana", "mango", "grape", "orange"],
    vegetables: ["vegetable", "veg", "tomato", "onion", "spinach", "okra"],
    "biscuits-bakery": ["biscuit", "cookies", "bakery", "bread", "cake"],
    "canned-tins": ["canned", "tin", "beans", "corn"],
    drinks: ["drink", "juice", "soda", "cola"],
    "hot-beverages": ["tea", "coffee", "hot"],
    "indian-snacks": ["snack", "namkeen", "sev", "bhujia", "chips"],
    mukhwas: ["mukhwas", "saunf", "fennel"],
    "noodles-pasta": ["noodle", "pasta", "macaroni"],
    "dals-beans": ["dal", "lentil", "beans", "chana", "rajma"],
    "dry-fruits-nuts": ["dry", "nuts", "almond", "cashew", "raisin", "pista"],
    flours: ["flour", "atta", "maida", "besan", "rava", "sooji"],
    "ghee-oils": ["ghee", "oil"],
    "ground-spices": ["spice", "masala", "chilli", "turmeric", "pepper", "cumin"],
    "jaggery-salt-sugar": ["jaggery", "salt", "sugar"],
    rice: ["rice", "basmati"],
    "health-beauty": ["health", "beauty", "cream", "soap", "detergent", "shampoo"],
    "religious-items": ["pooja", "religious", "agarbatti", "incense", "kumkum", "chandan"],
  };

  const keywords = tests[key] || [key];
  return keywords.some((k) => hay.includes(String(k)));
}

export default function ProductsClient({ categorySlug, filters }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/ecom/products-main", {
          params: {
            ...(categorySlug ? { category: categorySlug } : {}),
            ...(filters || {}),
          },
        });

        const data = res.data?.data?.data || [];
        const total = res.data?.data?.total || data.length;
        
        setProducts(data);
        setTotalProducts(total);
      } catch (err) {
        console.error(err);
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, JSON.stringify(filters)]);

  const typeKeys = Array.isArray(filters?.type_keys) ? filters.type_keys : [];
  const visibleProducts =
    typeKeys.length > 0 ? products.filter((p) => typeKeys.some((k) => matchTypeKey(p, k))) : products;

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-red-900 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading products...</p>
      </div>
    );
  }

  // Empty State
  if (!visibleProducts.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Package className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          We couldn't find any products matching your criteria. Try adjusting your filters.
        </p>
      </motion.div>
    );
  }

  const title = humanizeCategory(categorySlug);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Breadcrumb + Title (reference-style) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Home</span>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <span className="text-gray-700">{title}</span>
        </div>

        <div className="flex flex-wrap items-baseline gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {title}
          </h1>
          <span className="text-sm font-medium text-gray-500">({totalProducts} products)</span>
        </div>
      </div>

      {/* Controls row (reference-style) */}
      <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
        >
          Filter
          <SlidersHorizontal className="h-4 w-4 text-gray-500" aria-hidden />
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="font-medium">Sort By</span>
            <span className="text-gray-500">Featured</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="font-medium">View as</span>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-md border ${
                viewMode === "list" ? "border-gray-300 bg-gray-50" : "border-transparent"
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-md border ${
                viewMode === "grid" ? "border-gray-300 bg-gray-50" : "border-transparent"
              }`}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <motion.div
        layout
        className={
          viewMode === "list"
            ? "grid grid-cols-1 gap-3 sm:gap-4"
            : "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        }
      >
        <AnimatePresence mode="popLayout">
          {visibleProducts.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: "easeOut",
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
