import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ChevronDown, Laptop as LaptopIcon } from 'lucide-react';
import { HERO_IMAGE, formatPkr } from '../data/laptops';
import { AccessoryProduct, Laptop } from '../types/laptop';

interface HeroSectionProps {
  featuredLaptops: Laptop[];
  featuredMouse?: AccessoryProduct;
  featuredKeyboard?: AccessoryProduct;
  onShopNow: () => void;
  onExploreLaptops: () => void;
  onSelectLaptop: (laptop: Laptop) => void;
  onSelectAccessory: (accessory: AccessoryProduct) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredLaptops,
  featuredMouse,
  featuredKeyboard,
  onShopNow,
  onExploreLaptops,
  onSelectLaptop,
  onSelectAccessory,
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [heroImgError, setHeroImgError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: -y * 9,
      rotateY: x * 12,
    });
  };

  const resetTilt = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const primarySpotlight = featuredLaptops[0];

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#040812] via-[#081229] to-[#0A1736] text-white min-h-[88vh] flex items-center"
    >
      {/* Animated Ambient Electric Blue Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[520px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.28)_0%,_rgba(10,23,54,0.08)_55%,_transparent_75%)] blur-2xl animate-gradient-drift"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Typography & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <p className="text-xs font-medium tracking-wider text-[#60A5FA] uppercase">
              Pakistan Tech Store · Laptops & Peripherals
            </p>

            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] tracking-tight text-white [text-wrap:balance]">
              FS SHOP – Your World of Technology
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Discover Powerful Laptops, Precision Mice, Mechanical Keyboards, and Essential
              Computer Accessories at the Best PKR Prices in Pakistan.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onShopNow}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm tracking-wide shadow-[0_10px_30px_rgba(37,99,235,0.35)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onExploreLaptops}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white/8 hover:bg-white/14 border border-white/20 text-white font-semibold text-sm tracking-wide transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <span>EXPLORE HARDWARE</span>
                <ChevronDown className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Clean Typographic Metadata Strip */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-300">
              <span>10 Laptop Brands</span>
              <span aria-hidden="true" className="text-slate-600">
                /
              </span>
              <span>Mouse & Keyboards</span>
              <span aria-hidden="true" className="text-slate-600">
                /
              </span>
              <span>Pro Accessories</span>
            </div>
          </motion.div>

          {/* Right 3D Floating Laptop, Mouse & Keyboard Stage */}
          <motion.div
            style={{ y: parallaxY, opacity: parallaxOpacity }}
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            className="lg:col-span-7 perspective-stage"
          >
            <div
              className="preserve-3d transition-transform duration-200 ease-out relative"
              style={{
                transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
              }}
            >
              {/* Main 3D Floating Laptops Hero Visual */}
              <div className="relative rounded-2xl overflow-hidden border border-white/12 bg-[#060C1C] shadow-[0_32px_90px_rgba(0,0,0,0.65)] animate-float-slow">
                <div className="aspect-[16/9] w-full relative overflow-hidden">
                  {heroImgError ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0A1328] to-[#172554] text-slate-300 gap-3">
                      <LaptopIcon className="w-16 h-16 text-[#60A5FA]" />
                      <span className="font-display text-lg font-semibold">
                        FS SHOP Flagship Hardware Collection
                      </span>
                    </div>
                  ) : (
                    <img
                      src={HERO_IMAGE}
                      alt="Three flagship aluminum laptops floating in 3D studio lighting at FS SHOP"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#050914]/90 via-transparent to-transparent"
                  />
                </div>

                {/* Bottom Interactive 3D Floating Hardware Strip: Laptop + Mouse + Keyboard */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 border-t border-white/10">
                  {primarySpotlight && (
                    <button
                      type="button"
                      onClick={() => onSelectLaptop(primarySpotlight)}
                      className="bg-[#081024]/95 hover:bg-[#0E1A38] p-3.5 flex items-center gap-3 text-left transition-colors cursor-pointer group"
                    >
                      <img
                        src={primarySpotlight.image}
                        alt={primarySpotlight.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-11 rounded-lg object-cover shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] text-[#60A5FA] font-medium truncate">
                          Laptop · {primarySpotlight.brand}
                        </div>
                        <div className="text-xs font-semibold text-white truncate">
                          {primarySpotlight.model}
                        </div>
                        <div className="text-[11px] font-mono tabular-nums text-slate-300">
                          {formatPkr(primarySpotlight.pricePkr)}
                        </div>
                      </div>
                    </button>
                  )}

                  {featuredMouse && (
                    <button
                      type="button"
                      onClick={() => onSelectAccessory(featuredMouse)}
                      className="bg-[#081024]/95 hover:bg-[#0E1A38] p-3.5 flex items-center gap-3 text-left transition-colors cursor-pointer group"
                    >
                      <img
                        src={featuredMouse.image}
                        alt={featuredMouse.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-11 rounded-lg object-cover shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] text-[#60A5FA] font-medium truncate">
                          {featuredMouse.subType}
                        </div>
                        <div className="text-xs font-semibold text-white truncate">
                          {featuredMouse.name}
                        </div>
                        <div className="text-[11px] font-mono tabular-nums text-slate-300">
                          {formatPkr(featuredMouse.pricePkr)}
                        </div>
                      </div>
                    </button>
                  )}

                  {featuredKeyboard && (
                    <button
                      type="button"
                      onClick={() => onSelectAccessory(featuredKeyboard)}
                      className="bg-[#081024]/95 hover:bg-[#0E1A38] p-3.5 flex items-center gap-3 text-left transition-colors cursor-pointer group"
                    >
                      <img
                        src={featuredKeyboard.image}
                        alt={featuredKeyboard.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-11 rounded-lg object-cover shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] text-[#60A5FA] font-medium truncate">
                          {featuredKeyboard.subType}
                        </div>
                        <div className="text-xs font-semibold text-white truncate">
                          {featuredKeyboard.name}
                        </div>
                        <div className="text-[11px] font-mono tabular-nums text-slate-300">
                          {formatPkr(featuredKeyboard.pricePkr)}
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Studio Reflection Floor Glow */}
              <div
                aria-hidden="true"
                className="mx-auto mt-4 h-4 w-4/5 rounded-full bg-[#2563EB]/25 blur-xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
