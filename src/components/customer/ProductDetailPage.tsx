import React, { useState } from 'react';
import { ArrowLeft, Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Check, MessageSquare, User } from 'lucide-react';
import { Product, Review } from '../../types';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { settings, reviews, addReview } = useStore();
  const { userProfile, currentUser } = useAuth();

  const [selectedImg, setSelectedImg] = useState(product.images[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // New review form states
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await addReview({
      productId: product.id,
      userId: currentUser?.uid || 'guest-user',
      userName: userProfile?.displayName || 'Happy Customer',
      rating: newRating,
      comment: newComment,
    });

    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3.5 py-2 rounded-xl transition-colors shadow-2xs"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Store Catalog
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
            <img src={selectedImg || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImg === img ? 'border-indigo-600 scale-95 shadow-md' : 'border-gray-200 opacity-70'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{product.brand}</span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 mb-2 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400" /> {product.rating.toFixed(1)}
              </div>
              <span className="text-gray-500 font-medium">({product.reviewsCount + productReviews.length} Ratings & Reviews)</span>
              <span className="text-gray-300">|</span>
              <span className="font-mono text-gray-400 font-semibold">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-baseline gap-3">
            <span className="text-3xl font-black text-gray-900">
              {settings.currency}{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-base text-gray-400 line-through">
                {settings.currency}{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full ml-auto">
              Inclusive of all taxes
            </span>
          </div>

          <p className="text-gray-600 text-xs leading-relaxed">{product.description}</p>

          {/* Quantity & Stock Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700">
              <span>Select Quantity</span>
              <span className={product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2 text-gray-600 hover:bg-gray-200 font-bold text-sm rounded-l-xl"
                >
                  -
                </button>
                <span className="px-5 py-2 font-bold text-sm text-gray-900">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="px-3.5 py-2 text-gray-600 hover:bg-gray-200 font-bold text-sm rounded-r-xl"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                }`}
              >
                {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                <span>{added ? 'Added to Cart!' : 'Add to Shopping Cart'}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-2xl border transition-colors ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100 text-[11px] text-gray-600 font-semibold">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Fast Express Shipping</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>1 Year Warranty</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <RefreshCw className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>7 Days Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="pt-10 border-t border-gray-100 space-y-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" /> Customer Reviews & Feedback
        </h3>

        {/* Add Review Form */}
        <form onSubmit={handleAddReview} className="bg-gray-50 p-5 rounded-3xl border border-gray-200 space-y-4 max-w-xl">
          <h4 className="font-bold text-gray-900 text-xs">Write a Review</h4>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Your Rating</label>
            <div className="flex gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star className={`w-6 h-6 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              required
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full p-3 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 shadow-xs"
          >
            Submit Review
          </button>

          {reviewSubmitted && (
            <span className="text-xs font-bold text-emerald-600 ml-3">Review submitted successfully!</span>
          )}
        </form>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {productReviews.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No customer reviews yet. Be the first to leave a review!</p>
          ) : (
            productReviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-white rounded-2xl border border-gray-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-gray-900">{rev.userName}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 pl-9">{rev.comment}</p>
                <p className="text-[10px] text-gray-400 pl-9">{new Date(rev.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
