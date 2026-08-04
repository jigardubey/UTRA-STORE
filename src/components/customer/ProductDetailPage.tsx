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
    <div className="max-w-6xl mx-auto space-y-8 pb-28 animate-fade-in text-slate-900">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
      >
        <ArrowLeft className="w-4 h-4 text-slate-500" /> Back to Store Catalog
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-xs relative group">
            <img src={selectedImg || product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-slate-900 text-white font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider shadow-xs">
                OFFICIAL STORE
              </span>
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-slate-50 ${
                    selectedImg === img ? 'border-blue-600 scale-95 shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
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
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{product.brand}</span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-1 mb-3 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3 text-xs flex-wrap">
              <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {product.rating.toFixed(1)}
              </div>
              <span className="text-slate-500 font-medium">({product.reviewsCount + productReviews.length} Ratings & Reviews)</span>
              <span className="text-slate-300">|</span>
              <span className="font-mono text-slate-500 font-semibold">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 flex items-baseline gap-3 shadow-xs">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {settings.currency}{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-base text-slate-400 line-through font-semibold">
                {settings.currency}{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md ml-auto">
              Inclusive of all taxes
            </span>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>

          {/* Quantity & Actions Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Select Quantity</span>
              <span className={product.stock > 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-2.5 text-slate-700 hover:bg-slate-200 font-bold text-sm rounded-l-xl cursor-pointer"
                >
                  -
                </button>
                <span className="px-5 py-2.5 font-bold text-sm text-slate-900">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="px-4 py-2.5 text-slate-700 hover:bg-slate-200 font-bold text-sm rounded-r-xl cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                <span>{added ? 'ADDED TO CART!' : 'ADD TO CART'}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-[11px] text-slate-700 font-semibold">
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <Truck className="w-4 h-4 text-slate-900 shrink-0" />
              <span>Express Shipping</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-slate-900 shrink-0" />
              <span>1 Year Warranty</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <RefreshCw className="w-4 h-4 text-slate-900 shrink-0" />
              <span>7 Days Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar for Mobile */}
      <div className="md:hidden fixed bottom-16 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 flex items-center justify-between gap-3 shadow-md">
        <div>
          <span className="text-[10px] text-slate-500 block font-bold">TOTAL PRICE</span>
          <span className="text-base font-extrabold text-slate-900">
            {settings.currency}{(product.price * qty).toLocaleString('en-IN')}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1 py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          <span>{added ? 'ADDED!' : 'BUY NOW'}</span>
        </button>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="pt-10 border-t border-slate-200 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-700" /> Customer Reviews & Ratings
        </h3>

        {/* Add Review Form */}
        <form onSubmit={handleAddReview} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 max-w-xl shadow-xs">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Write a Review</h4>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Rating</label>
            <div className="flex gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star className={`w-6 h-6 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
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
              className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 shadow-xs cursor-pointer"
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
            <p className="text-xs text-slate-500 italic">No customer reviews yet. Be the first to leave a review!</p>
          ) : (
            productReviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center border border-slate-200">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900">{rev.userName}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 pl-9">{rev.comment}</p>
                <p className="text-[10px] text-slate-400 pl-9">{new Date(rev.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
