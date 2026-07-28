import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, Shield, Truck, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewFullDetails: (product: Product) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onViewFullDetails,
}) => {
  if (!product) return null;

  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { settings } = useStore();
  const [selectedImg, setSelectedImg] = useState(product.images[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 relative overflow-hidden shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Gallery Preview */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 mb-3">
              <img src={selectedImg || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(img)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImg === img ? 'border-indigo-600 scale-95' : 'border-gray-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-1">
              <span className="uppercase tracking-wider text-indigo-600">{product.brand}</span>
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400" /> {product.rating} ({product.reviewsCount} reviews)
              </span>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2 leading-snug">{product.name}</h2>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-black text-gray-900">
                {settings.currency}{product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  {settings.currency}{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-gray-600 text-xs leading-relaxed mb-6 line-clamp-3">{product.description}</p>

            {/* Quantity Selector & Stock Status */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 font-bold text-sm rounded-l-xl"
                >
                  -
                </button>
                <span className="px-4 py-1.5 font-bold text-sm text-gray-900">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 font-bold text-sm rounded-r-xl"
                >
                  +
                </button>
              </div>

              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}
              >
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>

            {/* View Full Product Page Link */}
            <button
              onClick={() => {
                onClose();
                onViewFullDetails(product);
              }}
              className="w-full text-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
            >
              View full specifications & customer reviews →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
