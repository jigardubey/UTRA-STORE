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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span>
          Use code <strong className="text-white font-bold tracking-wider">WELCOME10</strong> for 10% OFF | Free Express Shipping over {settings.currency}{settings.freeShippingThreshold}!
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setView('store')}
              className="flex items-center gap-2 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-lg tracking-tight group-hover:bg-blue-600 transition-colors shadow-xs">
                U
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 block leading-none">
                  UTRA<span className="text-blue-600">STORE</span>
                </span>
                <span className="hidden sm:block text-[9px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">
                  Premium Tech & Accessories
                </span>
              </div>
            </button>

            {/* Desktop Navigation Category Links */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setView('store');
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === 'All' && currentView === 'store'
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                All Products
              </button>
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setView('store');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    selectedCategory === cat.name && currentView === 'store'
                      ? 'bg-slate-100 text-slate-900 font-bold'
                      : 'hover:text-slate-900 hover:bg-slate-50'
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
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-500 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'admin'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{currentView === 'admin' ? 'Storefront' : 'Admin Hub'}</span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              onClick={() => setView('wishlist')}
              className="relative p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCartDrawer}
              className="relative flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition-colors shadow-xs cursor-pointer font-bold text-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-blue-600 text-white text-[11px] font-extrabold px-1.5 py-0.5 rounded-md min-w-5 text-center leading-none">
                {cartCount}
              </span>
            </button>

            {/* User Profile / Auth Dropdown */}
            <div className="relative">
              {userProfile ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    {userProfile.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col text-left pr-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight leading-none">Account</span>
                    <span className="text-xs font-bold text-slate-900 max-w-[100px] truncate leading-tight">
                      {userProfile.displayName}
                    </span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Profile Dropdown Menu */}
              {userDropdownOpen && userProfile && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 divide-y divide-slate-100 text-xs text-slate-700"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-3 bg-slate-50 rounded-t-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                        {userProfile.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Welcome 👋</p>
                        <p className="font-bold text-slate-900 truncate text-sm">{userProfile.displayName}</p>
                      </div>
                    </div>
                    <p className="text-slate-500 text-[11px] truncate mt-1">{userProfile.email}</p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-amber-50 text-amber-700 font-semibold text-[10px] rounded-md border border-amber-200">
                        <ShieldCheck className="w-3 h-3" /> Certified Admin
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setView('order_history');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <PackageCheck className="w-4 h-4 text-slate-500" /> My Orders & Tracking
                    </button>

                    <button
                      onClick={() => {
                        setView('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <User className="w-4 h-4 text-slate-500" /> Account Settings
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setView('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-blue-600 font-bold hover:bg-blue-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-blue-600" /> Admin Dashboard
                      </button>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl lg:hidden cursor-pointer"
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
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-500 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200 space-y-2">
            <div className="flex gap-2 overflow-x-auto pb-2 px-1">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setView('store');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                  selectedCategory === 'All' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.name ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'
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
