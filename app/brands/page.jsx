"use client";

import React, { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Reference-style dummy brands + logo images (local SVGs)
const DUMMY_BRANDS = [
  { name: "Cadbury", logo: "/brand-logos/cadbury.svg" },
  { name: "Ching's", logo: "/brand-logos/chings.svg" },
  { name: "Cofresh", logo: "/brand-logos/cofresh.svg" },
  { name: "Chennai Cuisine", logo: "/brand-logos/chennai-cuisine.svg" },
  { name: "Daawat", logo: "/brand-logos/daawat.svg" },
  { name: "Dabur", logo: "/brand-logos/dabur.svg" },
  { name: "Dairy Valley", logo: "/brand-logos/dairy-valley.svg" },
  { name: "Dettol", logo: "/brand-logos/dettol.svg" },
];

function getBrandName(b) {
  return String(b?.name || b?.brand_name || b?.title || "").trim();
}

function getBrandLogo(b) {
  return (
    b?.logo ||
    b?.logo_url ||
    b?.image ||
    b?.image_url ||
    b?.brand_logo ||
    b?.brand_image ||
    ""
  );
}

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLetter, setActiveLetter] = useState("A");
  const fallbackImg = "/Fudco.avif";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get("/ecom/list-brand");
        const list = res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
        setBrands(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error(e);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const normalized = useMemo(() => {
    // Prefer API, but fall back to reference dummy list
    const source = brands.length ? brands : DUMMY_BRANDS;
    return source
      .map((b, idx) => {
        const name = getBrandName(b) || String(b?.name || "").trim() || `Brand ${idx + 1}`;
        const logo = getBrandLogo(b) || b?.logo || b?.logo_url || "";
        const letter = name[0]?.toUpperCase() || "#";
        return { ...b, __name: name, __logo: logo, __letter: letter };
      })
      .filter((b) => /[A-Z]/.test(b.__letter))
      .sort((a, b) => a.__name.localeCompare(b.__name));
  }, [brands]);

  const lettersWithBrands = useMemo(() => {
    return new Set(normalized.map((b) => b.__letter));
  }, [normalized]);

  const filtered = useMemo(() => {
    return normalized.filter((b) => b.__letter === activeLetter);
  }, [normalized, activeLetter]);

  useEffect(() => {
    if (lettersWithBrands.size > 0 && !lettersWithBrands.has(activeLetter)) {
      const first = ALPHABET.find((l) => lettersWithBrands.has(l));
      if (first) setActiveLetter(first);
    }
  }, [lettersWithBrands, activeLetter]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Shop All Brands
        </h1>

        {/* Alphabet bar (circular chips like reference) */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {ALPHABET.map((l) => {
            const enabled = lettersWithBrands.has(l);
            const active = l === activeLetter;
            return (
              <button
                key={l}
                type="button"
                onClick={() => enabled && setActiveLetter(l)}
                disabled={!enabled}
                className={[
                  "h-9 w-9 rounded-full text-sm font-semibold transition-colors",
                  active
                    ? "bg-[#0B4B30] text-white"
                    : enabled
                      ? "bg-[#F3F4F6] text-gray-800 hover:bg-[#E5E7EB]"
                      : "bg-[#F9FAFB] text-gray-300 cursor-not-allowed",
                ].join(" ")}
                aria-label={`Show brands starting with ${l}`}
              >
                {l}
              </button>
            );
          })}
        </div>

        {/* Active letter */}
        <div className="mt-8">
          <p className="text-lg font-bold uppercase text-[#0B4B30]">{activeLetter}</p>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="py-12 text-center text-sm text-gray-500">Loading brands…</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">
              No brands found for {activeLetter}.
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-x-16 gap-y-12">
              {filtered.map((b) => (
                <div
                  key={b.id ?? b.__name}
                  className="flex h-16 w-[180px] items-center justify-center"
                >
                    <img
                      src={b.__logo || fallbackImg}
                      alt={b.__name}
                      className="max-h-16 max-w-[180px] w-auto object-contain"
                      loading="lazy"
                      onError={(e) => {
                        if (e?.currentTarget?.src?.includes(fallbackImg)) return;
                        e.currentTarget.src = fallbackImg;
                      }}
                    />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

