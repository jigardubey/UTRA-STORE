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
      className="group bg-white rounded-xl border border-slate-200 p-3.5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md cursor-pointer relative overflow-hidden"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-50 mb-3 border border-slate-100">
        <img
          src={product.images[imageIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onMouseEnter={() => {
            if (product.images.length > 1) setImageIndex(1);
          }}
          onMouseLeave={() => setImageIndex(0)}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-rose-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-slate-900 text-white font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
              FEATURED
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all shadow-xs cursor-pointer ${
            isWishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white border border-slate-200'
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-x-0 bottom-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2 bg-slate-900/90 text-white text-xs font-bold rounded-lg backdrop-blur-sm hover:bg-slate-900 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" /> Quick View
          </button>
        </div>
      </div>

      {/* Content Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">{product.brand}</span>
            <span className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)} ({product.reviewsCount})
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="pt-2.5 border-t border-slate-100 mt-2.5 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900">
                {settings.currency}{product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {settings.currency}{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">
                Only {product.stock} left in stock!
              </span>
            )}
            {product.stock === 0 && (
              <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">Out of Stock</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer ${
              product.stock === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : added
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
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
