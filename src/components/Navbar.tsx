import React, { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { FSShopMark } from './BrandLogo';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onNavigate: (sectionId: string, preset?: 'budget' | 'gaming' | 'all') => void;
  onShopNow: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onNavigate,
  onShopNow,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (sectionId: string, preset?: 'budget' | 'gaming' | 'all') => {
    setMobileOpen(false);
    onNavigate(sectionId, preset);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('catalog');
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#050914]/95 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('home');
          }}
          className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] rounded-md"
        >
          <FSShopMark className="w-8 h-8 shrink-0" />
          <span className="font-display font-bold text-lg tracking-tight text-white">
            FS SHOP
          </span>
        </a>

        {/* Zone 2: Single-Line Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden xl:flex items-center gap-5 text-[13px] font-medium text-slate-300"
        >
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('home');
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#3B82F6]"
          >
            Home
          </a>
          <a
            href="#catalog"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('catalog', 'all');
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#3B82F6]"
          >
            Laptops
          </a>
          <a
            href="#mouse-collection"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('mouse-collection');
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#3B82F6]"
          >
            Mouse
          </a>
          <a
            href="#keyboard-collection"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('keyboard-collection');
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#3B82F6]"
          >
            Keyboards
          </a>
          <a
            href="#other-accessories"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('other-accessories');
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#3B82F6]"
          >
            Accessories
          </a>
          <a
            href="#brands"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('brands');
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#3B82F6]"
          >
            Brands
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('contact');
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#3B82F6]"
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: Working Search Bar + Primary Shop Now CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search laptops, mouse, keyboards..."
              aria-label="Search products"
              className="w-52 lg:w-60 h-9 pl-9 pr-3 rounded-lg bg-white/8 border border-white/15 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#3B82F6] focus:bg-white/12 transition-colors"
            />
          </form>

          <button
            type="button"
            onClick={onShopNow}
            className="h-9 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold tracking-wide transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
          >
            Shop Now
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="xl:hidden w-10 h-10 inline-flex items-center justify-center rounded-lg border border-white/15 text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="xl:hidden bg-[#0A1328] border-b border-white/10 px-4 py-4 space-y-3 shadow-2xl">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search laptops, mouse, keyboards, bags..."
              aria-label="Search products"
              className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/10 border border-white/15 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#3B82F6]"
            />
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              type="button"
              onClick={() => handleLinkClick('home')}
              className="text-left px-3 py-2.5 rounded-lg text-slate-200 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('catalog', 'all')}
              className="text-left px-3 py-2.5 rounded-lg text-slate-200 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              All Laptops
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('mouse-collection')}
              className="text-left px-3 py-2.5 rounded-lg text-slate-200 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              Mouse Collection
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('keyboard-collection')}
              className="text-left px-3 py-2.5 rounded-lg text-slate-200 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              Keyboard Collection
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('other-accessories')}
              className="text-left px-3 py-2.5 rounded-lg text-slate-200 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              Other Accessories
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('brands')}
              className="text-left px-3 py-2.5 rounded-lg text-slate-200 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              Laptop Brands
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('about')}
              className="text-left px-3 py-2.5 rounded-lg text-slate-200 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('contact')}
              className="text-left px-3 py-2.5 rounded-lg text-slate-200 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
