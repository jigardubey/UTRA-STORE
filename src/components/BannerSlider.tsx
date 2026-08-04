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
    <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-md border border-slate-800 group">
      <div className="relative min-h-[300px] sm:min-h-[360px] md:min-h-[400px] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-xl px-6 sm:px-12 py-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold tracking-wide">
              FEATURED COLLECTION
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 leading-tight">
            {current.title}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base mb-6 font-medium leading-relaxed max-w-md">
            {current.subtitle}
          </p>

          <button
            onClick={() => onSelectCategory(current.linkCategory)}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-xs cursor-pointer group/btn"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-slate-900" />
          </button>
        </div>

        {/* Slider Controls */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)}
              className="absolute left-4 z-20 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white border border-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)}
              className="absolute right-4 z-20 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white border border-slate-700 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-6 bg-white'
                      : 'w-2 bg-white/40 hover:bg-white/70'
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
