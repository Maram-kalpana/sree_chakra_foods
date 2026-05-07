 "use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import api from "@/lib/api";

export default function Footer() {
  const [menuCategories, setMenuCategories] = useState([]);

  useEffect(() => {
    let alive = true;
    const loadMenu = async () => {
      try {
        const res = await api.get("/ecom/menu");
        const data = Array.isArray(res.data) ? res.data : [];
        if (!alive) return;
        setMenuCategories(
          data
            .map((item, idx) => ({
              id: idx + 1,
              name: item?.label,
              slug: item?.key,
            }))
            .filter((c) => c.name && c.slug),
        );
      } catch {
        // Keep footer resilient if API is down.
        if (!alive) return;
        setMenuCategories([]);
      }
    };
    loadMenu();
    return () => {
      alive = false;
    };
  }, []);

  const DESIRED_FOOTER_CATEGORIES = [
    { id: 1, name: "Fresh & Frozen", slug: "fresh-frozen" },
    { id: 2, name: "Cupboard", slug: "cupboard" },
    { id: 3, name: "Ingredients", slug: "ingredients" },
    { id: 4, name: "Health & Beauty", slug: "health-beauty" },
    { id: 5, name: "Pooja", slug: "pooja" },
  ];

  const footerCategories = DESIRED_FOOTER_CATEGORIES.map((d) => {
    const fromApi = menuCategories.find(
      (c) => String(c?.slug || "").toLowerCase() === String(d.slug).toLowerCase(),
    );
    return fromApi ? { ...fromApi, name: d.name } : d;
  });

  return (
    <footer className="bg-[#e6f4d7] text-gray-800 border-t border-[#cfe7b9]">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        {/* Mobile: Brand -> (Help + Categories side-by-side) -> Newsletter. Desktop: 4 columns. */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <div className="leading-tight">
              <Link href="/" aria-label="Home" className="inline-flex items-center">
                <img
                  src="/sreelogo.jpeg"
                  alt="Sree Chakra Foods"
                  className="h-20 w-auto max-w-[300px] object-contain mix-blend-multiply sm:h-28 sm:max-w-[460px]"
                />
              </Link>
            </div>

            <div className="mt-4 text-sm text-gray-700 space-y-1">
              <p>50 John Shelton Drive, 
              Coventry CV6 4PE</p>
              {/* <p>Hyderabad, Telangana</p> */}
              <p className="underline underline-offset-2 break-words">sreechakrafoods@gmail.com</p>
              <p className="underline underline-offset-2">+044 7438 900369</p>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 sm:justify-start">
              <a href="#" aria-label="Facebook" className="text-gray-700 hover:text-gray-900">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-700 hover:text-gray-900">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="YouTube" className="text-gray-700 hover:text-gray-900">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" aria-label="WhatsApp" className="text-gray-700 hover:text-gray-900">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Help + Categories (side-by-side on mobile) */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-2">
            {/* Help & Support */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Help &amp; Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/about-us" className="hover:text-gray-900">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className="hover:text-gray-900">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-gray-900">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-policy" className="hover:text-gray-900">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap" className="hover:text-gray-900">
                    Sitemap
                  </Link>
                </li>
              </ul>

              <div className="mt-5 text-sm text-gray-600">
                <p>
                  Info: <span className="text-gray-900 font-medium">herbalandco@gmail.com</span>
                </p>
                <p className="mt-1">
                  Phone: <span className="text-gray-900 font-medium">8919105591</span>
                </p>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/products" className="hover:text-gray-900">
                    Shop All
                  </Link>
                </li>
                {footerCategories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/products?category=${encodeURIComponent(c.slug)}`}
                      className="hover:text-gray-900"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Join Newsletter</h4>
            <p className="text-sm text-gray-700">
              Join our community to get exclusive offers and updates.
            </p>

            <form
              className="mt-4 flex items-center overflow-hidden rounded-md border border-[#cfe7b9] bg-white"
              onSubmit={(e) => e.preventDefault()}
            >
              <input className="h-11 w-full bg-white px-3 text-sm outline-none" placeholder="Your email" />
              <button
                type="submit"
                className="h-11 px-4 text-sm font-semibold text-black bg-[#99ca20] hover:bg-[#88b71c]"
              >
                →
              </button>
            </form>

            <div className="mt-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Payment methods accepted
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-600">
                <span className="rounded border border-gray-200 px-2 py-1">Visa</span>
                <span className="rounded border border-gray-200 px-2 py-1">Mastercard</span>
                <span className="rounded border border-gray-200 px-2 py-1">RuPay</span>
                <span className="rounded border border-gray-200 px-2 py-1">UPI</span>
                <span className="rounded border border-gray-200 px-2 py-1">NetBanking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#cfe7b9]">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-4 text-xs sm:text-sm text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Sree Chakra Foods. All rights reserved.</p>
          <p className="text-gray-600">
            Developed &amp; Maintained by <span className="text-gray-700 font-medium">Heights</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
