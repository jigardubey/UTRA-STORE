import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, Sparkles, CheckCircle2, X } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StorefrontView } from './components/customer/StorefrontView';
import { ProductDetailPage } from './components/customer/ProductDetailPage';
import { WishlistView } from './components/customer/WishlistView';
import { OrderHistoryView } from './components/customer/OrderHistoryView';
import { UserProfileView } from './components/customer/UserProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { AICustomerSupportModal } from './components/AICustomerSupportModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Product, ViewMode, Order } from './types';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { userProfile } = useAuth();
  const [welcomeBanner, setWelcomeBanner] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem('utrastore_current_view');
      return (saved as ViewMode) || 'store';
    } catch {
      return 'store';
    }
  });

  // Welcome banner effect on login
  useEffect(() => {
    if (userProfile?.displayName) {
      const bannerKey = `welcome_shown_${userProfile.uid}`;
      const alreadyShown = sessionStorage.getItem(bannerKey);
      if (!alreadyShown) {
        setWelcomeBanner(`Aapka Swagat Hai, ${userProfile.displayName}! 🎉 Welcome to UTRA STORE.`);
        sessionStorage.setItem(bannerKey, 'true');
        const timer = setTimeout(() => {
          setWelcomeBanner(null);
        }, 6000);
        return () => clearTimeout(timer);
      }
    }
  }, [userProfile]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    try {
      const saved = localStorage.getItem('utrastore_selected_product');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Modals / Drawers State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isAiSupportModalOpen, setIsAiSupportModalOpen] = useState(false);

  const setView = (view: ViewMode) => {
    setCurrentView(view);
    try {
      localStorage.setItem('utrastore_current_view', view);
    } catch {
      // ignore
    }
  };

  const handleFocusSearch = () => {
    setView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const el = document.getElementById('mobile-search-input');
      if (el) {
        el.focus();
      }
    }, 100);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    try {
      localStorage.setItem('utrastore_selected_product', JSON.stringify(product));
    } catch {
      // ignore
    }
    setView('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-slate-100 flex flex-col font-sans antialiased selection:bg-purple-500/30 selection:text-purple-300 relative bg-radial-ambient">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="fixed bottom-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* Welcome Toast Alert */}
      {welcomeBanner && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md bg-slate-900/90 backdrop-blur-xl text-white px-5 py-3.5 rounded-2xl shadow-[0_10px_30px_rgba(139,92,246,0.3)] border border-purple-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-sm">
            ✨
          </div>
          <div className="flex-1 text-xs">
            <p className="font-bold text-purple-300">UTRA STORE Luxury Greetings</p>
            <p className="font-medium text-slate-200 mt-0.5">{welcomeBanner}</p>
          </div>
          <button
            onClick={() => setWelcomeBanner(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setView={setView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenCartDrawer={() => setIsCartDrawerOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
        {(currentView === 'store' || (currentView === 'product_detail' && !selectedProduct)) && (
          <StorefrontView
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onQuickView={(prod) => setQuickViewProduct(prod)}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'product_detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setView('store')}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistView
            onBack={() => setView('store')}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'order_history' && (
          <OrderHistoryView onBack={() => setView('store')} />
        )}

        {currentView === 'profile' && (
          <UserProfileView onBack={() => setView('store')} />
        )}

        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        onProceedToCheckout={() => {
          setIsCheckoutModalOpen(true);
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewFullDetails={handleSelectProduct}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOrderCompleted={(order) => {
          setView('order_history');
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <AICustomerSupportModal
        isOpen={isAiSupportModalOpen}
        onClose={() => setIsAiSupportModalOpen(false)}
      />

      {/* Floating AI Customer Support Button */}
      <button
        onClick={() => setIsAiSupportModalOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-4 sm:right-6 z-40 bg-slate-900/80 backdrop-blur-xl border border-purple-500/40 hover:border-purple-400 text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-[0_0_25px_rgba(139,92,246,0.35)] flex items-center gap-2.5 transition-all hover:scale-105 group cursor-pointer"
        title="AI Customer Support & WhatsApp Help"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-purple-400 group-hover:text-cyan-400 transition-colors" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full" />
        </div>
        <div className="text-left hidden sm:block">
          <span className="block text-[10px] text-purple-300 font-extrabold uppercase tracking-wider leading-none">
            24/7 Concierge
          </span>
          <span className="text-xs font-black text-white leading-tight">
            AI Assistant & Support
          </span>
        </div>
      </button>

      {/* Mobile App Style Bottom Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        setView={setView}
        onOpenCartDrawer={() => setIsCartDrawerOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        searchQuery={searchQuery}
        onFocusSearch={handleFocusSearch}
        isCartDrawerOpen={isCartDrawerOpen}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
