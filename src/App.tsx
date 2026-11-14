import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  Check,
  Headphones,
  Keyboard,
  Layers,
  MapPin,
  MessageCircle,
  Mouse,
  Package,
  Phone,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Tag,
  UserCheck,
  Zap,
} from 'lucide-react';
import {
  BRANDS,
  INITIAL_LAPTOPS,
  PRICE_CATEGORIES,
  SPECIAL_COLLECTIONS,
  STORE_INFO,
  buildWhatsAppOrderUrl,
  formatPkr,
  toOrderableAccessory,
  toOrderableLaptop,
} from './data/laptops';
import {
  KEYBOARD_COLLECTION,
  MOUSE_COLLECTION,
  OTHER_ACCESSORIES,
  ALL_ACCESSORIES,
} from './data/accessories';
import {
  AccessoryProduct,
  BrandName,
  Laptop,
  OrderableProduct,
  PriceTierKey,
  SpecialCollectionKey,
} from './types/laptop';
import { BrandLogo, FSShopMark } from './components/BrandLogo';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { AccessoryCard } from './components/AccessoryCard';
import { ProductModal } from './components/ProductModal';
import { PriceEditorModal } from './components/PriceEditorModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

const STORAGE_KEY_PRICES = 'fs_shop_custom_prices_v1';

