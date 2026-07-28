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
      className="group bg-white rounded-2xl border border-gray-100 p-3 flex flex-col justify-between hover:shadow-xl hover:border-indigo-100 transition-all duration-300 cursor-pointer relative"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50 mb-3">
        <img
          src={product.images[imageIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onMouseEnter={() => {
            if (product.images.length > 1) setImageIndex(1);
          }}
          onMouseLeave={() => setImageIndex(0)}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-rose-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-indigo-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            isWishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 text-gray-600 hover:text-rose-500 hover:bg-white'
          }`}
          title="Add to Wishlist"
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-x-0 bottom-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2 bg-slate-900/90 text-white text-xs font-semibold rounded-lg backdrop-blur-xs hover:bg-slate-900 flex items-center justify-center gap-1.5 shadow-md"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Content details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium mb-1">
            <span>{product.brand}</span>
            <span className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-400" />
              {product.rating.toFixed(1)} ({product.reviewsCount})
            </span>
          </div>

          <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="pt-2 border-t border-gray-50 mt-2 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-gray-900">
                {settings.currency}{product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  {settings.currency}{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-[10px] text-amber-600 font-semibold">
                Only {product.stock} left in stock!
              </span>
            )}
            {product.stock === 0 && (
              <span className="text-[10px] text-rose-600 font-semibold">Out of Stock</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
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
