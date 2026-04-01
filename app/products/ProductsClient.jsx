"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Package } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import api from "@/lib/api";

export default function ProductsClient({ categorySlug, filters }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

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
  if (!products.length) {
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Product Count Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between pb-3 sm:pb-4 border-b"
      >
        <p className="text-xs sm:text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">1-{products.length}</span> of{" "}
          <span className="font-semibold text-gray-900">{totalProducts}</span> products
        </p>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
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
