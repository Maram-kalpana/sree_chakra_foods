"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Crown,
  Flower2,
  Gem,
  RotateCcw,
  Scissors,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/components/LoadingAnimation";
import AdBanner from "@/components/AdBanner";
import ProductCard from "@/components/ProductCard";
import api from "@/lib/api";

const DEAL_SECTION_SLUGS = ["flash-sales", "trending"];
const CATEGORY_ICONS = [Flower2, Scissors, Sparkles, Crown, Gem, BadgeCheck];

const SECTION_META = {
  "flash-sales": {
    subtitle: "Most loved by our customers",
    chip: "Bestsellers",
  },
  trending: {
    subtitle: "Fresh additions to our collection",
    chip: "Trending now",
  },
};

const TRUST_POINTS = [
  {
    title: "Secure Payment",
    text: "100% secure transactions",
    icon: ShieldCheck,
  },
  {
    title: "Free Shipping",
    text: "On orders above \u20B9999",
    icon: Truck,
  },
  {
    title: "Easy Returns",
    text: "7-day return policy",
    icon: RotateCcw,
  },
  {
    title: "Authenticity",
    text: "Crafted with care",
    icon: BadgeCheck,
  },
];

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);

  useEffect(() => {
    const loadHome = async () => {
      try {
        setLoading(true);

        const [sectionsRes, menuRes] = await Promise.all([
          api.get("/ecom/home-sections"),
          api.get("/ecom/menu"),
        ]);

        const sectionData = Array.isArray(sectionsRes.data?.data)
          ? sectionsRes.data.data
          : [];
        const categories = Array.isArray(menuRes.data)
          ? menuRes.data.map((item, index) => ({
              id: index + 1,
              name: item.label,
              slug: item.key,
            }))
          : [];

        setSections(sectionData);
        setMenuCategories(categories);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setSections([]);
        setMenuCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadHome();
  }, []);

  const displaySections = useMemo(() => {
    if (!sections.length) return [];

    const nonEmpty = sections.filter(
      (section) => Array.isArray(section.products) && section.products.length > 0,
    );
    if (!nonEmpty.length) return [];

    const deals = nonEmpty.filter((section) =>
      DEAL_SECTION_SLUGS.includes((section.slug || "").toLowerCase()),
    );

    return deals.length ? deals : nonEmpty;
  }, [sections]);

  const topCategories = useMemo(() => menuCategories.slice(0, 6), [menuCategories]);

  if (loading) {
    return <LoadingAnimation onComplete={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-[#f5f1eb] text-[#2c1b20]">
      <main className="mx-auto max-w-[1320px] px-3 sm:px-4 md:px-6 lg:px-8 pb-12 sm:pb-16">
        <AdBanner />

        <motion.section
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-12 sm:mb-16"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#2f1620]">
              Shop by Category
            </h2>
            <p className="text-[#7b6860] mt-2 text-xs sm:text-sm md:text-base">
              Explore our curated collections
            </p>
          </div>

          {!topCategories.length ? (
            <div className="text-center py-8 text-[#857169] text-sm">
              Categories are loading soon.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {topCategories.map((category, index) => {
                const Icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];
                return (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                    whileHover={{ y: -4 }}
                    onClick={() =>
                      router.push(`/products?category=${encodeURIComponent(category.slug)}`)
                    }
                    className="bg-white/75 backdrop-blur border border-[#e8ddd2] rounded-lg sm:rounded-xl px-2 sm:px-3 py-4 sm:py-5 shadow-[0_8px_20px_-16px_rgba(61,21,34,0.7)] hover:border-[#d4c0ac] transition-colors"
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-[#8b1d3d]" />
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-[#3a232a] line-clamp-1">
                      {category.name}
                    </p>
                    <p className="text-[10px] sm:text-xs mt-1 text-[#8f7d73]">4+ styles</p>
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.section>

        {!displaySections.length ? (
          <div className="py-10 text-center text-[#7d6f69] text-sm">
            No section products available right now.
          </div>
        ) : (
          <div className="space-y-12 sm:space-y-16">
            {displaySections.map((section, sectionIndex) => {
              const normalizedSlug = (section.slug || "").toLowerCase();
              const sectionMeta = SECTION_META[normalizedSlug];

              return (
                <React.Fragment key={section.id}>
                  <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  >
                    <div className="flex items-end justify-between mb-4 sm:mb-6 md:mb-8">
                      <div>
                        <p className="text-[10px] sm:text-xs tracking-[0.24em] uppercase text-[#a5917b] mb-1 sm:mb-2">
                          {sectionMeta?.chip || "Signature Edit"}
                        </p>
                        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#2d161f]">
                          {section.name}
                        </h2>
                        <p className="text-[#7f6b63] text-xs sm:text-sm mt-1 sm:mt-2">
                          {sectionMeta?.subtitle || "Handpicked products for you"}
                        </p>
                      </div>

                      <button
                        onClick={() => router.push("/products")}
                        className="hidden md:flex items-center gap-1.5 text-[#8b1d3d] text-sm font-medium hover:underline"
                      >
                        View All
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                      {section.products.map((product, productIndex) => (
                        <motion.div
                          key={`${section.id}-${product.id}`}
                          initial={{ opacity: 0, y: 22 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: productIndex * 0.05,
                            ease: "easeOut",
                          }}
                        >
                          <ProductCard product={product} variant="showcase" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>

                  {sectionIndex === 0 && (
                    <motion.section
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="rounded-xl sm:rounded-2xl px-4 sm:px-6 py-8 sm:py-12 md:py-16 text-center text-white border border-[#9f4658] bg-[linear-gradient(130deg,#6f1d33_0%,#8a2740_45%,#b14561_100%)] shadow-[0_20px_40px_-24px_rgba(93,28,47,0.8)]"
                    >
                      <p className="uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#f5ce8b] text-[10px] sm:text-xs mb-3 sm:mb-4">
                        Limited Time Offer
                      </p>
                      <h3 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-5xl mb-2 sm:mb-3 px-2">
                        Flat 30% Off on Bridal Collection
                      </h3>
                      <p className="text-[#f7d9dc] text-xs sm:text-sm md:text-base mb-5 sm:mb-7 px-2">
                        Celebrate your special day with handpicked bridal sarees.
                        Use code BRIDE30 at checkout.
                      </p>
                      <button
                        onClick={() => router.push("/products")}
                        className="bg-[#edbe5e] hover:bg-[#f4ca73] text-[#4a1b2a] px-5 sm:px-7 py-2.5 sm:py-3 rounded-sm text-xs sm:text-sm font-semibold transition-colors"
                      >
                        Shop Bridal Collection
                      </button>
                    </motion.section>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          {TRUST_POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="text-center px-2 sm:px-3 py-4 sm:py-6 bg-white/70 rounded-lg sm:rounded-xl border border-[#e8ddd2]"
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-[#8b1d3d]" />
                <p className="text-xs sm:text-sm mt-2 sm:mt-3 font-semibold text-[#321a23]">{point.title}</p>
                <p className="text-[10px] sm:text-xs mt-1 text-[#8a756d]">{point.text}</p>
              </div>
            );
          })}
        </motion.section>
      </main>
    </div>
  );
}
