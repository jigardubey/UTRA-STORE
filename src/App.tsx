import React, { useState } from 'react';
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
import { Product, ViewMode, Order } from './types';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { currentUser } = useAuth();
  const [currentView, setView] = useState<ViewMode>('store');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Modals / Drawers State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setView('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans antialiased selection:bg-indigo-500/20 selection:text-indigo-600">
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
        {currentView === 'store' && (
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
          if (!currentUser) {
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
