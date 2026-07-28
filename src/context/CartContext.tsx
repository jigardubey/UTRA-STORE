import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Coupon } from '../types';
import { useStore } from './StoreContext';

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  appliedCoupon: Coupon | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartCount: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, coupons } = useStore();
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('pulseshop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('pulseshop_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('pulseshop_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage save cart error:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('pulseshop_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('LocalStorage save wishlist error:', e);
    }
  }, [wishlist]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(product.stock, updated[existingIndex].quantity + quantity);
        updated[existingIndex].quantity = newQty;
        return updated;
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return { ...item, quantity: Math.min(item.product.stock, nextQty) };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const applyCouponCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.active);

    if (!found) {
      return { success: false, message: 'Invalid or expired promo code' };
    }

    if (subtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Minimum order of ${settings.currency}${found.minOrderAmount} required for ${found.code}`,
      };
    }

    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully! (${found.discountPercent}% OFF)` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;

  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const shippingFee = afterDiscount >= settings.freeShippingThreshold || cart.length === 0 ? 0 : settings.shippingFee;
  const total = afterDiscount + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        appliedCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCouponCode,
        removeCoupon,
        cartCount,
        subtotal,
        discountAmount,
        shippingFee,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