function matchesSearch(product: AccessoryProduct, query: string): boolean {
  if (!query) return true;
  const haystack = [
    product.name,
    product.brand,
    product.subType,
    product.category,
    product.description,
    ...product.highlights.map((h) => `${h.label} ${h.value}`),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

const BRAND_SLUG_MAP: Record<string, BrandName> = {
  hp: 'HP',
  dell: 'Dell',
  lenovo: 'Lenovo',
  'apple-macbook': 'Apple MacBook',
  apple: 'Apple MacBook',
  macbook: 'Apple MacBook',
  asus: 'Asus',
  acer: 'Acer',
  msi: 'MSI',
  'microsoft-surface': 'Microsoft Surface',
  surface: 'Microsoft Surface',
  samsung: 'Samsung',
  toshiba: 'Toshiba',
};

const SECTION_ROUTE_MAP: Record<string, string> = {
  home: '/',
  catalog: '/laptops',
  brands: '/brands',
  'price-categories': '/price-categories',
  'mouse-collection': '/mouse-collection',
  'keyboard-collection': '/keyboard-collection',
  'other-accessories': '/accessories',
  about: '/about',
  contact: '/contact',
};

function brandToSlug(brand: BrandName): string {
  return brand.toLowerCase().replace(/\s+/g, '-');
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [customPrices, setCustomPrices] = useState<
    Record<string, { pricePkr: number; originalPricePkr?: number }>
  >(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRICES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const laptops: Laptop[] = useMemo(() => {
    return INITIAL_LAPTOPS.map((item) => {
      const override = customPrices[item.id];
      if (!override) return item;
      return {
        ...item,
        pricePkr: override.pricePkr,
        originalPricePkr: override.originalPricePkr,
      };
    });
  }, [customPrices]);

  const [selectedBrand, setSelectedBrand] = useState<BrandName | 'All'>('All');
  const [selectedPriceTier, setSelectedPriceTier] = useState<PriceTierKey>('all');
  const [selectedCollection, setSelectedCollection] =
    useState<SpecialCollectionKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProduct, setActiveProduct] = useState<OrderableProduct | null>(null);
  const [priceEditorOpen, setPriceEditorOpen] = useState(false);

  const [mouseFilter, setMouseFilter] = useState<string>('All');
  const [keyboardFilter, setKeyboardFilter] = useState<string>('All');
  const [otherAccFilter, setOtherAccFilter] = useState<string>('All');

  useEffect(() => {
    try {
      if (Object.keys(customPrices).length > 0) {
        localStorage.setItem(STORAGE_KEY_PRICES, JSON.stringify(customPrices));
      } else {
        localStorage.removeItem(STORAGE_KEY_PRICES);
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [customPrices]);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const openProduct = useCallback(
    (orderable: OrderableProduct) => {
      setActiveProduct(orderable);
      const targetPath = `/product/${orderable.item.id}`;
      if (location.pathname !== targetPath) {
        navigate(targetPath);
      }
    },
    [location.pathname, navigate]
  );

  const closeProduct = useCallback(() => {
    setActiveProduct(null);
    if (location.pathname.startsWith('/product/')) {
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleNavigate = (
    sectionId: string,
    preset?: 'budget' | 'gaming' | 'all'
  ) => {
    if (preset === 'budget') {
      setSelectedBrand('All');
      setSelectedCollection('all');
      setSelectedPriceTier('budget');
    } else if (preset === 'gaming') {
      setSelectedBrand('All');
      setSelectedPriceTier('all');
      setSelectedCollection('gaming');
    } else if (preset === 'all') {
      setSelectedBrand('All');
      setSelectedPriceTier('all');
      setSelectedCollection('all');
    }
    const routePath = SECTION_ROUTE_MAP[sectionId];
    if (routePath && location.pathname !== routePath) {
      navigate(routePath);
    }
    scrollToSection(sectionId);
  };

  const handleSelectBrand = (brand: BrandName) => {
    setSelectedBrand(brand);
    setSelectedPriceTier('all');
    setSelectedCollection('all');
    const brandPath = `/brands/${brandToSlug(brand)}`;
    if (location.pathname !== brandPath) {
      navigate(brandPath);
    }
    scrollToSection('catalog');
  };

  const handleSelectPriceTier = (tier: PriceTierKey) => {
    setSelectedPriceTier(tier);
    setSelectedBrand('All');
    setSelectedCollection('all');
    if (location.pathname !== '/laptops') {
      navigate('/laptops');
    }
    scrollToSection('catalog');
  };

  const handleResetFilters = () => {
    setSelectedBrand('All');
    setSelectedPriceTier('all');
    setSelectedCollection('all');
    setMouseFilter('All');
    setKeyboardFilter('All');
    setOtherAccFilter('All');
    setSearchQuery('');
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  // Sync direct links and browser refreshes to the matching section, brand, or product modal
  useEffect(() => {
    const path = location.pathname.replace(/\/+$/, '') || '/';

    if (path.startsWith('/product/')) {
      const productId = decodeURIComponent(path.replace('/product/', ''));
      const matchedLaptop = laptops.find((l) => l.id === productId);
      if (matchedLaptop) {
        setActiveProduct(toOrderableLaptop(matchedLaptop));
        return;
      }
      const matchedAccessory = ALL_ACCESSORIES.find((a) => a.id === productId);
      if (matchedAccessory) {
        setActiveProduct(toOrderableAccessory(matchedAccessory));
        return;
      }
      setActiveProduct(null);
      return;
    }

    if (path.startsWith('/brands/')) {
      const slug = decodeURIComponent(path.replace('/brands/', '')).toLowerCase();
      const matchedBrand = BRAND_SLUG_MAP[slug];
      if (matchedBrand) {
        setSelectedBrand(matchedBrand);
        setSelectedPriceTier('all');
        setSelectedCollection('all');
        requestAnimationFrame(() => scrollToSection('catalog'));
      }
      return;
    }

    const pathToSection: Record<string, string> = {
      '/laptops': 'catalog',
      '/brands': 'brands',
      '/price-categories': 'price-categories',
      '/mouse-collection': 'mouse-collection',
      '/mice': 'mouse-collection',
      '/keyboard-collection': 'keyboard-collection',
      '/keyboards': 'keyboard-collection',
      '/other-accessories': 'other-accessories',
      '/accessories': 'other-accessories',
      '/about': 'about',
      '/contact': 'contact',
    };

    const targetSection = pathToSection[path];
    if (targetSection) {
      requestAnimationFrame(() => scrollToSection(targetSection));
    }
  }, [location.pathname, laptops, scrollToSection]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredLaptops = useMemo(() => {
    const activeTierMeta = PRICE_CATEGORIES.find((t) => t.key === selectedPriceTier);

    return laptops.filter((item) => {
      if (selectedBrand !== 'All' && item.brand !== selectedBrand) return false;

      if (activeTierMeta) {
        if (item.pricePkr < activeTierMeta.minPkr) return false;
        if (activeTierMeta.maxPkr !== null && item.pricePkr > activeTierMeta.maxPkr) {
          return false;
        }
      }

      if (
        selectedCollection !== 'all' &&
        !item.collections.includes(selectedCollection)
      ) {
        return false;
      }

      if (normalizedQuery) {
        const haystack = [
          item.brand,
          item.model,
          item.name,
          item.specs.processor,
          item.specs.graphics,
          item.specs.ram,
          item.specs.storage,
          item.description,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }

      return true;
    });
  }, [laptops, selectedBrand, selectedPriceTier, selectedCollection, normalizedQuery]);

  const filteredMice = useMemo(() => {
    return MOUSE_COLLECTION.filter((item) => {
      if (mouseFilter !== 'All' && item.subType !== mouseFilter) return false;
      return matchesSearch(item, normalizedQuery);
    });
  }, [mouseFilter, normalizedQuery]);

  const filteredKeyboards = useMemo(() => {
    return KEYBOARD_COLLECTION.filter((item) => {
      if (keyboardFilter !== 'All' && item.subType !== keyboardFilter) return false;
      return matchesSearch(item, normalizedQuery);
    });
  }, [keyboardFilter, normalizedQuery]);

  const filteredOtherAccessories = useMemo(() => {
    return OTHER_ACCESSORIES.filter((item) => {
      if (otherAccFilter !== 'All' && item.subType !== otherAccFilter) return false;
      return matchesSearch(item, normalizedQuery);
    });
  }, [otherAccFilter, normalizedQuery]);

  const hasActiveFilters =
    selectedBrand !== 'All' ||
    selectedPriceTier !== 'all' ||
    selectedCollection !== 'all' ||
    normalizedQuery.length > 0;

  const storefront = (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#090D16]">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={(val) => setSearchQuery(val)}
        onNavigate={handleNavigate}
        onShopNow={() => handleNavigate('catalog')}
      />

      <main className="flex-1">
        {/* 1. 3D Parallax Hero Section (Laptop, Mouse & Keyboard) */}
        <HeroSection
          featuredLaptops={laptops}
          featuredMouse={MOUSE_COLLECTION[6]}
          featuredKeyboard={KEYBOARD_COLLECTION[2]}
          onShopNow={() => handleNavigate('catalog')}
          onExploreLaptops={() => handleNavigate('brands')}
          onSelectLaptop={(laptop) => openProduct(toOrderableLaptop(laptop))}
          onSelectAccessory={(acc) => openProduct(toOrderableAccessory(acc))}
        />

        {/* 2. Quick Department Jump Strip */}
        <section className="bg-[#0A1328] border-b border-white/10 text-white py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs font-medium text-slate-300">
              Explore FS SHOP Storefront Categories
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => scrollToSection('catalog')}
                className="px-3.5 py-2 rounded-lg bg-white/8 hover:bg-[#2563EB] text-xs font-semibold text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                Laptops ({laptops.length})
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('mouse-collection')}
                className="px-3.5 py-2 rounded-lg bg-white/8 hover:bg-[#2563EB] text-xs font-semibold text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                Mouse Collection ({MOUSE_COLLECTION.length})
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('keyboard-collection')}
                className="px-3.5 py-2 rounded-lg bg-white/8 hover:bg-[#2563EB] text-xs font-semibold text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                Keyboard Collection ({KEYBOARD_COLLECTION.length})
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('other-accessories')}
                className="px-3.5 py-2 rounded-lg bg-white/8 hover:bg-[#2563EB] text-xs font-semibold text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                Other Accessories ({OTHER_ACCESSORIES.length})
              </button>
            </div>
          </div>
        </section>

        {/* 3. Price Categories Overview */}
        <section
          id="price-categories"
          className="bg-white border-b border-slate-200 py-14 sm:py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-semibold text-[#2563EB] tracking-wider uppercase">
                  Shop by Budget
                </p>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#090D16] mt-1">
                  Laptops for Every Price Range
                </h2>
              </div>
              <p className="text-sm text-slate-600 max-w-md">
                Transparent Pakistani Rupee (PKR) pricing from entry-level student machines to
                RTX gaming and MacBook Pro workstations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {PRICE_CATEGORIES.map((tier) => {
                const isSelected = selectedPriceTier === tier.key;
                const count = laptops.filter(
                  (l) =>
                    l.pricePkr >= tier.minPkr &&
                    (tier.maxPkr === null || l.pricePkr <= tier.maxPkr)
                ).length;

                return (
                  <button
                    key={tier.key}
                    type="button"
                    onClick={() => handleSelectPriceTier(tier.key)}
                    className={`text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#0A1328] text-white border-[#2563EB] shadow-lg'
                        : 'bg-[#F8FAFC] hover:bg-white text-[#090D16] border-slate-200 hover:border-[#2563EB]/50 hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-2">
                      <div
                        className={`text-xs font-mono font-semibold tabular-nums ${
                          isSelected ? 'text-[#60A5FA]' : 'text-[#2563EB]'
                        }`}
                      >
                        {tier.rangeLabel}
                      </div>
                      <h3 className="font-display font-bold text-base leading-snug">
                        {tier.label}
                      </h3>
                      <p
                        className={`text-xs leading-relaxed ${
                          isSelected ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {tier.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-current/10 text-xs font-semibold">
                      <span className="font-mono tabular-nums">{count} Models</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. All 10 Laptop Brands Section */}
        <motion.section
          id="brands"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.45 }}
          className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-semibold text-[#2563EB] tracking-wider uppercase">
                  Leading Manufacturers
                </p>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#090D16] mt-1">
                  Explore 10 International Laptop Brands
                </h2>
              </div>
              <p className="text-sm text-slate-600 max-w-md">
                Select any manufacturer below to browse its dedicated lineup and click Shop Now
                for complete specifications.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {BRANDS.map((brand) => {
                const brandLaptops = laptops.filter((l) => l.brand === brand.name);
                const lowestPrice =
                  brandLaptops.length > 0
                    ? Math.min(...brandLaptops.map((l) => l.pricePkr))
                    : 0;
                const isSelected = selectedBrand === brand.name;

                return (
                  <div
                    key={brand.name}
                    className={`group rounded-xl bg-white border overflow-hidden transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-lg'
                        : 'border-slate-200 hover:border-[#2563EB]/50 hover:-translate-y-1 hover:shadow-lg'
                    }`}
                  >
                    <div
                      onClick={() => handleSelectBrand(brand.name)}
                      className="aspect-[4/3] w-full bg-[#0A1328] overflow-hidden cursor-pointer"
                    >
                      <img
                        src={brand.featuredImage}
                        alt={`${brand.name} laptops`}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <div className="space-y-1.5">
                        <BrandLogo brand={brand.name} tone="dark" />
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {brand.tagline}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                          From {formatPkr(lowestPrice)}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (brandLaptops.length === 1) {
                              openProduct(toOrderableLaptop(brandLaptops[0]));
                            } else {
                              handleSelectBrand(brand.name);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#0A1328] hover:bg-[#2563EB] text-white text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          SHOP NOW
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* 5. Full Interactive Laptop Collection */}
        <section id="catalog" className="py-16 sm:py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <p className="text-xs font-semibold text-[#2563EB] tracking-wider uppercase">
                  Department 01 · Computers
                </p>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#090D16] mt-1">
                  Laptop Collection
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono tabular-nums text-slate-500">
                  Showing {filteredLaptops.length} of {laptops.length} laptops
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>
            </div>

            {/* Special Collection Filter Tabs */}
            <div className="space-y-4 mb-10 pb-6 border-b border-slate-200">
              <div className="flex flex-wrap items-center gap-2">
                {SPECIAL_COLLECTIONS.map((col) => {
                  const active = selectedCollection === col.key;
                  return (
                    <button
                      key={col.key}
                      type="button"
                      onClick={() => setSelectedCollection(col.key)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-[#2563EB] text-white shadow-sm'
                          : 'bg-[#F8FAFC] text-slate-700 border border-slate-200 hover:border-[#2563EB]/40 hover:text-[#090D16]'
                      }`}
                    >
                      {col.label}
                    </button>
                  );
                })}
              </div>

              {/* Brand & Price Tier Filter Row */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filter:</span>
                </div>

                <select
                  aria-label="Filter by brand"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value as BrandName | 'All')}
                  className="h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-[#090D16] focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="All">All 10 Brands</option>
                  {BRANDS.map((b) => (
                    <option key={b.name} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Filter by price range"
                  value={selectedPriceTier}
                  onChange={(e) => setSelectedPriceTier(e.target.value as PriceTierKey)}
                  className="h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-[#090D16] focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="all">All Price Ranges</option>
                  {PRICE_CATEGORIES.map((tier) => (
                    <option key={tier.key} value={tier.key}>
                      {tier.label} ({tier.rangeLabel})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Laptop Product Grid */}
            {filteredLaptops.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-12 text-center space-y-4">
                <h3 className="font-display font-bold text-xl text-[#090D16]">
                  No laptops match your current filters
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Try clearing your search query or switching back to all brands and price ranges.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer"
                >
                  Show All Laptops
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredLaptops.map((laptop) => (
                  <ProductCard
                    key={laptop.id}
                    laptop={laptop}
                    onShopNow={(selected) => openProduct(toOrderableLaptop(selected))}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 6. MOUSE COLLECTION SECTION */}
        <motion.section
          id="mouse-collection"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.45 }}
          className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] tracking-wider uppercase">
                  <Mouse className="w-4 h-4" />
                  <span>Department 02 · Precision Pointers</span>
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#090D16] mt-1">
                  Mouse Collection
                </h2>
                <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
                  Wireless, Gaming, Bluetooth, USB, RGB Gaming, HP, Dell, Logitech, and Lenovo mice
                  with unique studio photography and direct PKR pricing.
                </p>
              </div>

              <span className="text-xs font-mono tabular-nums text-slate-500">
                {filteredMice.length} of {MOUSE_COLLECTION.length} models
              </span>
            </div>

            {/* Sub-Type Filter Pills (Interactive Controls) */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {['All', ...MOUSE_COLLECTION.map((m) => m.subType)].map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setMouseFilter(sub)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    mouseFilter === sub
                      ? 'bg-[#0A1328] text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-[#2563EB]/40'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {filteredMice.length === 0 ? (
              <div className="rounded-xl bg-white border border-slate-200 p-8 text-center text-sm text-slate-600">
                No mice match your search query.{' '}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[#2563EB] font-semibold underline cursor-pointer"
                >
                  Reset search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredMice.map((mouse) => (
                  <AccessoryCard
                    key={mouse.id}
                    product={mouse}
                    onShopNow={(selected) => openProduct(toOrderableAccessory(selected))}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.section>

        {/* 7. KEYBOARD COLLECTION SECTION */}
        <motion.section
          id="keyboard-collection"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.45 }}
          className="py-16 sm:py-20 bg-white border-b border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] tracking-wider uppercase">
                  <Keyboard className="w-4 h-4" />
                  <span>Department 03 · Tactile Input</span>
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#090D16] mt-1">
                  Keyboard Collection
                </h2>
                <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
                  Mechanical, Wireless, RGB Gaming, USB, Bluetooth, HP, Dell, Logitech, and Lenovo
                  keyboards engineered for speed, comfort, and durability.
                </p>
              </div>

              <span className="text-xs font-mono tabular-nums text-slate-500">
                {filteredKeyboards.length} of {KEYBOARD_COLLECTION.length} models
              </span>
            </div>

            {/* Sub-Type Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {['All', ...KEYBOARD_COLLECTION.map((k) => k.subType)].map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setKeyboardFilter(sub)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    keyboardFilter === sub
                      ? 'bg-[#0A1328] text-white'
                      : 'bg-[#F8FAFC] text-slate-700 border border-slate-200 hover:border-[#2563EB]/40'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {filteredKeyboards.length === 0 ? (
              <div className="rounded-xl bg-[#F8FAFC] border border-slate-200 p-8 text-center text-sm text-slate-600">
                No keyboards match your search query.{' '}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[#2563EB] font-semibold underline cursor-pointer"
                >
                  Reset search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredKeyboards.map((keyboard) => (
                  <AccessoryCard
                    key={keyboard.id}
                    product={keyboard}
                    onShopNow={(selected) => openProduct(toOrderableAccessory(selected))}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.section>

        {/* 8. OTHER ACCESSORIES SECTION */}
        <motion.section
          id="other-accessories"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.45 }}
          className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] tracking-wider uppercase">
                  <Package className="w-4 h-4" />
                  <span>Department 04 · Workstation Essentials</span>
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#090D16] mt-1">
                  Other Computer Accessories
                </h2>
                <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
                  Laptop Bags, GaN Fast Laptop Chargers, Cooling Pads, Studio Headphones, USB-C
                  Hubs, XL Mouse Pads, and CNC Aluminum Laptop Stands.
                </p>
              </div>

              <span className="text-xs font-mono tabular-nums text-slate-500">
                {filteredOtherAccessories.length} of {OTHER_ACCESSORIES.length} items
              </span>
            </div>

            {/* Sub-Type Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {['All', ...OTHER_ACCESSORIES.map((a) => a.subType)].map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setOtherAccFilter(sub)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    otherAccFilter === sub
                      ? 'bg-[#0A1328] text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-[#2563EB]/40'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {filteredOtherAccessories.length === 0 ? (
              <div className="rounded-xl bg-white border border-slate-200 p-8 text-center text-sm text-slate-600">
                No accessories match your search query.{' '}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[#2563EB] font-semibold underline cursor-pointer"
                >
                  Reset search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredOtherAccessories.map((accessory) => (
                  <AccessoryCard
                    key={accessory.id}
                    product={accessory}
                    onShopNow={(selected) => openProduct(toOrderableAccessory(selected))}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.section>

        {/* 9. About FS SHOP & Why Choose Us (Dark Navy Architectural Band) */}
        <section
          id="about"
          className="bg-gradient-to-b from-[#050914] to-[#0A1328] text-white py-16 sm:py-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <p className="text-xs font-semibold text-[#60A5FA] tracking-wider uppercase">
                  About FS SHOP
                </p>
                <h2 className="font-display font-bold text-3xl sm:text-4xl leading-tight [text-wrap:balance]">
                  Trusted International Laptops & Accessories Delivered Across Pakistan
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  FS SHOP is a modern electronics store owned by{' '}
                  <strong className="text-white font-semibold">Fiza</strong>, serving students,
                  developers, corporate teams, and gamers across Pakistan. From corporate ThinkPads,
                  flagship MacBooks, and RTX gaming rigs to ergonomic mice, mechanical keyboards,
                  bags, chargers, and cooling stands—every product features honest PKR pricing and
                  instant 3-field ordering.
                </p>
                <div className="flex flex-wrap gap-6 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#60A5FA]" />
                    <span>Owner: Fiza</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#60A5FA]" />
                    <span>Location: Pakistan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#60A5FA]" />
                    <span>Direct 3-Field Ordering</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Quality Products',
                    text: 'Carefully inspected laptops, mice, keyboards, and accessories from leading global brands.',
                  },
                  {
                    icon: Tag,
                    title: 'Best Prices',
                    text: 'Competitive PKR pricing across budget, mid-range, business, gaming, and peripheral tiers.',
                  },
                  {
                    icon: Layers,
                    title: 'Complete Tech Ecosystem',
                    text: 'Shop laptops alongside matching Logitech, Razer, HP, Dell, Lenovo, and Anker gear.',
                  },
                  {
                    icon: Zap,
                    title: 'Easy Ordering',
                    text: 'Order in seconds with only your name, delivery address, and phone number—no account signup.',
                  },
                  {
                    icon: Headphones,
                    title: 'Customer Support',
                    text: 'Direct phone and WhatsApp guidance at 03086421306 before and after purchase.',
                  },
                  {
                    icon: Award,
                    title: 'Professional Service',
                    text: 'Transparent specifications, stock verification on order, and reliable nationwide dispatch.',
                  },
                ].map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2.5"
                    >
                      <Icon className="w-5 h-5 text-[#60A5FA]" />
                      <h3 className="font-display font-semibold text-base text-white">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">{feature.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 10. Contact Section */}
        <section id="contact" className="py-16 sm:py-20 bg-[#F8FAFC] border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-sm">
              <div className="lg:col-span-7 space-y-4">
                <p className="text-xs font-semibold text-[#2563EB] tracking-wider uppercase">
                  Direct Store Contact
                </p>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#090D16]">
                  Need Help Choosing a Laptop or Accessory?
                </h2>
                <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                  Reach out directly to <strong className="text-[#090D16]">Fiza</strong> at FS
                  SHOP for real-time stock confirmation, bundle recommendations, or instant WhatsApp
                  ordering anywhere in Pakistan.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-sm">
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <UserCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Store Owner</span>
                    </div>
                    <div className="font-display font-semibold text-[#090D16]">
                      {STORE_INFO.owner}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Phone / WhatsApp</span>
                    </div>
                    <div className="font-mono font-semibold text-[#090D16]">
                      {STORE_INFO.phoneDisplay}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Location</span>
                    </div>
                    <div className="font-display font-semibold text-[#090D16]">
                      {STORE_INFO.location}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
                <a
                  href={STORE_INFO.phoneHref}
                  className="h-12 px-6 rounded-xl bg-[#0A1328] hover:bg-[#16254A] text-white font-semibold text-sm inline-flex items-center justify-center gap-2.5 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#60A5FA]" />
                  <span>Call {STORE_INFO.phoneDisplay}</span>
                </a>

                <a
                  href={buildWhatsAppOrderUrl({})}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm inline-flex items-center justify-center gap-2.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 11. Footer */}
      <footer className="bg-[#050914] text-slate-300 border-t border-white/10 pt-14 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            {/* Store Info */}
            <div className="lg:col-span-4 space-y-4">
              <div className="inline-flex items-center gap-2.5">
                <FSShopMark className="w-8 h-8" />
                <span className="font-display font-bold text-lg text-white">FS SHOP</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                FS SHOP – Your World of Technology. Curated international laptops, precision mice,
                mechanical keyboards, and accessories in Pakistan, owned by Fiza.
              </p>
              <div className="text-xs space-y-1 text-slate-300">
                <div>Owner: {STORE_INFO.owner}</div>
                <div>
                  Phone:{' '}
                  <a href={STORE_INFO.phoneHref} className="font-mono hover:text-white">
                    {STORE_INFO.phoneDisplay}
                  </a>
                </div>
                <div>Location: {STORE_INFO.location}</div>
              </div>
            </div>

            {/* Brand Links */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-display font-semibold text-sm text-white">Laptop Brands</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {BRANDS.map((brand) => (
                  <li key={brand.name}>
                    <button
                      type="button"
                      onClick={() => handleSelectBrand(brand.name)}
                      className="text-slate-400 hover:text-white transition-colors text-left cursor-pointer"
                    >
                      {brand.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product Categories */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-display font-semibold text-sm text-white">
                Store Departments
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('catalog', 'all')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Laptop Collection
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('mouse-collection')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Mouse Collection
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('keyboard-collection')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Keyboard Collection
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('other-accessories')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Bags, Chargers & Accessories
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('catalog', 'budget')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Budget Laptops (PKR 25k–50k)
                  </button>
                </li>
              </ul>
            </div>

            {/* Quick Navigation */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-display font-semibold text-sm text-white">Quick Links</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('home')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('about')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('contact')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setPriceEditorOpen(true)}
                    className="text-[#60A5FA] hover:text-white transition-colors cursor-pointer"
                  >
                    Edit Laptop Prices
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 FS SHOP. All Rights Reserved.</p>
            <p>Pakistan · Owner: Fiza · WhatsApp: 03086421306</p>
          </div>
        </div>
      </footer>

      {/* Unified Product Detail & 3-Field Appwrite Order Modal */}
      <ProductModal product={activeProduct} onClose={closeProduct} />

      {/* Store Owner Editable PKR Price Manager */}
      <PriceEditorModal
        open={priceEditorOpen}
        laptops={laptops}
        onClose={() => setPriceEditorOpen(false)}
        onSavePrices={(updated) => setCustomPrices(updated)}
        onResetPrices={() => setCustomPrices({})}
      />

      {/* Floating WhatsApp Order Button */}
      <FloatingWhatsApp />
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={storefront} />
      <Route path="/laptops" element={storefront} />
      <Route path="/brands" element={storefront} />
      <Route path="/brands/:brandSlug" element={storefront} />
      <Route path="/price-categories" element={storefront} />
      <Route path="/mouse-collection" element={storefront} />
      <Route path="/mice" element={storefront} />
      <Route path="/keyboard-collection" element={storefront} />
      <Route path="/keyboards" element={storefront} />
      <Route path="/other-accessories" element={storefront} />
      <Route path="/accessories" element={storefront} />
      <Route path="/about" element={storefront} />
      <Route path="/contact" element={storefront} />
      <Route path="/product/:productId" element={storefront} />
      <Route path="*" element={storefront} />
    </Routes>
  );
}
