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
    <div className="max-w-6xl mx-auto space-y-8 pb-28 animate-fade-in text-slate-100">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-900/80 border border-white/10 px-4 py-2.5 rounded-xl transition-all hover:border-purple-500/50 cursor-pointer shadow-sm"
      >
        <ArrowLeft className="w-4 h-4 text-purple-400" /> Back to Store Catalog
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative group">
            <img src={selectedImg || product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-purple-600/90 backdrop-blur-md text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.6)] border border-purple-400/30">
                ✨ LUXURY EDITION
              </span>
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImg === img ? 'border-purple-500 scale-95 shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'border-white/10 opacity-60 hover:opacity-100'
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
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">{product.brand}</span>
            <h1 className="text-2xl sm:text-4xl font-black text-white mt-1 mb-3 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3 text-xs flex-wrap">
              <div className="flex items-center gap-1 text-amber-400 font-extrabold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <Star className="w-4 h-4 fill-amber-400" /> {product.rating.toFixed(1)}
              </div>
              <span className="text-slate-400 font-medium">({product.reviewsCount + productReviews.length} Ratings & Reviews)</span>
              <span className="text-slate-700">|</span>
              <span className="font-mono text-slate-400 font-semibold">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-5 bg-[#131422]/90 backdrop-blur-md rounded-2xl border border-white/10 flex items-baseline gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {settings.currency}{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-base text-slate-500 line-through font-semibold">
                {settings.currency}{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs font-extrabold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full ml-auto">
              Inclusive of all taxes
            </span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">{product.description}</p>

          {/* Quantity & Actions Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Select Quantity</span>
              <span className={product.stock > 0 ? 'text-emerald-400 font-extrabold' : 'text-rose-400 font-extrabold'}>
                {product.stock > 0 ? `⚡ In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-white/15 rounded-xl bg-slate-900/90">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-2.5 text-slate-300 hover:bg-white/10 font-black text-sm rounded-l-xl cursor-pointer"
                >
                  -
                </button>
                <span className="px-5 py-2.5 font-black text-sm text-white">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="px-4 py-2.5 text-slate-300 hover:bg-white/10 font-black text-sm rounded-r-xl cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                  added
                    ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.6)]'
                    : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-[0_0_25px_rgba(139,92,246,0.5)] border border-purple-400/30'
                }`}
              >
                {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                <span>{added ? 'ADDED TO CART!' : 'ADD TO CART'}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                    : 'bg-slate-900 text-slate-300 border-white/10 hover:bg-slate-800'
                }`}
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-[11px] text-slate-300 font-semibold">
            <div className="flex items-center gap-2 p-3 bg-slate-900/60 border border-white/5 rounded-xl">
              <Truck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Fast Express Shipping</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-900/60 border border-white/5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>1 Year Warranty</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-900/60 border border-white/5 rounded-xl">
              <RefreshCw className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>7 Days Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar for Mobile */}
      <div className="md:hidden fixed bottom-16 inset-x-0 z-40 bg-slate-950/90 backdrop-blur-2xl border-t border-white/10 p-3 flex items-center justify-between gap-3 shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
        <div>
          <span className="text-[10px] text-slate-400 block font-bold">TOTAL PRICE</span>
          <span className="text-base font-black text-white">
            {settings.currency}{(product.price * qty).toLocaleString('en-IN')}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1 py-3 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.6)] flex items-center justify-center gap-2 cursor-pointer"
        >
          {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          <span>{added ? 'ADDED!' : 'BUY NOW'}</span>
        </button>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="pt-10 border-t border-white/10 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-400" /> Customer Reviews & Ratings
        </h3>

        {/* Add Review Form */}
        <form onSubmit={handleAddReview} className="bg-[#131422]/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-4 max-w-xl">
          <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Write a Review</h4>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Your Rating</label>
            <div className="flex gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star className={`w-6 h-6 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
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
              placeholder="Share your experience with this luxury product..."
              className="w-full p-3.5 text-xs bg-slate-900 border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 text-white font-extrabold text-xs rounded-xl hover:bg-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.4)] cursor-pointer"
          >
            Submit Review
          </button>

          {reviewSubmitted && (
            <span className="text-xs font-bold text-emerald-400 ml-3">Review submitted successfully!</span>
          )}
        </form>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {productReviews.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No customer reviews yet. Be the first to leave a review!</p>
          ) : (
            productReviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-[#131422]/80 backdrop-blur-md rounded-2xl border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-purple-600/30 text-purple-300 font-bold flex items-center justify-center border border-purple-500/30">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white">{rev.userName}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400' : 'text-slate-700'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-slate-300 pl-9">{rev.comment}</p>
                <p className="text-[10px] text-slate-500 pl-9">{new Date(rev.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
