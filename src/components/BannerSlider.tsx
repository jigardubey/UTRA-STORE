import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface BannerSliderProps {
  onSelectCategory: (catName: string) => void;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({ onSelectCategory }) => {
  const { banners } = useStore();
  const activeBanners = banners.filter((b) => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const current = activeBanners[currentIndex] || activeBanners[0];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#12131F] border border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.15)] group">
      {/* Ambient background glows */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative min-h-[320px] sm:min-h-[400px] md:min-h-[450px] flex items-center">
        {/* Background Image with Dark Vignette & Gradient */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0F] via-[#0B0B0F]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-transparent opacity-80" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-10">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              ✨ LUXURY DROP • EXCLUSIVE
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full text-[11px] font-bold">
              🔥 Limited Time Offer
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 leading-[1.1]">
            <span className="text-gradient-purple">{current.title}</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base mb-8 font-medium max-w-lg leading-relaxed">
            {current.subtitle}
          </p>

          <button
            onClick={() => onSelectCategory(current.linkCategory)}
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white px-7 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:scale-105 group/btn border border-purple-400/30 cursor-pointer"
          >
            <span>EXPLORE COLLECTION</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* Slider Controls */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)}
              className="absolute left-4 z-20 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white border border-white/10 backdrop-blur-md transition-all hover:scale-110 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)}
              className="absolute right-4 z-20 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white border border-white/10 backdrop-blur-md transition-all hover:scale-110 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-8 bg-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_10px_rgba(139,92,246,0.8)]'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
