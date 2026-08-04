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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-500/20 selection:text-blue-600 relative">
      {/* Welcome Toast Alert */}
      {welcomeBanner && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-xl border border-slate-800 flex items-center gap-3 animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
            ✨
          </div>
          <div className="flex-1 text-xs">
            <p className="font-bold text-slate-200">UTRA STORE</p>
            <p className="font-medium text-slate-300 mt-0.5">{welcomeBanner}</p>
          </div>
          <button
            onClick={() => setWelcomeBanner(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
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
        className="fixed bottom-24 md:bottom-8 right-4 sm:right-6 z-40 bg-slate-900 text-white hover:bg-slate-800 px-4 py-3 rounded-full shadow-lg flex items-center gap-2.5 transition-all hover:scale-105 border border-slate-700 cursor-pointer"
        title="AI Customer Support"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-blue-400" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full" />
        </div>
        <div className="text-left hidden sm:block">
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
            24/7 Support
          </span>
          <span className="text-xs font-bold text-white leading-tight">
            AI Assistant
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
