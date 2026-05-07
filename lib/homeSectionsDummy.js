/**
 * Food-focused placeholders: Unsplash stills + Mixkit royalty-free preview clips.
 * Mixkit licence: https://mixkit.co/license (free use).
 */

export function foodImg(photoId, w = 800) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${w}&q=85`;
}

const MIXKIT = {
  vegTable:
    "https://assets.mixkit.co/videos/preview/mixkit-fresh-vegetables-on-a-wooden-table-42913-large.mp4",
  salad:
    "https://assets.mixkit.co/videos/preview/mixkit-woman-preparing-a-healthy-salad-42986-large.mp4",
  washVeg:
    "https://assets.mixkit.co/videos/preview/mixkit-hands-washing-fresh-vegetables-4859-large.mp4",
  chopSalad:
    "https://assets.mixkit.co/videos/preview/mixkit-cutting-cucumber-for-a-fresh-salad-4917-large.mp4",
  fruitTable:
    "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-fresh-fruit-on-a-table-42588-large.mp4",
};

const HALDIRAM_IMAGES = [
  // Use only known-good IDs (avoid 404s that cause broken thumbnails)
  foodImg("photo-1585937421612-70a008356fbe", 720),
  foodImg("photo-1567620905732-2d1ec7ab7445", 720),
  foodImg("photo-1540189549338-e584ebbf8d32", 720),
  foodImg("photo-1504674900514-0fad2f9582af", 720),
  foodImg("photo-1517248135467-4c7edcad34c4", 720),
  foodImg("photo-1555939594-58d7cb561ad1", 720),
  foodImg("photo-1569718212165-3a8278d5f624", 720),
  foodImg("photo-1563379926898-05f4575a45d8", 720),
];

const PRODUCE_IMAGES = [
  foodImg("photo-1592419044703-397b4518e8b4", 720),
  foodImg("photo-1540420773420-3366772f4999", 720),
  foodImg("photo-1605028035886-922c30bfffe3", 720),
  foodImg("photo-1615485290382-441e4d0493d9", 720),
  foodImg("photo-1592841200221-a6898f307baa", 720),
  foodImg("photo-1432139509612-69a53d301b7c", 720),
  foodImg("photo-1598170845058-32b9d6a5da37", 720),
  foodImg("photo-1518977676601-b53f82aba655", 720),
];

/** One image per catalogue row — matched to spice / pantry items. */
const INGREDIENT_ROW_IMAGES = [
  foodImg("photo-1589985270744-068a9c8dcb6f", 720),
  foodImg("photo-1589308078059-be1415eab4c3", 720),
  foodImg("photo-1615486595882-7bffeada31ce", 720),
  foodImg("photo-1596040033229-a2821d6f9ab0", 720),
  foodImg("photo-1615485290382-441e4d0493d9", 720),
  foodImg("photo-1474979266404-7eaacbcd87c5", 720),
  foodImg("photo-1570197788417-ce7fdda6f9d4", 720),
  foodImg("photo-1590842997691-0676e6d781b6", 720),
];

const WEEKLY_OFFER_FALLBACK_IMAGES = [
  foodImg("photo-1576045057995-568f588f82fb", 720),
  foodImg("photo-1563565375-f3fdfdbefa83", 720),
  foodImg("photo-1604329760661-e71dc79f8f26", 720),
  foodImg("photo-1610832958506-aa56368176cf", 720),
  foodImg("photo-1623428188875-afc11e0745a4", 720),
  foodImg("photo-1585647344472-ce93fceb62e7", 720),
  foodImg("photo-1534939561126-855b8675edf7", 720),
  foodImg("photo-1606923823739-cc7d9b561b00", 720),
];

const SMART_CART_FALLBACK_IMAGES = [
  foodImg("photo-1585937421612-70a008356fbe", 720),
  foodImg("photo-1567620905732-2d1ec7ab7445", 720),
  foodImg("photo-1540189549338-e584ebbf8d32", 720),
  foodImg("photo-1504674900514-0fad2f9582af", 720),
  foodImg("photo-1517248135467-4c7edcad34c4", 720),
  foodImg("photo-1555939594-58d7cb561ad1", 720),
  foodImg("photo-1569718212165-3a8278d5f624", 720),
  foodImg("photo-1563379926898-05f4575a45d8", 720),
];

/** Shop-by-brands shelf-style product shots (substitute logos). */
export const SHOP_BY_BRANDS_IMAGES = [
  "/Fudco.avif",
  "/Fudco.avif",
  "/Fudco.avif",
  "/Fudco.avif",
  "/Fudco.avif",
  "/Fudco.avif",
];

export function buildWeeklyOffersFallbackProducts() {
  const rows = [
    // Match reference ordering (5 visible items)
    {
      name: "Spinach Bunch",
      unit: "1 Bunch",
      sale: 45,
      mrp: 52,
      img: WEEKLY_OFFER_FALLBACK_IMAGES[0],
    },
    {
      name: "Red Pepper",
      unit: "2Pcs (Approx 500g)",
      sale: 120,
      mrp: 139,
      img: WEEKLY_OFFER_FALLBACK_IMAGES[1],
    },
    {
      name: "Jaimin Mix Chikki",
      unit: "200g",
      sale: 89,
      mrp: 99,
      img: WEEKLY_OFFER_FALLBACK_IMAGES[2],
    },
    {
      name: "TRS Slabs Tamarind",
      unit: "200g",
      sale: 79,
      mrp: 89,
      img: WEEKLY_OFFER_FALLBACK_IMAGES[3],
    },
    {
      name: "KTC Lemon Dre",
      unit: "400ml",
      sale: 59,
      mrp: 69,
      img: WEEKLY_OFFER_FALLBACK_IMAGES[4],
    },
  ];
  return rows.map((r, i) => {
    const hasOff = r.mrp > r.sale;
    return {
      id: `weekly-fallback-${i}`,
      name: r.name,
      images: [
        { image_url: r.img },
      ],
      min_variant_price: String(r.sale),
      variant_combinations: [
        {
          id: i + 1,
          quantity: 10,
          extra_price: String(r.mrp),
          name: r.unit,
          discount: hasOff ? Math.round(((r.mrp - r.sale) / r.mrp) * 100) : 0,
        },
      ],
    };
  });
}

export function buildSmartCartFallbackProducts() {
  const rows = [
    { name: "Rajma & Jeera Combo", unit: "500g + 200g", sale: 185, mrp: 209 },
    { name: "Pasta Sauce Kit", unit: "2 jars", sale: 220, mrp: 259 },
    { name: "Breakfast Cereal Duo", unit: "2 x 400g", sale: 310, mrp: 348 },
    { name: "South Indian Meals Box", unit: "Serve 2", sale: 175, mrp: 198 },
    { name: "Nutty Snack Pack", unit: "400g", sale: 149, mrp: 169 },
    { name: "Ghee Rice Combo", unit: "Mini pack", sale: 199, mrp: 229 },
    { name: "Dal Makhani Ingredients", unit: "Set", sale: 165, mrp: 189 },
    { name: "Fresh Salad Bowl Kit", unit: "~600g", sale: 135, mrp: 156 },
  ];
  return rows.map((r, i) => {
    const hasOff = r.mrp > r.sale;
    return {
      id: `smartcart-fallback-${i}`,
      name: r.name,
      images: [{ image_url: SMART_CART_FALLBACK_IMAGES[i % SMART_CART_FALLBACK_IMAGES.length] }],
      min_variant_price: String(r.sale),
      variant_combinations: [
        {
          id: i + 901,
          quantity: 10,
          extra_price: String(r.mrp),
          name: r.unit,
          discount: hasOff ? Math.round(((r.mrp - r.sale) / r.mrp) * 100) : 0,
        },
      ],
    };
  });
}

export function buildHaldiramDummyProducts() {
  const snacks = [
    { name: "Haldirams Aloo Bhujia 200g", g: "200g", price: 129 },
    { name: "Haldirams Moong Dal 200g", g: "200g", price: 145 },
    { name: "Haldirams Namkeen Mix 350g", g: "350g", price: 189 },
    { name: "Haldirams Bhujia Sev 150g", g: "150g", price: 99 },
    { name: "Haldirams Chips Classic 180g", g: "180g", price: 119 },
    { name: "Haldirams Minute Khatta Meetha 300g", g: "300g", price: 165 },
    { name: "Haldirams Soan Papdi 500g", g: "500g", price: 249 },
    { name: "Haldirams Karachi Halwa 250g", g: "250g", price: 199 },
  ];
  return snacks.map((s, i) => ({
    id: `haldirams-dummy-${i}`,
    name: s.name,
    images: [{ image_url: HALDIRAM_IMAGES[i % HALDIRAM_IMAGES.length] }],
    min_variant_price: String(s.price),
    variant_combinations: [
      { id: i + 1, quantity: 10, extra_price: String(s.price), name: s.g },
    ],
    ui_low_stock: i === 5,
  }));
}

export function buildProduceIndiaItems() {
  const rows = [
    { name: "Okra", qty: "350g", price: 525, rating: 5.0, low: false },
    { name: "Tindora", qty: "400g", price: 480, rating: null, low: false },
    { name: "Raw Mango", qty: "Approx 400g / 4pcs", price: 550, rating: 2.5, low: false },
    { name: "Desi Ginger (Strong)", qty: "350g", price: 499, rating: 4.7, low: true },
    { name: "Bangalore Brinjal", qty: "500g", price: 389, rating: null, low: false },
    { name: "Amla", qty: "6–7 pcs (Approx 350g)", price: 600, rating: null, low: true },
    { name: "Cluster Beans", qty: "250g", price: 420, rating: 4.2, low: false },
    { name: "Drumsticks", qty: "3 pcs", price: 360, rating: null, low: false },
  ];
  return rows.map((r, i) => ({
    id: `produce-${i}`,
    ...r,
    image: PRODUCE_IMAGES[i % PRODUCE_IMAGES.length],
    categoryLabel: "Produce of India",
  }));
}

export function buildIngredientsItems() {
  const rows = [
    { name: "Tate Lyle Caster Sugar", qty: "1Kg", price: 288, rating: null, low: false, super: false },
    { name: "Suhana Peri Peri Masala", qty: "100g", price: 188, rating: null, low: false, super: false },
    { name: "Premium Dhana Bharvo", qty: "300g", price: 275, rating: null, low: false, super: false },
    { name: "Kashmiri Mild Chilli Powder", qty: "700g", price: 1374, rating: 5.0, low: false, super: true },
    { name: "Coarse Black Pepper", qty: "100g", price: 313, rating: null, low: false, super: false },
    { name: "TRS Black Salt", qty: "100g", price: 124, rating: null, low: true, super: false },
    { name: "Turmeric Powder", qty: "400g", price: 199, rating: 4.5, low: false, super: false },
    { name: "Garam Masala Blend", qty: "200g", price: 245, rating: null, low: false, super: false },
  ];
  return rows.map((r, i) => ({
    id: `ingredient-${i}`,
    ...r,
    image: INGREDIENT_ROW_IMAGES[i % INGREDIENT_ROW_IMAGES.length],
    superSaver: r.super,
  }));
}

/**
 * Homepage produce carousel — videos are **self-hosted** under `/public/videos` so they play
 * reliably (hotlinking Mixkit from the app domain often returns 403, so only posters showed).
 * WebM first for quality/bandwidth; MP4 fallback for Safari / older browsers. Posters from Unsplash.
 * `cooking-sumanak.webm`: Wikimedia Commons (CC BY-SA) 360p VP9 transcode.
 * `greens-loop.webm` / `salad-loop.mp4`: MDN CC0 sample assets (looping motion for dummy slots).
 */
const PRODUCE_CLIP_COOKING = {
  sources: [
    { src: "/videos/cooking-sumanak.webm", type: "video/webm" },
    { src: "/videos/salad-loop.mp4", type: "video/mp4" },
  ],
};

const PRODUCE_CLIP_GREENS = {
  sources: [
    { src: "/videos/greens-loop.webm", type: "video/webm" },
    { src: "/videos/salad-loop.mp4", type: "video/mp4" },
  ],
};

export const FRESH_FRUITS_VIDEO_CLIPS = [
  {
    id: "v1",
    label: "Traditional cooking",
    ...PRODUCE_CLIP_COOKING,
    poster: foodImg("photo-1540420773420-3366772f4999", 900),
    thumb: foodImg("photo-1540420773420-3366772f4999", 200),
  },
  {
    id: "v2",
    label: "Fresh salad bowl",
    ...PRODUCE_CLIP_GREENS,
    poster: foodImg("photo-1512621776951-a57141f2eefd", 900),
    thumb: foodImg("photo-1512621776951-a57141f2eefd", 200),
  },
  {
    id: "v3",
    label: "Regional recipe",
    ...PRODUCE_CLIP_COOKING,
    poster: foodImg("photo-1592419044703-397b4518e8b4", 900),
    thumb: foodImg("photo-1592419044703-397b4518e8b4", 200),
  },
  {
    id: "v4",
    label: "Garden greens",
    ...PRODUCE_CLIP_GREENS,
    poster: foodImg("photo-1592841200221-a6898f307baa", 900),
    thumb: foodImg("photo-1592841200221-a6898f307baa", 200),
  },
  {
    id: "v5",
    label: "Market fruit & veg",
    ...PRODUCE_CLIP_COOKING,
    poster: foodImg("photo-1541344998636-f31a6fd0ecf4", 900),
    thumb: foodImg("photo-1541344998636-f31a6fd0ecf4", 200),
  },
  {
    id: "v6",
    label: "Kitchen prep",
    ...PRODUCE_CLIP_GREENS,
    poster: foodImg("photo-1518977676601-b53f82aba655", 900),
    thumb: foodImg("photo-1518977676601-b53f82aba655", 200),
  },
];

/** Homepage PDP spotlight (matches reference layout). */
export const HOME_PRODUCT_SPOTLIGHT = {
  id: "spotlight-groundnut-oil-5l",
  variationId: "var-groundnut-5l",
  name: "Pure Groundnut Oil",
  unitLabel: "5L",
  description:
    "Light, neutral flavour — ideal for everyday cooking, sautéing and deep frying. Packed in food-grade PET for freshness with a sturdy carry handle for easy pours. Naturally cholesterol-free source of fats when used as part of a balanced diet.",
  price: 1999,
  mrp: 2313,
  image: foodImg("photo-1609501676725-7186f7346c8b", 960),
  stock: 25,
};

