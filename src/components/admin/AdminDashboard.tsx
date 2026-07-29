import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Tag,
  Image as ImageIcon,
  Settings,
  Plus,
  Trash2,
  Edit,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Truck,
  Eye,
  Shield,
  Search,
  Filter,
  X,
  Check,
  Percent,
  Upload,
  CreditCard,
  Bot,
} from 'lucide-react';
import { AIDropshippingHub } from './AIDropshippingHub';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Product, Order, Coupon, Banner, StoreSettings } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const {
    products,
    categories,
    brands,
    orders,
    coupons,
    banners,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    addBrand,
    deleteBrand,
    updateOrderStatus,
    addCoupon,
    deleteCoupon,
    addBanner,
    deleteBanner,
    updateSettings,
  } = useStore();

  if (!isAdmin) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 max-w-xl mx-auto shadow-sm p-8 my-10 animate-fade-in">
        <Shield className="w-16 h-16 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-black text-gray-900 mb-2">Private Store Owner Access Only</h2>
        <p className="text-xs text-gray-500 mb-6">
          The UTRA STORE Admin Dashboard is protected. Please log in using the Store Owner Secret PIN from the account menu to manage products and orders.
        </p>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'dropshipping' | 'products' | 'categories' | 'inventory' | 'orders' | 'coupons' | 'banners' | 'settings'
  >('dropshipping');

  // Search & Filters State
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Selected Order for Details View
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // New Product Modal Form State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    description: '',
    price: 999,
    compareAtPrice: 1299,
    category: categories[0]?.name || 'Electronics & Audio',
    brand: brands[0]?.name || 'Sony',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
    stock: 25,
    sku: 'SKU-' + Math.floor(100 + Math.random() * 900),
    isFeatured: true,
  });

  const [imageUrlInput, setImageUrlInput] = useState('');

  const sampleProductImages = [
    { name: '🎧 Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' },
    { name: '⌚ Smartwatch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80' },
    { name: '👟 Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80' },
    { name: '📷 Camera', url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80' },
    { name: '📱 Smartphone', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80' },
    { name: '🔊 Speaker', url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80' },
  ];

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setProdForm((prev) => ({
            ...prev,
            images: [...prev.images, dataUrl],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setProdForm((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()],
    }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setProdForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleQrFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file: File = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        setTempSettings((prev) => ({
          ...prev,
          customQrUrl: dataUrl,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Category & Brand Forms
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newBrandName, setNewBrandName] = useState('');

  // Coupon Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(500);

  // Banner Form
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerImg, setNewBannerImg] = useState('');
  const [newBannerCta, setNewBannerCta] = useState('Shop Collection');

  // Settings State
  const [tempSettings, setTempSettings] = useState<StoreSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  // Chart data simulation from orders
  const chartData = [
    { name: 'Mon', sales: Math.round(totalRevenue * 0.1) },
    { name: 'Tue', sales: Math.round(totalRevenue * 0.15) },
    { name: 'Wed', sales: Math.round(totalRevenue * 0.2) },
    { name: 'Thu', sales: Math.round(totalRevenue * 0.12) },
    { name: 'Fri', sales: Math.round(totalRevenue * 0.25) },
    { name: 'Sat', sales: Math.round(totalRevenue * 0.18) },
  ];

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategoryFilter === 'All' || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.trackingNumber.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-register custom typed category or brand if not already present in list
    const categoryName = prodForm.category.trim();
    const brandName = prodForm.brand.trim();

    if (categoryName && !categories.some(c => c.name.toLowerCase() === categoryName.toLowerCase())) {
      await addCategory({ name: categoryName, description: 'Custom Category' });
    }
    if (brandName && !brands.some(b => b.name.toLowerCase() === brandName.toLowerCase())) {
      await addBrand({ name: brandName });
    }

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name: prodForm.name,
        description: prodForm.description,
        price: Number(prodForm.price),
        compareAtPrice: Number(prodForm.compareAtPrice),
        category: categoryName || 'General',
        brand: brandName || 'UTRA',
        images: prodForm.images,
        stock: Number(prodForm.stock),
        sku: prodForm.sku,
        isFeatured: prodForm.isFeatured,
      });
    } else {
      await addProduct({
        name: prodForm.name,
        description: prodForm.description,
        price: Number(prodForm.price),
        compareAtPrice: Number(prodForm.compareAtPrice),
        category: categoryName || 'General',
        brand: brandName || 'UTRA',
        images: prodForm.images,
        stock: Number(prodForm.stock),
        sku: prodForm.sku,
        rating: 4.8,
        reviewsCount: 1,
        isFeatured: prodForm.isFeatured,
      });
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await addCategory({
      name: newCatName.trim(),
      description: newCatDesc.trim() || 'Premium products category',
      icon: 'Tag',
    });
    setNewCatName('');
    setNewCatDesc('');
  };

  const handleAddBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    await addBrand({ name: newBrandName.trim() });
    setNewBrandName('');
  };

  const handleAddCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    await addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPercentage: Number(newCouponDiscount),
      minOrderAmount: Number(newCouponMin),
      isActive: true,
    });
    setNewCouponCode('');
  };

  const handleAddBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle.trim() || !newBannerImg.trim()) return;
    await addBanner({
      title: newBannerTitle.trim(),
      subtitle: newBannerSubtitle.trim() || 'Exclusive offers and top brands',
      imageUrl: newBannerImg.trim(),
      ctaText: newBannerCta.trim() || 'Explore Catalog',
      category: categories[0]?.name || 'Electronics & Audio',
    });
    setNewBannerTitle('');
    setNewBannerSubtitle('');
    setNewBannerImg('');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(tempSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fade-in">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" /> Certified Store Administrator
          </span>
          <h1 className="text-2xl font-black tracking-tight">Store Management Control Hub</h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time synchronization with Firebase Firestore, Orders & Inventory.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setProdForm({
              name: '',
              description: '',
              price: 1499,
              compareAtPrice: 1999,
              category: categories[0]?.name || 'Electronics & Audio',
              brand: brands[0]?.name || 'Sony',
              images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
              stock: 30,
              sku: 'SKU-' + Math.floor(1000 + Math.random() * 9000),
              isFeatured: true,
            });
            setShowProductModal(true);
          }}
          className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/25 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-100 text-xs font-bold">
        {[
          { id: 'dropshipping', label: 'AI Dropshipping & Supplier Hub', icon: Bot },
          { id: 'analytics', label: 'Dashboard & Revenue', icon: TrendingUp },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'inventory', label: `Inventory Alert (${lowStockCount})`, icon: AlertTriangle },
          { id: 'categories', label: 'Categories & Brands', icon: Layers },
          { id: 'coupons', label: 'Coupons & Discounts', icon: Tag },
          { id: 'banners', label: 'Homepage Banners', icon: ImageIcon },
          { id: 'settings', label: 'Store Settings', icon: Settings },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 0: AI DROPSHIPPING & SUPPLIER AUTOMATION */}
      {activeTab === 'dropshipping' && <AIDropshippingHub />}

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-2">
              <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase">
                <span>Total Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-gray-900">
                {settings.currency}{totalRevenue.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold">↑ +18.4% from last week</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-2">
              <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase">
                <span>Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-2xl font-black text-gray-900">{totalOrdersCount}</p>
              <span className="text-[10px] text-indigo-600 font-semibold">Processed & Recorded</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-2">
              <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase">
                <span>Catalog Items</span>
                <Package className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-gray-900">{products.length}</p>
              <span className="text-[10px] text-amber-600 font-semibold">{lowStockCount} items low in stock</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-2">
              <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase">
                <span>Active Banners</span>
                <ImageIcon className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl font-black text-gray-900">{banners.length}</p>
              <span className="text-[10px] text-purple-600 font-semibold">Homepage promotions</span>
            </div>
          </div>

          {/* Revenue Area Chart */}
          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">Weekly Sales & Revenue Trajectory ({settings.currency})</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGER */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Controls & Search Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by title, brand or SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Categories ({products.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-100">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400 italic">
                      No products found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                        <div>
                          <p className="font-bold text-gray-900 truncate max-w-xs">{p.name}</p>
                          <span className="text-[10px] text-gray-400">{p.brand}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{p.category}</td>
                      <td className="p-4 font-bold text-gray-900">
                        {settings.currency}{p.price.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            p.stock <= 5 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {p.stock} units
                          </span>
                          <button
                            onClick={() => updateProduct(p.id, { stock: p.stock + 5 })}
                            className="text-[10px] bg-gray-100 hover:bg-gray-200 px-1.5 py-0.5 rounded-md font-bold text-gray-600"
                            title="Add +5 Stock"
                          >
                            +5
                          </button>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-gray-500">{p.sku}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setProdForm({
                                name: p.name,
                                description: p.description,
                                price: p.price,
                                compareAtPrice: p.compareAtPrice || p.price * 1.2,
                                category: p.category,
                                brand: p.brand,
                                images: p.images,
                                stock: p.stock,
                                sku: p.sku,
                                isFeatured: !!p.isFeatured,
                              });
                              setShowProductModal(true);
                            }}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders by customer name, ID or tracking..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Order Statuses</option>
                <option value="placed">Placed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-100">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Tracking No</th>
                  <th className="p-4 text-right">View Items</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400 italic">
                      No orders match criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="p-4 font-bold text-indigo-600 font-mono">{o.id}</td>
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{o.customerName}</p>
                        <p className="text-[10px] text-gray-400">{o.customerEmail}</p>
                      </td>
                      <td className="p-4 font-bold text-gray-900">
                        {settings.currency}{o.total.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 uppercase text-[10px] font-bold text-emerald-600">{o.paymentMethod}</td>
                      <td className="p-4">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                          className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg font-bold text-gray-800 text-xs focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="placed">Placed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="out_for_delivery">Out For Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 font-mono text-gray-600">{o.trackingNumber}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedOrderDetails(o)}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold rounded-lg text-[11px] inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Items ({o.items.length})
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: INVENTORY ALERT */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs flex items-center gap-2 font-bold">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Items with stock 5 or less require immediate restocking to prevent stockouts!</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products
              .filter((p) => p.stock <= 5)
              .map((p) => (
                <div key={p.id} className="p-4 bg-white rounded-2xl border border-gray-200 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-gray-900">{p.name}</h4>
                    <p className="text-rose-600 font-bold mt-1">Stock Left: {p.stock} units</p>
                  </div>
                  <button
                    onClick={() => updateProduct(p.id, { stock: p.stock + 20 })}
                    className="px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-xl"
                  >
                    + Restock 20 Units
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 5: CATEGORIES & BRANDS */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Categories Management */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" /> Manage Store Categories
            </h3>

            <form onSubmit={handleAddCategorySubmit} className="flex gap-2">
              <input
                required
                placeholder="New Category Name (e.g. Smart Watches)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
              <button type="submit" className="px-4 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl">
                Add
              </button>
            </form>

            <div className="space-y-2">
              {categories.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs">
                  <div>
                    <strong className="text-gray-900">{c.name}</strong>
                    <p className="text-[10px] text-gray-400">{c.description}</p>
                  </div>
                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Brands Management */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-600" /> Manage Store Brands
            </h3>

            <form onSubmit={handleAddBrandSubmit} className="flex gap-2">
              <input
                required
                placeholder="New Brand Name (e.g. Bose)"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
              <button type="submit" className="px-4 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl">
                Add
              </button>
            </form>

            <div className="space-y-2">
              {brands.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs">
                  <strong className="text-gray-900">{b.name}</strong>
                  <button
                    onClick={() => deleteBrand(b.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: COUPONS & DISCOUNTS */}
      {activeTab === 'coupons' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Percent className="w-4 h-4 text-indigo-600" /> Promo Coupons & Discount Codes
          </h3>

          <form onSubmit={handleAddCouponSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <input
              required
              placeholder="Coupon Code (e.g. FESTIVE20)"
              value={newCouponCode}
              onChange={(e) => setNewCouponCode(e.target.value)}
              className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl uppercase font-mono font-bold"
            />
            <input
              type="number"
              required
              placeholder="Discount %"
              value={newCouponDiscount}
              onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
              className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
            />
            <input
              type="number"
              placeholder="Min Order Amount"
              value={newCouponMin}
              onChange={(e) => setNewCouponMin(Number(e.target.value))}
              className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
            />
            <button type="submit" className="py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-xs">
              Create Coupon
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((cp) => (
              <div key={cp.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex justify-between items-center text-xs">
                <div>
                  <strong className="font-mono text-indigo-600 font-black text-sm">{cp.code}</strong>
                  <p className="text-gray-600 font-bold mt-0.5">{cp.discountPercentage}% OFF</p>
                  <p className="text-[10px] text-gray-400">Min Order: {settings.currency}{cp.minOrderAmount}</p>
                </div>
                <button onClick={() => deleteCoupon(cp.id)} className="p-2 text-rose-500 hover:bg-rose-100 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: HOMEPAGE BANNERS */}
      {activeTab === 'banners' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-600" /> Promotional Banners
          </h3>

          <form onSubmit={handleAddBannerSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="Banner Title"
                value={newBannerTitle}
                onChange={(e) => setNewBannerTitle(e.target.value)}
                className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              />
              <input
                placeholder="Banner Subtitle"
                value={newBannerSubtitle}
                onChange={(e) => setNewBannerSubtitle(e.target.value)}
                className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="Image URL (Unsplash or direct image link)"
                value={newBannerImg}
                onChange={(e) => setNewBannerImg(e.target.value)}
                className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              />
              <input
                placeholder="Button CTA Text"
                value={newBannerCta}
                onChange={(e) => setNewBannerCta(e.target.value)}
                className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
            <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl">
              Add Promotional Banner
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {banners.map((bn) => (
              <div key={bn.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex gap-4 items-center text-xs">
                <img src={bn.imageUrl} alt={bn.title} className="w-20 h-16 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">{bn.title}</h4>
                  <p className="text-gray-500 text-[11px] truncate">{bn.subtitle}</p>
                </div>
                <button onClick={() => deleteBanner(bn.id)} className="p-2 text-rose-500 hover:bg-rose-100 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: STORE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs max-w-2xl space-y-6">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-600" /> Store Configuration & Currency
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Store Name</label>
              <input
                value={tempSettings.storeName}
                onChange={(e) => setTempSettings({ ...tempSettings, storeName: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Currency Symbol</label>
                <input
                  value={tempSettings.currency}
                  onChange={(e) => setTempSettings({ ...tempSettings, currency: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  value={tempSettings.taxRate}
                  onChange={(e) => setTempSettings({ ...tempSettings, taxRate: Number(e.target.value) })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Flat Shipping Fee ({tempSettings.currency})</label>
                <input
                  type="number"
                  value={tempSettings.shippingFee}
                  onChange={(e) => setTempSettings({ ...tempSettings, shippingFee: Number(e.target.value) })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Free Shipping Threshold</label>
                <input
                  type="number"
                  value={tempSettings.freeShippingThreshold}
                  onChange={(e) => setTempSettings({ ...tempSettings, freeShippingThreshold: Number(e.target.value) })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            {/* FAMPAY & UPI PAYMENT LINKING SECTION */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-indigo-900 text-xs flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-indigo-600" /> FamPay / UPI ID & Custom QR Setup
                </h4>
                <span className="text-[10px] bg-indigo-200/70 text-indigo-900 px-2 py-0.5 rounded-md font-bold">Online Payment</span>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Your FamPay / UPI VPA ID</label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210@fampay or yourname@fam"
                  value={tempSettings.upiVpa || ''}
                  onChange={(e) => setTempSettings({ ...tempSettings, upiVpa: e.target.value })}
                  className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[10px] text-indigo-700 mt-1">Is UPI ID par customers dwara checkout ke waqt pay kiya jayega.</p>
              </div>

              {/* Custom QR Code Upload & Preview */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">Upload Custom QR Code Photo (FamPay / PhonePe / GPay)</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 bg-white border border-dashed border-indigo-300 hover:border-indigo-500 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-2 shadow-2xs">
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <span>Upload QR Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrFileUpload}
                      className="hidden"
                    />
                  </label>
                  
                  {tempSettings.customQrUrl && (
                    <button
                      type="button"
                      onClick={() => setTempSettings({ ...tempSettings, customQrUrl: '' })}
                      className="text-rose-600 hover:underline font-bold text-xs"
                    >
                      Remove Custom QR
                    </button>
                  )}
                </div>

                {/* QR Code Preview */}
                {tempSettings.customQrUrl && (
                  <div className="mt-2.5 p-2 bg-white border border-indigo-100 rounded-xl inline-block">
                    <p className="text-[10px] font-bold text-gray-500 mb-1">Current Store QR Code Preview:</p>
                    <img src={tempSettings.customQrUrl} alt="Store QR Code" className="w-28 h-28 object-contain rounded-lg border border-gray-100" />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md">
                Save Store Settings
              </button>
              {settingsSaved && <span className="text-emerald-600 font-bold text-xs">Settings updated successfully!</span>}
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ORDER DETAILS */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 relative shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-gray-400 font-medium">Order Details:</span>
                <h3 className="font-mono font-bold text-indigo-600 text-base">{selectedOrderDetails.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-2xl">
              <div>
                <span className="text-gray-400 font-semibold">Customer:</span>
                <p className="font-bold text-gray-900">{selectedOrderDetails.customerName}</p>
                <p className="text-gray-500">{selectedOrderDetails.customerEmail}</p>
              </div>
              <div>
                <span className="text-gray-400 font-semibold">Tracking #:</span>
                <p className="font-mono font-bold text-gray-900">{selectedOrderDetails.trackingNumber}</p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <h4 className="font-bold text-gray-800">Purchased Items ({selectedOrderDetails.items.length})</h4>
              {selectedOrderDetails.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                  <img src={item.image} alt={item.productName} className="w-10 h-10 rounded-lg object-cover bg-white shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{item.productName}</p>
                    <p className="text-gray-500">
                      {item.quantity} × {settings.currency}{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className="font-bold text-gray-900">
                    {settings.currency}{(item.quantity * item.price).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm font-black">
              <span>Total Paid ({selectedOrderDetails.paymentMethod.toUpperCase()})</span>
              <span className="text-indigo-600">
                {settings.currency}{selectedOrderDetails.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 relative shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto text-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-base">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Name</label>
                <input
                  required
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price ({settings.currency})</label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Compare Price</label>
                  <input
                    type="number"
                    value={prodForm.compareAtPrice}
                    onChange={(e) => setProdForm({ ...prodForm, compareAtPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-gray-800 text-xs">Category</label>
                    <span className="text-[10px] text-indigo-600 font-bold">Choose OR Type</span>
                  </div>
                  <div className="space-y-1.5">
                    <select
                      value={prodForm.category}
                      onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                      className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-xs"
                    >
                      <option value="">-- Choose Existing Category --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Or type custom category name..."
                      value={prodForm.category}
                      onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                      className="w-full p-2 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-gray-800 text-xs">Brand / Type</label>
                    <span className="text-[10px] text-indigo-600 font-bold">Choose OR Type</span>
                  </div>
                  <div className="space-y-1.5">
                    <select
                      value={prodForm.brand}
                      onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })}
                      className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-xs"
                    >
                      <option value="">-- Choose Existing Brand --</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Or type custom brand/type name..."
                      value={prodForm.brand}
                      onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })}
                      className="w-full p-2 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Product Images Upload & Selector Section */}
              <div className="space-y-2.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    Product Images ({prodForm.images.length})
                  </label>
                  <span className="text-[10px] text-gray-500 font-medium">Upload file, enter URL, or select sample</span>
                </div>

                {/* File Upload Button */}
                <label className="cursor-pointer flex items-center justify-center gap-2 p-2.5 bg-white border border-dashed border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/50 rounded-xl font-bold text-indigo-600 transition-colors shadow-2xs">
                  <Upload className="w-4 h-4 text-indigo-600" />
                  <span>Choose Image File from Computer/Phone</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Paste Direct URL */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 p-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shrink-0 shadow-2xs"
                  >
                    Add URL
                  </button>
                </div>

                {/* Quick Presets */}
                <div>
                  <p className="text-[10px] font-bold text-gray-500 mb-1">Quick Sample Photos:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleProductImages.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!prodForm.images.includes(sample.url)) {
                            setProdForm((prev) => ({ ...prev, images: [...prev.images, sample.url] }));
                          }
                        }}
                        className="px-2 py-1 bg-white border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 shadow-2xs"
                      >
                        {sample.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Thumbnails Gallery */}
                {prodForm.images.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-200">
                    {prodForm.images.map((imgUrl, index) => (
                      <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-white aspect-square flex items-center justify-center shadow-2xs">
                        <img src={imgUrl} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                            Main
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full opacity-90 group-hover:opacity-100 transition-opacity shadow-xs"
                          title="Remove Image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-600 font-semibold pt-1">⚠️ At least 1 image is recommended for the product.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">SKU</label>
                  <input
                    value={prodForm.sku}
                    onChange={(e) => setProdForm({ ...prodForm, sku: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 font-bold text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
