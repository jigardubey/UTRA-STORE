import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Store,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  Sparkles,
  PackageCheck,
  Tag,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onOpenAuthModal: () => void;
  onOpenCartDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setView,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenAuthModal,
  onOpenCartDrawer,
}) => {
  const { userProfile, isAdmin, logout } = useAuth();
  const { cartCount, wishlist } = useCart();
  const { categories, settings } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0F1018]/85 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-950 to-indigo-950 text-slate-200 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2 font-medium border-b border-white/5">
        <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
        <span>
          Use code <strong className="text-cyan-300 font-extrabold tracking-wider">WELCOME10</strong> for 10% OFF | Free Express Luxury Shipping over {settings.currency}{settings.freeShippingThreshold}!
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setView('store')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] group-hover:scale-105 transition-transform border border-purple-400/30 relative overflow-hidden">
                <span className="font-black text-xl font-mono tracking-tighter text-white drop-shadow-md">U</span>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full border-2 border-slate-900 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-gradient-purple block leading-none">
                  UTRA STORE
                </span>
                <span className="hidden sm:block text-[9px] text-cyan-400 font-extrabold tracking-widest uppercase mt-0.5">
                  Luxury Tech & Lifestyle
                </span>
              </div>
            </button>

            {/* Desktop Navigation Category Links */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-300">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setView('store');
                }}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  selectedCategory === 'All' && currentView === 'store'
                    ? 'bg-purple-600/30 border border-purple-500/50 text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                    : 'hover:text-white hover:bg-white/5'
                }`}
              >
                All Products
              </button>
              {categories.slice(0, 3).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setView('store');
                  }}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    selectedCategory === cat.name && currentView === 'store'
                      ? 'bg-purple-600/30 border border-purple-500/50 text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                      : 'hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'store') setView('store');
                }}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-900/90 border border-white/10 rounded-full text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/30 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* User Controls & Cart Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Switch Button */}
            {isAdmin && (
              <button
                onClick={() => setView(currentView === 'admin' ? 'store' : 'admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'admin'
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-purple-400'
                    : 'bg-slate-900 text-purple-300 hover:bg-slate-800 border border-purple-500/30'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />
                <span>{currentView === 'admin' ? 'Storefront' : 'Admin Hub'}</span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              onClick={() => setView('wishlist')}
              className="relative p-2 text-slate-300 hover:text-rose-400 hover:bg-white/5 rounded-full transition-colors cursor-pointer"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(244,63,94,0.8)]">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCartDrawer}
              className="relative flex items-center gap-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-3.5 py-2 rounded-full transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] border border-purple-400/30 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-bold">Cart</span>
              <span className="bg-cyan-400 text-slate-950 text-[11px] font-black px-1.5 py-0.5 rounded-full min-w-5 text-center leading-none">
                {cartCount}
              </span>
            </button>

            {/* User Profile / Auth Dropdown */}
            <div className="relative">
              {userProfile ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-slate-200 hover:bg-white/5 rounded-full transition-colors border border-purple-500/30 bg-slate-900/80 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 text-white text-xs font-black flex items-center justify-center shadow-sm">
                    {userProfile.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col text-left pr-1">
                    <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-tight leading-none">Welcome 👋</span>
                    <span className="text-xs font-bold text-white max-w-[110px] truncate leading-tight">
                      {userProfile.displayName}
                    </span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-white/10 rounded-full border border-white/15 transition-colors cursor-pointer bg-slate-900/60"
                >
                  <User className="w-4 h-4 text-purple-400" />
                  <span>Login / Register</span>
                </button>
              )}

              {/* Profile Dropdown Menu */}
              {userDropdownOpen && userProfile && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-purple-500/30 py-2 z-50 divide-y divide-white/10 text-xs text-slate-200"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-3 bg-purple-950/40 rounded-t-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-md">
                        {userProfile.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[11px] text-purple-300 font-bold uppercase tracking-wider">Aapka Swagat Hai! 👋</p>
                        <p className="font-extrabold text-white truncate text-sm">{userProfile.displayName}</p>
                      </div>
                    </div>
                    <p className="text-slate-400 text-[11px] truncate mt-1 pl-0.5">{userProfile.email}</p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-amber-500/20 text-amber-300 font-semibold text-[10px] rounded-md border border-amber-500/30">
                        <ShieldCheck className="w-3 h-3" /> Certified Store Admin
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setView('order_history');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-slate-300 hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                    >
                      <PackageCheck className="w-4 h-4 text-purple-400" /> My Orders & Tracking
                    </button>

                    <button
                      onClick={() => {
                        setView('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-slate-300 hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-purple-400" /> Account & Addresses
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setView('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-purple-300 font-bold hover:bg-purple-900/30 flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-400" /> Admin Dashboard
                      </button>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 font-bold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:bg-white/5 rounded-lg lg:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="pb-3 pt-1 md:hidden">
          <div className="relative">
            <input
              id="mobile-search-input"
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== 'store') setView('store');
              }}
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-900/90 border border-white/10 rounded-full text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-white/10 space-y-2">
            <div className="flex gap-2 overflow-x-auto pb-2 px-1">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setView('store');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                  selectedCategory === 'All' ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'bg-slate-900 text-slate-300 border border-white/10'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setView('store');
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.name ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'bg-slate-900 text-slate-300 border border-white/10'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
