import React, { useEffect, useState } from 'react';
import { Laptop as LaptopIcon } from 'lucide-react';
import { Laptop } from '../types/laptop';
import { formatPkr, getDiscountPercent } from '../data/laptops';
import { BrandLogo } from './BrandLogo';

interface ProductCardProps {
  laptop: Laptop;
  onShopNow: (laptop: Laptop) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ laptop, onShopNow }) => {
  const [imgError, setImgError] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const discount = getDiscountPercent(laptop.pricePkr, laptop.originalPricePkr);

  useEffect(() => {
    setImgError(false);
  }, [laptop.image]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 5, ry: x * 6 });
  };

  const resetTilt = () => setTilt({ rx: 0, ry: 0 });

  return (
    <article
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      className="group perspective-stage h-full"
    >
      <div
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        }}
        className="preserve-3d h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_20px_45px_rgba(10,19,40,0.12)] group-hover:border-[#2563EB]/40"
      >
        {/* Product Image Container (4:3) */}
        <div
          onClick={() => onShopNow(laptop)}
          className="relative aspect-[4/3] w-full bg-[#0A1328] overflow-hidden cursor-pointer"
        >
          {imgError ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0A1328] to-[#1E3A8A] text-slate-200 p-6 text-center gap-2">
              <LaptopIcon className="w-10 h-10 text-[#60A5FA]" />
              <span className="font-display font-semibold text-sm">{laptop.model}</span>
            </div>
          ) : (
            <img
              src={laptop.image}
              alt={`${laptop.brand} ${laptop.model}`}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            {/* Brand Logo + Quiet Availability Text */}
            <div className="flex items-center justify-between gap-2">
              <BrandLogo brand={laptop.brand} tone="dark" />
              {discount ? (
                <span className="text-xs font-semibold text-[#2563EB] font-mono tabular-nums whitespace-nowrap">
                  Save {discount}%
                </span>
              ) : null}
            </div>

            {/* Model Title */}
            <div>
              <h3
                onClick={() => onShopNow(laptop)}
                className="font-display font-semibold text-base text-[#090D16] group-hover:text-[#2563EB] transition-colors cursor-pointer leading-snug"
              >
                {laptop.model}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{laptop.availability}</p>
            </div>

            {/* Key Hardware Specifications */}
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="min-w-0">
                <dt className="text-slate-400">Processor</dt>
                <dd className="font-medium text-slate-800 truncate" title={laptop.specs.processor}>
                  {laptop.specs.processor}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-slate-400">RAM</dt>
                <dd className="font-medium text-slate-800 truncate" title={laptop.specs.ram}>
                  {laptop.specs.ram}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-slate-400">Storage</dt>
                <dd className="font-medium text-slate-800 truncate" title={laptop.specs.storage}>
                  {laptop.specs.storage}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-slate-400">Display</dt>
                <dd className="font-medium text-slate-800 truncate" title={laptop.specs.display}>
                  {laptop.specs.display}
                </dd>
              </div>
              <div className="col-span-2 min-w-0">
                <dt className="text-slate-400">Graphics</dt>
                <dd className="font-medium text-slate-800 truncate" title={laptop.specs.graphics}>
                  {laptop.specs.graphics}
                </dd>
              </div>
            </dl>
          </div>

          {/* Price & SHOP NOW Button */}
          <div className="pt-3 border-t border-slate-100 flex items-end justify-between gap-3">
            <div>
              {laptop.originalPricePkr && laptop.originalPricePkr > laptop.pricePkr && (
                <div className="text-xs text-slate-400 line-through font-mono tabular-nums">
                  {formatPkr(laptop.originalPricePkr)}
                </div>
              )}
              <div className="text-lg font-bold text-[#090D16] font-mono tabular-nums">
                {formatPkr(laptop.pricePkr)}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onShopNow(laptop)}
              className="px-4 py-2.5 rounded-lg bg-[#0A1328] hover:bg-[#2563EB] text-white text-xs font-semibold tracking-wide transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              SHOP NOW
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
