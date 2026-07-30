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
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans antialiased selection:bg-indigo-500/20 selection:text-indigo-600 relative">
      {/* Welcome Toast Alert */}
      {welcomeBanner && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-indigo-500/30 flex items-center gap-3 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-sm">
            ✨
          </div>
          <div className="flex-1 text-xs">
            <p className="font-bold text-indigo-300">UTRA STORE Greetings</p>
            <p className="font-medium text-slate-100 mt-0.5">{welcomeBanner}</p>
          </div>
          <button
            onClick={() => setWelcomeBanner(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
          if (!currentUser && !userProfile) {
            setIsAuthModalOpen(true);
          } else {
            setIsCheckoutModalOpen(true);
          }
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
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 hover:from-indigo-800 hover:to-purple-700 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-all hover:scale-105 group border border-indigo-400/40"
        title="AI Customer Support & WhatsApp Help"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-amber-300" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
        </div>
        <div className="text-left hidden sm:block">
          <span className="block text-[10px] text-indigo-200 font-extrabold uppercase tracking-wider leading-none">
            24/7 Support
          </span>
          <span className="text-xs font-black text-white leading-tight">
            AI Support & Owner Chat
          </span>
        </div>
      </button>

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
