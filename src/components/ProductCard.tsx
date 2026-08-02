import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onSelectProduct,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { settings } = useStore();
  const [added, setAdded] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const isWishlisted = isInWishlist(product.id);

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group bg-[#131422]/75 backdrop-blur-md rounded-[22px] border border-white/10 p-3.5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-500/50 hover:shadow-[0_15px_35px_rgba(139,92,246,0.25)] cursor-pointer relative overflow-hidden"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950/80 mb-3.5 border border-white/5">
        <img
          src={product.images[imageIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          onMouseEnter={() => {
            if (product.images.length > 1) setImageIndex(1);
          }}
          onMouseLeave={() => setImageIndex(0)}
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-rose-500/90 backdrop-blur-md text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(244,63,94,0.5)] border border-rose-400/30">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 backdrop-blur-md text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(139,92,246,0.5)] border border-purple-400/30">
              FEATURED
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-xl transition-all shadow-md cursor-pointer ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.8)]'
              : 'bg-slate-950/60 text-slate-300 hover:text-rose-400 hover:bg-slate-900 border border-white/10'
          }`}
          title="Add to Wishlist"
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-x-0 bottom-2.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2 bg-slate-950/90 text-white text-xs font-bold rounded-xl backdrop-blur-md hover:bg-purple-600 border border-white/15 flex items-center justify-center gap-1.5 shadow-lg cursor-pointer transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" /> Quick View
          </button>
        </div>
      </div>

      {/* Content Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
            <span className="font-bold text-cyan-400 uppercase tracking-widest text-[10px]">{product.brand}</span>
            <span className="flex items-center gap-1 text-amber-400 font-extrabold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              <Star className="w-3 h-3 fill-amber-400" />
              {product.rating.toFixed(1)} ({product.reviewsCount})
            </span>
          </div>

          <h3 className="font-bold text-slate-100 text-sm line-clamp-2 mb-1 group-hover:text-purple-300 transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="pt-2.5 border-t border-white/10 mt-3 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-white tracking-tight">
                {settings.currency}{product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-slate-500 line-through">
                  {settings.currency}{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-[10px] text-amber-400 font-bold block mt-0.5">
                ⚡ Only {product.stock} left in stock!
              </span>
            )}
            {product.stock === 0 && (
              <span className="text-[10px] text-rose-400 font-bold block mt-0.5">Out of Stock</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
              product.stock === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                : added
                ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] border border-purple-400/30'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
