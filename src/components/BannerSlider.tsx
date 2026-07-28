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
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl">
      <div className="relative min-h-[300px] sm:min-h-[380px] md:min-h-[420px] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover opacity-45 transition-all duration-700 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-md">
            🔥 Featured Promotion
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 leading-tight">
            {current.title}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-6 font-medium max-w-lg leading-relaxed">
            {current.subtitle}
          </p>
          <button
            onClick={() => onSelectCategory(current.linkCategory)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg shadow-indigo-500/25 group"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Slider Controls */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)}
              className="absolute left-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)}
              className="absolute right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-6 bg-indigo-500' : 'w-2 bg-white/40'
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
