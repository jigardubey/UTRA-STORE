import React from 'react';
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

interface WishlistViewProps {
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({ onBack, onSelectProduct }) => {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const { settings } = useStore();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-fade-in">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </button>

        <h1 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> Saved Wishlist ({wishlist.length})
        </h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <Heart className="w-12 h-12 text-rose-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 text-base mb-1">Your wishlist is empty</h3>
          <p className="text-gray-500 text-xs mb-6">Explore products and tap the heart icon to save items for later!</p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  onClick={() => onSelectProduct(product)}
                  className="w-full aspect-square rounded-xl object-cover bg-gray-50 mb-3 cursor-pointer"
                />
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{product.brand}</span>
                <h3
                  onClick={() => onSelectProduct(product)}
                  className="font-bold text-gray-900 text-xs line-clamp-1 cursor-pointer hover:text-indigo-600"
                >
                  {product.name}
                </h3>
                <p className="font-black text-gray-900 text-sm mt-1">
                  {settings.currency}{product.price.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-3">
                <button
                  onClick={() => addToCart(product, 1)}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-rose-100"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
