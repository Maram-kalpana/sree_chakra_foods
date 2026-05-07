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
import HeroCarousel from "@/components/HeroCarousel";
import CategoryGrid from "@/components/CategoryGrid";
import ProductSection from "@/components/ProductSection";
import Banner from "@/components/Banner";
import ProductCard from "@/components/ProductCard";
// import BrandStrip from "@/components/BrandStrip";
import HomeSectionCarousel from "@/components/HomeSectionCarousel";
import FreshFruitsVideoCarousel from "@/components/FreshFruitsVideoCarousel";
import FeaturedProductCarousel from "@/components/FeaturedProductCarousel";
import HomeProductSpotlight from "@/components/HomeProductSpotlight";
import api from "@/lib/api";
import {
  buildHaldiramDummyProducts,
  buildProduceIndiaItems,
  buildIngredientsItems,
  buildWeeklyOffersFallbackProducts,
  buildSmartCartFallbackProducts,
} from "@/lib/homeSectionsDummy";

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
    text: "On orders above £999",
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

  const weeklyOffersProducts = useMemo(() => {
    return displaySections?.[0]?.products || [];
  }, [displaySections]);

  const smartCartProducts = useMemo(() => {
    return displaySections?.[1]?.products || [];
  }, [displaySections]);

  const haldiramsProducts = useMemo(() => buildHaldiramDummyProducts(), []);
  const produceIndiaItems = useMemo(() => buildProduceIndiaItems(), []);
  const ingredientsItems = useMemo(() => buildIngredientsItems(), []);
  const weeklyOffersFallback = useMemo(() => buildWeeklyOffersFallbackProducts(), []);
  const smartCartFallback = useMemo(() => buildSmartCartFallbackProducts(), []);

  if (loading) {
    return <LoadingAnimation onComplete={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Full width hero banner */}
      <section className="w-full border-b border-gray-200 bg-white">
        <img
          src="/Mango_Desktop.png"
          alt="Fresh Mangoes"
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </section>

      {/* 3-image banner (keep this) */}
      <HeroCarousel />

      <main className="mx-auto max-w-[1320px] px-4 pb-12 pt-2 sm:px-5 md:px-8 lg:px-10 sm:pb-16">
        <CategoryGrid
          title="Shop by Categories"
          categories={topCategories}
          onSelect={(c) =>
            router.push(c?.slug ? `/products?category=${encodeURIComponent(c.slug)}` : "/products")
          }
          onViewAll={() => router.push("/products")}
        />

        <HomeSectionCarousel
          title="Weekly Offers"
          viewAllText="View all"
          leftPromoImage="/gayatri/weekly-offers.svg"
          products={weeklyOffersProducts}
          fallbackProducts={weeklyOffersFallback}
          onViewAll={() => router.push("/products")}
          spacedCards
          carouselNavVariant="weekly"
        />

        {/* <BrandStrip onViewAll={() => router.push("/products")} /> */}

        <HomeSectionCarousel
          title="Smart Cart Savings"
          viewAllText="View all"
          products={smartCartProducts}
          fallbackProducts={smartCartFallback}
          onViewAll={() => router.push("/products")}
          showLeftBanner={false}
          spacedCards
          carouselNavVariant="inline"
        />

        <FreshFruitsVideoCarousel />

        <HomeSectionCarousel
          title="Haldirams Offers"
          viewAllText="View all"
          products={haldiramsProducts}
          onViewAll={() => router.push("/products")}
          showLeftBanner={false}
          spacedCards
          carouselNavVariant="inline"
        />

        <FeaturedProductCarousel
          title="Produce Of India"
          items={produceIndiaItems}
          onViewAll={() => router.push("/products")}
          stripLayout
        />

        <FeaturedProductCarousel
          title="Ingredients To Inspire"
          items={ingredientsItems}
          onViewAll={() => router.push("/products")}
          stripLayout
        />

        {/*
          Spotlight section (disabled for now).
        */}
        {false && <HomeProductSpotlight />}

        {displaySections.length > 0 ? (
          <div className="mt-10 sm:mt-12">
            <Banner src="/gayatri/banner-2.svg" alt="Promotional banner" />
          </div>
        ) : null}

        {/*
          Extra dynamic home sections (disabled for now).
          This block also showed: "No section products available right now."
        */}
        {false && (
          <section className="mt-10 sm:mt-12">
            {!displaySections.length ? (
              <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-10 text-center text-sm text-gray-600">
                No section products available right now.
              </div>
            ) : (
              <div className="space-y-10 sm:space-y-12">
                {displaySections.slice(2).map((section, sectionIndex) => {
                  const normalizedSlug = (section.slug || "").toLowerCase();
                  const sectionMeta = SECTION_META[normalizedSlug];

                  return (
                    <React.Fragment key={section.id}>
                      <motion.section
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                      >
                        <ProductSection
                          title={sectionMeta?.chip || section.name || "Weekly Offers"}
                          products={section.products}
                        />
                      </motion.section>

                      {sectionIndex === 0 && (
                        <motion.section
                          initial={{ opacity: 0, y: 14 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.35 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="rounded-md border border-gray-200 bg-white px-5 sm:px-6 py-6 sm:py-8 shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                              <p className="text-xs text-gray-500">In season now</p>
                              <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 mt-1">
                                Weekly offers refreshed every Monday
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Grab your favourites before they sell out.
                              </p>
                            </div>
                            <button
                              onClick={() => router.push("/products")}
                              className="inline-flex items-center justify-center rounded-md bg-[#99ca20] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#88b71c] transition-colors"
                            >
                              Shop offers
                            </button>
                          </div>
                        </motion.section>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-10 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          {TRUST_POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="rounded-md border border-gray-200 bg-white px-3 sm:px-4 py-4 sm:py-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gray-900" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{point.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{point.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.section>
      </main>
    </div>
  );
}
