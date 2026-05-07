"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function EnhancedSidebar({ selectedCategory, onFiltersChange }) {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTypeKeys, setSelectedTypeKeys] = useState([]);

  const [price, setPrice] = useState({
    min: 0,
    max: 3000,
  });

  const [sortBy, setSortBy] = useState("popularity");

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const load = async () => {
      const [catRes, brandRes] = await Promise.all([
        api.get("/ecom/menu"), // ✅ correct API
        api.get("/ecom/list-brand"),
      ]);

      // ✅ NORMALIZE CATEGORY RESPONSE
      const normalizedCategories = (catRes.data ?? []).map((c, index) => ({
        id: index + 1, // fake id (UI only)
        name: c.label, // label → name
        slug: c.key, // key → slug
      }));

      setCategories(normalizedCategories);
      setBrands(brandRes.data?.data ?? []);
    };

    load();
  }, []);

  const MAIN_CATEGORIES = [
    { key: "fresh-frozen", label: "Fresh & Frozen", fallbackSlug: "fresh-frozen" },
    { key: "cupboard", label: "Cupboard", fallbackSlug: "cupboard" },
    { key: "ingredients", label: "Ingredients", fallbackSlug: "ingredients" },
    { key: "health-beauty", label: "Health & Beauty", fallbackSlug: "health-beauty" },
    { key: "pooja", label: "Pooja", fallbackSlug: "pooja" },
  ];

  const resolveCategorySlug = (keyOrLabel) => {
    const q = String(keyOrLabel || "").toLowerCase();
    const match = categories.find((c) => {
      const name = String(c?.name || "").toLowerCase();
      const slug = String(c?.slug || "").toLowerCase();
      return name.includes(q) || slug.includes(q);
    });
    return match?.slug || MAIN_CATEGORIES.find((o) => o.key === keyOrLabel)?.fallbackSlug || q;
  };

  const activeMainKey = (() => {
    const s = String(selectedCategory || "").toLowerCase();
    if (!s) return null;
    if (s.includes("cup")) return "cupboard";
    if (s.includes("ingre")) return "ingredients";
    if (s.includes("pooja") || s.includes("relig")) return "pooja";
    if (s.includes("health") || s.includes("beauty")) return "health-beauty";
    if (s.includes("fresh") || s.includes("frozen")) return "fresh-frozen";
    return null;
  })();

  const TYPE_GROUPS = {
    "fresh-frozen": [
      { key: "dairy", label: "Dairy", count: 8 },
      { key: "frozen", label: "Frozen", count: 132 },
      { key: "fruits", label: "Fruits", count: 33 },
      { key: "vegetables", label: "Vegetables", count: 84 },
    ],
    cupboard: [
      { key: "biscuits-bakery", label: "Biscuits & Bakery", count: 125 },
      { key: "canned-tins", label: "Canned Tins", count: 22 },
      { key: "drinks", label: "Drinks", count: 58 },
      { key: "hot-beverages", label: "Hot Beverages", count: 84 },
      { key: "indian-snacks", label: "Indian Snacks", count: 399 },
      { key: "mukhwas", label: "Mukhwas", count: 115 },
      { key: "noodles-pasta", label: "Noodles & Pasta", count: 28 },
    ],
    ingredients: [
      { key: "dals-beans", label: "Dals & Beans", count: 102 },
      { key: "dry-fruits-nuts", label: "Dry Fruits & Nuts", count: 92 },
      { key: "flours", label: "Flours", count: 122 },
      { key: "ghee-oils", label: "Ghee & Oils", count: 45 },
      { key: "ground-spices", label: "Ground Spices", count: 187 },
      { key: "jaggery-salt-sugar", label: "Jaggery, Salt & Sugar", count: 39 },
      { key: "rice", label: "Rice", count: 81 },
    ],
    "health-beauty": [{ key: "health-beauty", label: "Health & Beauty", count: 155 }],
    pooja: [{ key: "religious-items", label: "Religious Items", count: 44 }],
  };

  const typeOptions = TYPE_GROUPS[activeMainKey] || [];

  /* ================= HANDLERS ================= */

  const toggleBrand = (id) => {
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const applyFilters = () => {
    if (onFiltersChange) {
      onFiltersChange({
        brands: selectedBrands,
        price_min: price.min,
        price_max: price.max,
        sortBy,
        type_keys: selectedTypeKeys,
      });
    }
  };

  // Auto-apply when filters change (so "Type" updates immediately).
  const filtersPayload = useMemo(
    () => ({
      brands: selectedBrands,
      price_min: price.min,
      price_max: price.max,
      sortBy,
      type_keys: selectedTypeKeys,
    }),
    [price.max, price.min, selectedBrands, selectedTypeKeys, sortBy],
  );

  useEffect(() => {
    onFiltersChange?.(filtersPayload);
  }, [filtersPayload, onFiltersChange]);

  // When category changes, clear type selections (types are category-specific).
  useEffect(() => {
    setSelectedTypeKeys([]);
  }, [activeMainKey]);

  /* ================= UI ================= */

  return (
    <aside className="w-full lg:w-[280px] border border-gray-200 rounded-lg bg-white overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Filter</h2>
          <button
            onClick={() => {
              setSelectedBrands([]);
              setSelectedTypeKeys([]);
              setPrice({ min: 0, max: 3000 });
              setSortBy("popularity");
              onFiltersChange?.({});
            }}
            className="text-xs font-medium text-gray-600 hover:text-gray-900"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
      {/* ================= CATEGORY ================= */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Categories
        </h3>

        <button
          onClick={() => router.push("/products")}
          className={`block w-full text-left py-2 text-sm rounded-md px-2 ${
            !selectedCategory
              ? "bg-gray-100 text-gray-900 font-semibold"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          All
        </button>

        {MAIN_CATEGORIES.map((c) => {
          const slug = resolveCategorySlug(c.key);
          const active = String(selectedCategory || "") === String(slug || "");
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => router.push(slug ? `/products?category=${encodeURIComponent(slug)}` : "/products")}
              className={`block w-full text-left py-2 text-sm rounded-md px-2 ${
                active ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* ================= TYPE (sub-filters) ================= */}
      {typeOptions.length > 0 ? (
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Type
            </h3>
          </div>

          <div className="space-y-2">
            {typeOptions.map((t) => {
              const checked = selectedTypeKeys.includes(t.key);
              return (
                <label key={t.key} className="flex items-center justify-between gap-3 text-sm cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setSelectedTypeKeys((prev) =>
                          prev.includes(t.key) ? prev.filter((x) => x !== t.key) : [...prev, t.key],
                        );
                      }}
                      className="accent-gray-900 w-4 h-4"
                    />
                    <span className="text-gray-700">{t.label}</span>
                  </span>
                  <span className="text-xs tabular-nums text-gray-500">({t.count})</span>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* ================= PRICE ================= */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Price
        </h3>

        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={price.min}
            min={0}
            onChange={(e) =>
              setPrice({
                ...price,
                min: Number(e.target.value),
              })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
            placeholder="Min"
          />
          <span className="text-gray-500">—</span>
          <input
            type="number"
            value={price.max}
            min={price.min}
            onChange={(e) =>
              setPrice({
                ...price,
                max: Number(e.target.value),
              })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
            placeholder="Max"
          />
        </div>

        <div className="text-xs text-gray-500 mt-1">
          £{price.min} – £{price.max}
        </div>
      </div>

      {/* ================= BRAND ================= */}
      {brands.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Brand
          </h3>

          <div className="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto">
            {brands.map((b) => (
              <label
                key={b.id}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(b.id)}
                  onChange={() => toggleBrand(b.id)}
                  className="accent-gray-900 w-4 h-4"
                />
                <span className="text-gray-700">{b.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ================= SORT ================= */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Sort
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
        >
          <option value="popularity">Popularity</option>
          <option value="price_low_high">Price: Low → High</option>
          <option value="price_high_low">Price: High → Low</option>
        </select>
      </div>

      {/* ================= APPLY ================= */}
      <button
        onClick={applyFilters}
        className="w-full rounded-md bg-gray-900 text-white py-2.5 text-sm font-semibold hover:bg-black transition-colors"
      >
        Apply Filters
      </button>
      </div>
    </aside>
  );
}
