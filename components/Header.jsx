"use client";

import React, { useEffect, useState } from "react";
import { Search, User, ShoppingCart, ChevronDown, Heart, Menu, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";

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
  const [logo, setLogo] = useState("/logo.webp");

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

  /* ================= FETCH LOGO ================= */

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const res = await api.get("/ecom/app-logo-settings");

        console.log("Logo API", res.data);

        if (res.data?.success && res.data?.data?.app_logo) {
          setLogo(res.data.data.app_logo_url);
        }
      } catch (err) {
        console.error("Logo load failed", err.response?.data || err.message);
      }
    };

    loadLogo();
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

  /* ================= UI ================= */

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        {/* TOP BAR */}
        <div className="bg-[#8B1D3D] text-white py-2 text-center text-xs sm:text-sm px-2">
          🌿 Welcome to Sridevi Herbal & Co – Purely Natural Care 🌿
        </div>

        {/* MAIN HEADER */}
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="lg:hidden p-1 text-gray-600 hover:text-[#8B1D3D]"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* LOGO */}
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
            >
              <img src={logo} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
              <div className="hidden md:block">
                <p className="text-lg lg:text-xl font-bold text-[#8B1D3D]">
                  Sridevi Herbal & Co
                </p>
                <p className="text-xs text-gray-500">Pure Herbal Living</p>
              </div>
            </button>

            {/* SEARCH */}
            <form
              onSubmit={handleSearch}
              className="relative flex-1 max-w-xl mx-2 sm:mx-4"
            >
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#8B1D3D] focus:outline-none"
              />
              <Search className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </form>

            {/* RIGHT MENU */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <a
                href="/about-us"
                className="hidden lg:block text-sm text-gray-600 hover:text-[#8B1D3D]"
              >
                About Us
              </a>

              {/* PROFILE */}
              <div className="relative">
                <button
                  onClick={() =>
                    isAuthenticated
                      ? setShowProfileMenu(!showProfileMenu)
                      : setShowLogin(true)
                  }
                  className="flex items-center gap-1 text-gray-600 p-1"
                >
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 hidden sm:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 sm:w-52 bg-white border rounded shadow-lg z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="font-semibold text-sm">{user?.phone}</p>
                    </div>

                    <button
                      onClick={() => {
                        router.push("/account");
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                    >
                      <Heart className="inline w-4 h-4 mr-2" />
                      My Account
                    </button>

                    <button
                      onClick={logout}
                      className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* CART */}
              <button onClick={() => setShowCart(true)} className="relative p-1">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#8B1D3D] text-white text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full font-medium">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* CATEGORY NAV - Desktop Only */}
        <nav className="hidden lg:block bg-[#F7E9ED] border-t">
          <div className="container mx-auto px-3 sm:px-4 py-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-6">
                {categories.slice(0, 8).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleCategoryClick(c.slug)}
                    className={`text-sm font-medium whitespace-nowrap pb-1 ${
                      activeCategory === c.slug
                        ? "text-[#8B1D3D] border-b-2 border-[#8B1D3D]"
                        : "text-gray-700 hover:text-[#8B1D3D]"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}

                <button
                  onClick={() => setShowCategoryMenu(true)}
                  className="flex items-center gap-1 text-sm whitespace-nowrap"
                >
                  More <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-6 text-sm">
                <button onClick={() => router.push("/bath-powder-story")} className="whitespace-nowrap">
                  Bath Powder Story
                </button>
                <button onClick={() => router.push("/success-story")} className="whitespace-nowrap">
                  Success Story
                </button>
              </div>
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
            <div className="bg-[#8B1D3D] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="w-8 h-8" />
                <span className="font-semibold text-sm">Menu</span>
              </div>
              <button 
                onClick={() => setShowMobileSidebar(false)}
                className="p-1 hover:bg-[#791733] rounded"
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
                onClick={() => handleNavigate("/about-us")}
                className="block w-full text-left py-2.5 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                About Us
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
