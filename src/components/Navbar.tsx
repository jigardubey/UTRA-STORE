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
  const { userProfile, isAdmin, isGuest, logout, toggleAdminOverride } = useAuth();
  const { cartCount, wishlist } = useCart();
  const { categories, settings } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Use code <strong className="text-amber-300 font-bold">WELCOME10</strong> for 10% OFF | Free Express Shipping over {settings.currency}{settings.freeShippingThreshold}!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setView('store')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform border border-indigo-400/30 relative overflow-hidden">
                <span className="font-black text-xl font-mono tracking-tighter text-amber-300 drop-shadow-xs">U</span>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-gray-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent block leading-none">
                  UTRA STORE
                </span>
                <span className="hidden sm:block text-[9px] text-indigo-600 font-extrabold tracking-widest uppercase mt-0.5">
                  Official Online Hub
                </span>
              </div>
            </button>

            {/* Desktop Navigation Category Links */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-gray-600">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setView('store');
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCategory === 'All' && currentView === 'store'
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'hover:text-gray-900 hover:bg-gray-50'
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
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    selectedCategory === cat.name && currentView === 'store'
                      ? 'bg-indigo-50 text-indigo-600 font-semibold'
                      : 'hover:text-gray-900 hover:bg-gray-50'
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
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-gray-400"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600 bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  currentView === 'admin'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{currentView === 'admin' ? 'Storefront' : 'Admin Panel'}</span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              onClick={() => setView('wishlist')}
              className="relative p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCartDrawer}
              className="relative flex items-center gap-2 bg-slate-900 text-white px-3.5 py-2 rounded-full hover:bg-slate-800 transition-all shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
              <span className="bg-indigo-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center">
                {cartCount}
              </span>
            </button>

            {/* User Profile / Auth Dropdown */}
            <div className="relative">
              {userProfile ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 text-gray-700 hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center">
                    {userProfile.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden xl:inline text-xs font-medium max-w-[100px] truncate">
                    {userProfile.displayName}
                  </span>
                </button>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-full border border-gray-200 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-500" />
                  <span>Login / Register</span>
                </button>
              )}

              {/* Profile Dropdown Menu */}
              {userDropdownOpen && userProfile && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 divide-y divide-gray-100 text-xs"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5">
                    <p className="font-bold text-gray-900 truncate">{userProfile.displayName}</p>
                    <p className="text-gray-500 text-[11px] truncate">{userProfile.email}</p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-amber-50 text-amber-700 font-semibold text-[10px] rounded-md border border-amber-200">
                        <ShieldCheck className="w-3 h-3" /> Store Admin
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setView('order_history');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <PackageCheck className="w-4 h-4 text-gray-400" /> My Orders & Tracking
                    </button>

                    <button
                      onClick={() => {
                        setView('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-gray-400" /> Account & Addresses
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setView('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-indigo-600 font-semibold hover:bg-indigo-50 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-500" /> Admin Dashboard
                      </button>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
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
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="pb-3 pt-1 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== 'store') setView('store');
              }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-gray-100 space-y-2">
            <div className="flex gap-2 overflow-x-auto pb-2 px-1">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setView('store');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                  selectedCategory === 'All' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
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
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                    selectedCategory === cat.name ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
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
