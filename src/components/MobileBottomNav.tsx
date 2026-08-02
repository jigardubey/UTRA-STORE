import React from 'react';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ViewMode } from '../types';

interface MobileBottomNavProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
  onOpenCartDrawer: () => void;
  onOpenAuthModal: () => void;
  searchQuery: string;
  onFocusSearch: () => void;
  isCartDrawerOpen?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  setView,
  onOpenCartDrawer,
  onOpenAuthModal,
  searchQuery,
  onFocusSearch,
  isCartDrawerOpen = false,
}) => {
  const { userProfile, currentUser } = useAuth();
  const { cartCount, wishlist } = useCart();

  const isLoggedIn = !!(currentUser || userProfile);

  // Determine active tab state
  let activeTab: 'home' | 'search' | 'cart' | 'wishlist' | 'profile' = 'home';

  if (isCartDrawerOpen) {
    activeTab = 'cart';
  } else if (currentView === 'wishlist') {
    activeTab = 'wishlist';
  } else if (currentView === 'profile' || currentView === 'order_history') {
    activeTab = 'profile';
  } else if (currentView === 'store' && searchQuery.trim().length > 0) {
    activeTab = 'search';
  } else if (currentView === 'store') {
    activeTab = 'home';
  }

  const handleHomeClick = () => {
    setView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchClick = () => {
    setView('store');
    onFocusSearch();
  };

  const handleCartClick = () => {
    onOpenCartDrawer();
  };

  const handleWishlistClick = () => {
    setView('wishlist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setView('profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onOpenAuthModal();
    }
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      action: handleHomeClick,
      isActive: activeTab === 'home' && !searchQuery,
      badge: null,
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      action: handleSearchClick,
      isActive: activeTab === 'search',
      badge: null,
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingBag,
      action: handleCartClick,
      isActive: activeTab === 'cart',
      badge: cartCount > 0 ? (cartCount > 99 ? '99+' : cartCount) : null,
      badgeColor: 'bg-gradient-to-r from-indigo-600 to-purple-600',
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      action: handleWishlistClick,
      isActive: activeTab === 'wishlist',
      badge: wishlist.length > 0 ? wishlist.length : null,
      badgeColor: 'bg-rose-500',
    },
    {
      id: 'profile',
      label: isLoggedIn ? 'Profile' : 'Login',
      icon: User,
      action: handleProfileClick,
      isActive: activeTab === 'profile',
      badge: isLoggedIn ? '✓' : null,
      badgeColor: 'bg-emerald-500 text-[8px]',
    },
  ];

  return (
    <div className="fixed bottom-3 left-3 right-3 z-40 md:hidden max-w-lg mx-auto">
      <nav className="bg-slate-950/85 backdrop-blur-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(139,92,246,0.2)] rounded-2xl px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] transition-all">
        <div className="grid grid-cols-5 gap-1 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;

            return (
              <motion.button
                key={item.id}
                onClick={item.action}
                whileTap={{ scale: 0.88 }}
                className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 select-none min-h-[48px] touch-manipulation cursor-pointer ${
                  active ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* Active Tab Background Pill */}
                {active && (
                  <motion.div
                    layoutId="mobile-nav-active-pill"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-blue-600/30 border border-purple-500/50 rounded-xl -z-10 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}

                {/* Top Glowing Indicator */}
                {active && (
                  <motion.div
                    layoutId="mobile-nav-top-bar"
                    className="absolute top-0 w-6 h-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(192,132,252,0.8)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}

                {/* Icon Container with Badge */}
                <div className="relative flex items-center justify-center">
                  <motion.div
                    animate={{ scale: active ? 1.15 : 1, y: active ? -1 : 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        active ? 'text-cyan-300 stroke-[2.3]' : 'text-slate-400 stroke-[1.8]'
                      }`}
                    />
                  </motion.div>

                  {/* Badge Overlay */}
                  {item.badge !== null && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute -top-1.5 -right-2.5 ${
                        item.badgeColor || 'bg-purple-600'
                      } text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-4 h-4 flex items-center justify-center border border-slate-900 shadow-[0_0_10px_rgba(139,92,246,0.6)] leading-none`}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </div>

                {/* Tab Label */}
                <span
                  className={`text-[10px] mt-1 tracking-tight leading-none truncate max-w-full ${
                    active ? 'font-extrabold text-purple-200' : 'font-semibold text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
