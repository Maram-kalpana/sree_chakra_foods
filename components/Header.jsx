"use client";

import React, { useEffect, useState } from "react";
import { Search, User, ShoppingCart, ChevronDown, Heart, Menu, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

import Cart from "./Cart";
import LoginModal from "./LoginModal";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeDesktopMenu, setActiveDesktopMenu] = useState(null);
  const logoSrc = "/sreelogo.jpeg";

  const { getTotalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  /* ================= FETCH CATEGORIES ================= */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/ecom/menu");

        console.log("Menu API", res.data);

        const normalized = (res.data ?? []).map((c, index) => ({
          id: index + 1, // fake id for React keys
          name: c.label, // UI expects name
          slug: c.key, // used in URL
        }));

        setCategories(normalized);
      } catch (err) {
        console.error("Category load failed", err);
      }
    };

    loadCategories();
  }, []);

  /* ================= HANDLERS ================= */

  const handleCategoryClick = (slug) => {
    setShowCategoryMenu(false);
    setShowMobileSidebar(false);
    router.push(slug ? `/products?category=${slug}` : "/products");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowMobileSidebar(false);
    router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogoClick = () => {
    setSearchQuery("");
    router.push("/");
  };

  const handleNavigate = (path) => {
    setShowMobileSidebar(false);
    router.push(path);
  };

  const resolveTopNavSlug = (key) => {
    const q = String(key || "").toLowerCase();
    const match = categories.find((c) => {
      const name = String(c?.name || "").toLowerCase();
      const slug = String(c?.slug || "").toLowerCase();
      return slug.includes(q) || name.includes(q);
    });

    if (match?.slug) return match.slug;
    // Fallback slugs (keep integration intact: still uses `?category=` param)
    if (q === "fresh-frozen") return "fresh-frozen";
    if (q === "cupboard") return "cupboard";
    if (q === "ingredients") return "ingredients";
    if (q === "health-beauty") return "health-beauty";
    if (q === "pooja") return "pooja";
    return null;
  };

  const TOP_CATEGORIES = [
    { key: "fresh-frozen", label: "Fresh & Frozen" },
    { key: "cupboard", label: "Cupboard" },
    { key: "ingredients", label: "Ingredients" },
    { key: "health-beauty", label: "Health & Beauty" },
    { key: "pooja", label: "Pooja" },
  ];

  const topCategorySlugs = TOP_CATEGORIES.map((c) => c.key);
  const filteredTopCategories = (categories || []).filter((c) =>
    topCategorySlugs.includes(String(c?.slug || "").toLowerCase()),
  );
  const topCategoriesForSelect = filteredTopCategories.length
    ? filteredTopCategories
    : TOP_CATEGORIES.map((c, idx) => ({ id: idx + 1, slug: c.key, name: c.label }));

  const DESKTOP_MENU = [
    { key: "fresh-frozen", label: "Fresh & Frozen", hasDropdown: true },
    { key: "cupboard", label: "Cupboard", hasDropdown: true },
    { key: "ingredients", label: "Ingredients", hasDropdown: true },
    { key: "health-beauty", label: "Health & Beauty", hasDropdown: true },
    { key: "pooja", label: "Pooja", hasDropdown: true },
    // { key: "shop-by-brand", label: "Shop By Brand", hasDropdown: false, href: "/brands" },
    { key: "about", label: "About", hasDropdown: false, href: "/about-us" },
  ];

  /* ================= UI ================= */

  // Header palette (match latest reference screenshot)
  const accentGreen = "#99ca20";
  const announcementBg = "#c8482b";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-300">
        {/* ANNOUNCEMENT BAR */}
        <div className="text-white" style={{ backgroundColor: announcementBg }}>
          <div className="mx-auto max-w-[1320px] px-4 sm:px-5 md:px-8 lg:px-10 py-2 text-center text-xs sm:text-sm font-semibold tracking-tight leading-snug">
            <span className="font-semibold">Free Delivery</span> on orders above{" "}
            <span className="font-semibold">£999</span> across India
          </div>
        </div>

        {/* MAIN HEADER ROW */}
        <div className="bg-white text-gray-900">
          <div className="mx-auto max-w-[1320px] px-2 sm:px-2 md:px-8 lg:px-10 py-1 sm:py-1">
            <div className="grid grid-cols-[auto,minmax(0,1fr),auto] items-center gap-2 sm:gap-6 overflow-x-hidden">

              {/* LOGO */}
              <button
                onClick={handleLogoClick}
                className="flex shrink-0 items-center"
                aria-label="Go to homepage"
              >
                <img
                  src={logoSrc}
                  alt="Sree Chakra Foods"
                  className="h-12 w-auto max-w-[160px] shrink-0 object-contain sm:h-[72px] md:h-20 lg:h-24"
                />
              </button>

              {/* SEARCH */}
              <form
                onSubmit={handleSearch}
                className="relative w-full min-w-0"
              >
                <div className="flex h-11 items-center overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm sm:h-12">
                  <select
                    value={activeCategory || ""}
                    onChange={(e) => handleCategoryClick(e.target.value || null)}
                    className="h-full bg-white px-2 text-sm text-gray-800 outline-none min-w-[4.25rem] border-r border-gray-200 sm:px-3 sm:min-w-[5.25rem]"
                    aria-label="Category"
                  >
                    <option value="">All</option>
                    {topCategoriesForSelect.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Product type"
                    className="h-full min-w-0 flex-1 bg-white px-2 text-sm text-gray-900 outline-none placeholder:text-gray-500 sm:px-4 sm:pr-3"
                  />

                  <button
                    type="submit"
                    className="inline-flex h-full w-10 shrink-0 items-center justify-center text-gray-600 hover:bg-gray-50 sm:w-12"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* RIGHT ACTIONS */}
              <div className="flex flex-shrink-0 items-center justify-end gap-1.5 sm:gap-3">
                <button
                  onClick={() => router.push("/contact-us")}
                  className="hidden items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 lg:inline-flex"
                >
                  Contact Us
                </button>

                {/* PROFILE */}
                <div className="relative">
                  <button
                    onClick={() =>
                      isAuthenticated
                        ? setShowProfileMenu(!showProfileMenu)
                        : setShowLogin(true)
                    }
                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
                    aria-label="Account"
                  >
                    <User className="h-6 w-6" />
                    <span className="sr-only">{isAuthenticated ? "Account" : "Log in"}</span>
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="font-semibold text-sm text-gray-900">{user?.phone}</p>
                      </div>

                      <button
                        onClick={() => {
                          router.push("/account");
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 text-gray-800"
                      >
                        <Heart className="inline w-4 h-4 mr-2" />
                        My Account
                      </button>

                      <button
                        onClick={logout}
                        className="w-full px-4 py-2.5 text-sm text-left text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                {/* CART */}
                <button
                  onClick={() => setShowCart(true)}
                  className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span className="sr-only">Cart</span>
                  {getTotalItems() > 0 && (
                    <span
                      className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-semibold sm:h-[18px] sm:w-[18px]"
                      style={{ color: accentGreen }}
                    >
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECONDARY NAV — white bar / reference spacing */}
        <nav className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-5 md:px-8 lg:px-10">
            <div className="flex items-center justify-between gap-6 py-3">
              <div className="flex min-w-0 flex-1 items-center gap-x-6 gap-y-2 overflow-x-auto">
                {DESKTOP_MENU.map((item) => (
                  <div
                    key={item.key}
                    className="relative"
                    onMouseEnter={() => item.hasDropdown && setActiveDesktopMenu(item.key)}
                    onMouseLeave={() => item.hasDropdown && setActiveDesktopMenu(null)}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (item.hasDropdown) {
                          const slug = resolveTopNavSlug(item.key);
                          router.push(slug ? `/products?category=${encodeURIComponent(slug)}` : "/products");
                          setActiveDesktopMenu(null);
                          return;
                        }
                        if (item.href) router.push(item.href);
                      }}
                      className="inline-flex items-center gap-1 whitespace-nowrap py-2 text-sm font-medium text-gray-900 hover:text-black"
                    >
                      {item.label}
                      {item.hasDropdown && <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>

                    {item.hasDropdown && activeDesktopMenu === item.key && (
                      <div className="absolute left-0 top-full mt-1 w-[320px] bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {item.label}
                          </p>
                        </div>
                        <div className="max-h-[360px] overflow-y-auto py-2">
                          {(categories.length ? categories : []).slice(0, 18).map((c) => (
                            <button
                              key={`${item.key}-${c.id}`}
                              type="button"
                              onClick={() => handleCategoryClick(c.slug)}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                                activeCategory === c.slug ? "font-semibold text-[#99ca20]" : "text-gray-700"
                              }`}
                            >
                              {c.name}
                            </button>
                          ))}

                          {!categories.length && (
                            <div className="px-4 py-3 text-sm text-gray-500">Loading…</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="inline-flex shrink-0 items-center rounded-lg border px-3 py-2 text-sm font-semibold transition-colors"
                style={{
                  borderColor: accentGreen,
                  color: "#c8482b",
                  backgroundColor: "white",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3fad7")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
              >
                In Season Now!
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* MOBILE SIDEBAR */}
      {showMobileSidebar && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setShowMobileSidebar(false)}
          />
          <div className="fixed left-0 top-0 h-full w-[280px] bg-white z-50 shadow-xl lg:hidden overflow-y-auto">
            {/* Sidebar Header */}
            <div className="p-4 text-white flex items-center justify-between" style={{ backgroundColor: brandGreen }}>
              <div className="flex items-center gap-3">
                <img
                  src={logoSrc}
                  alt="Sree Chakra Foods"
                  className="h-16 w-auto object-contain sm:h-[72px]"
                />
                <span className="font-semibold text-sm">Menu</span>
              </div>
              <button 
                onClick={() => setShowMobileSidebar(false)}
                className="p-1 hover:bg-white/10 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Section */}
            <div className="p-4 border-b bg-gray-50">
              {isAuthenticated ? (
                <div>
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="font-semibold text-sm mt-1">{user?.phone}</p>
                  <button
                    onClick={() => handleNavigate("/account")}
                    className="mt-3 w-full bg-[#8B1D3D] text-white py-2 rounded-lg text-sm font-medium"
                  >
                    My Account
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowMobileSidebar(false);
                    setShowLogin(true);
                  }}
                  className="w-full bg-[#8B1D3D] text-white py-2 rounded-lg text-sm font-medium"
                >
                  Login / Sign Up
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <button
                onClick={() => handleCategoryClick(null)}
                className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm ${
                  !activeCategory
                    ? "bg-[#F7E9ED] text-[#8B1D3D] font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                All Products
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategoryClick(c.slug)}
                  className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm ${
                    activeCategory === c.slug
                      ? "bg-[#F7E9ED] text-[#8B1D3D] font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Quick Links */}
            <div className="p-4 border-t">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Quick Links
              </h3>
              <button
                onClick={() => handleNavigate("/contact-us")}
                className="block w-full text-left py-2.5 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Contact Us
              </button>
              <button
                onClick={() => handleNavigate("/bath-powder-story")}
                className="block w-full text-left py-2.5 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Bath Powder Story
              </button>
              <button
                onClick={() => handleNavigate("/success-story")}
                className="block w-full text-left py-2.5 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Success Story
              </button>
            </div>

            {/* Logout */}
            {isAuthenticated && (
              <div className="p-4 border-t">
                <button
                  onClick={() => {
                    logout();
                    setShowMobileSidebar(false);
                  }}
                  className="w-full text-left py-2.5 px-3 rounded-lg text-sm text-red-600 hover:bg-red-50 font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* CATEGORY MODAL */}
      {showCategoryMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">All Categories</h3>
              <button 
                onClick={() => setShowCategoryMenu(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategoryClick(c.slug)}
                  className="text-left p-3 text-sm hover:bg-[#F7E9ED] rounded-lg transition-colors"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Cart isOpen={showCart} onClose={() => setShowCart(false)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
