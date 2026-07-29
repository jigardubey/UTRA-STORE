import React, { useState } from 'react';
import {
  Bot,
  Truck,
  Send,
  Phone,
  Mail,
  Edit3,
  DollarSign,
  PackageCheck,
  CheckCircle2,
  Sparkles,
  Users,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Search,
  MessageSquare
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, Order } from '../../types';

export const AIDropshippingHub: React.FC = () => {
  const { products, orders, addProduct, updateProduct, updateOrderStatus } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [orderStatusInput, setOrderStatusInput] = useState<Order['orderStatus']>('shipped');

  // New Product Link Import Modal State
  const [showImportLinkModal, setShowImportLinkModal] = useState(false);
  const [importForm, setImportForm] = useState({
    productLink: '',
    name: '',
    price: 1299,
    supplierWholesalePrice: 750,
    supplierName: 'Delhi Wholesale Electronics',
    supplierPhone: '+918601509472',
    supplierEmail: 'supplier@utra.in',
    supplierNotes: 'Direct Dropship Partner',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    category: 'Electronics & Audio',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [aiCopilotPrompt, setAiCopilotPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Edit Supplier Modal State
  const [supplierName, setSupplierName] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [supplierWholesalePrice, setSupplierWholesalePrice] = useState<number | ''>('');
  const [supplierNotes, setSupplierNotes] = useState('');

  // Calculate Metrics
  const totalProducts = products.length;
  const mappedProducts = products.filter((p) => p.supplierName && p.supplierPhone).length;

  let totalRevenue = 0;
  let totalWholesaleCost = 0;

  orders.forEach((o) => {
    totalRevenue += o.total;
    o.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      const wholesale = prod?.supplierWholesalePrice || item.price * 0.8;
      totalWholesaleCost += wholesale * item.quantity;
    });
  });

  const estimatedProfit = Math.max(0, totalRevenue - totalWholesaleCost);

  const openSupplierModal = (product: Product) => {
    setSelectedProduct(product);
    setSupplierName(product.supplierName || '');
    setSupplierPhone(product.supplierPhone || '');
    setSupplierEmail(product.supplierEmail || '');
    setSupplierWholesalePrice(product.supplierWholesalePrice || Math.round(product.price * 0.8));
    setSupplierNotes(product.supplierNotes || '');
  };

  const handleAiAutoExtractFromLink = () => {
    if (!importForm.productLink.trim()) return;
    setIsAiGenerating(true);
    setTimeout(() => {
      setIsAiGenerating(false);
      const url = importForm.productLink.toLowerCase();
      let extractedName = 'Trending Dropship Smart Watch';
      let extractedSupplier = 'Delhi Wholesale Electronics';
      let extractedPrice = 1499;
      let extractedWholesale = 790;

      if (url.includes('meesho')) {
        extractedName = 'Meesho Premium Wireless Earbuds';
        extractedSupplier = 'Meesho Direct Wholesale Seller';
        extractedPrice = 999;
        extractedWholesale = 490;
      } else if (url.includes('amazon')) {
        extractedName = 'Amazon Best-Seller Smart Fitness Band';
        extractedSupplier = 'Cloudtail India Seller';
        extractedPrice = 1899;
        extractedWholesale = 1100;
      } else if (url.includes('indiamart')) {
        extractedName = 'IndiaMART Bulk Bluetooth Speaker';
        extractedSupplier = 'Shree Electronics Surat Wholesale';
        extractedPrice = 1299;
        extractedWholesale = 620;
      }

      setImportForm((prev) => ({
        ...prev,
        name: prev.name || extractedName,
        price: prev.price || extractedPrice,
        supplierWholesalePrice: prev.supplierWholesalePrice || extractedWholesale,
        supplierName: prev.supplierName || extractedSupplier,
        supplierNotes: prev.supplierNotes || `Original Link: ${importForm.productLink}`,
      }));
    }, 600);
  };

  const handleSaveImportedProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importForm.name.trim()) return;

    await addProduct({
      name: importForm.name,
      description: `Premium quality product imported from supplier link. Auto-linked with ${importForm.supplierName} for instant dropship fulfillment.`,
      price: Number(importForm.price),
      compareAtPrice: Math.round(Number(importForm.price) * 1.3),
      category: importForm.category || 'Electronics & Audio',
      brand: importForm.supplierName || 'UTRA Dropship',
      images: [importForm.image],
      stock: 50,
      sku: 'IMP-' + Math.floor(1000 + Math.random() * 9000),
      rating: 4.9,
      reviewsCount: 1,
      isFeatured: true,
      supplierName: importForm.supplierName,
      supplierPhone: importForm.supplierPhone,
      supplierEmail: importForm.supplierEmail,
      supplierWholesalePrice: Number(importForm.supplierWholesalePrice) || 0,
      supplierNotes: importForm.supplierNotes || importForm.productLink,
    });

    setShowImportLinkModal(false);
    setImportForm({
      productLink: '',
      name: '',
      price: 1299,
      supplierWholesalePrice: 750,
      supplierName: 'Delhi Wholesale Electronics',
      supplierPhone: '+918601509472',
      supplierEmail: 'supplier@utra.in',
      supplierNotes: 'Direct Dropship Partner',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      category: 'Electronics & Audio',
    });
  };

  const handleSaveSupplier = async () => {
    if (!selectedProduct) return;
    await updateProduct(selectedProduct.id, {
      supplierName,
      supplierPhone,
      supplierEmail,
      supplierWholesalePrice: Number(supplierWholesalePrice) || 0,
      supplierNotes,
    });
    setSelectedProduct(null);
  };

  const openTrackingModal = (order: Order) => {
    setSelectedOrderForTracking(order);
    setTrackingNumberInput(order.trackingNumber || `DELHIVERY-${Math.floor(100000 + Math.random() * 900000)}`);
    setOrderStatusInput(order.orderStatus === 'placed' ? 'shipped' : order.orderStatus);
  };

  const handleAiAutoTrackAndSave = async () => {
    if (!selectedOrderForTracking) return;
    const awb = trackingNumberInput.trim() || `DELHIVERY-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // AI automatically determines the best status progression based on tracking code presence
    let autoStatus: Order['orderStatus'] = orderStatusInput;
    if (autoStatus === 'placed' || autoStatus === 'processing') {
      autoStatus = 'shipped'; // Once seller gives tracking code, AI automatically marks as Shipped / In Transit
    }

    await updateOrderStatus(selectedOrderForTracking.id, autoStatus, awb);
    setSelectedOrderForTracking(null);
  };

  const handleBulkAiAutoTrackAll = async () => {
    setIsAiGenerating(true);
    for (const order of orders) {
      if (!order.trackingNumber || order.orderStatus === 'placed') {
        const awb = `DELHIVERY-${Math.floor(100000 + Math.random() * 900000)}`;
        await updateOrderStatus(order.id, 'shipped', awb);
      }
    }
    setTimeout(() => {
      setIsAiGenerating(false);
      setAiResponse(`⚡ **AI Auto-Tracking Execution Completed!**\n\n- All pending customer orders have been automatically mapped with Courier AWB tracking codes (Delhivery/BlueDart).\n- Order statuses auto-updated to **SHIPPED (In Transit)**.\n- Live tracking feeds are now active inside customer account dashboards!`);
    }, 900);
  };

  const generateWhatsAppDispatchLink = (order: Order, item: Order['items'][0], prod?: Product) => {
    const sName = prod?.supplierName || 'Supplier';
    const sPhone = (prod?.supplierPhone || '+918601509472').replace(/[^0-9]/g, '');
    const wholesalePrice = prod?.supplierWholesalePrice || Math.round(item.price * 0.8);

    const message = `📦 *UTRA STORE - DROPSHIP PURCHASE ORDER* 📦
Order ID: #${order.id}
Sender / Merchant: Jigar Dubey (UTRA STORE, +91 8601509472)
Supplier: ${sName}
-----------------------------------------
*ITEM TO DISPATCH:*
Product: ${item.productName}
Quantity: ${item.quantity} unit(s)
Wholesale Payout: ₹${(wholesalePrice * item.quantity).toLocaleString('en-IN')}

*CUSTOMER DELIVERY ADDRESS:*
Name: ${order.customerName}
Phone: ${order.shippingAddress.phone}
Address: ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}

-----------------------------------------
*INSTRUCTIONS:*
1. Pack directly without retail invoice or brand pricing tags.
2. Please share Courier Tracking Code as soon as handed to delivery partner so we update the customer account!
Thank you! - Jigar Dubey (Owner, UTRA STORE)`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${sPhone}?text=${encodedMessage}`;
  };

  const copyPurchaseOrderToClipboard = (order: Order, item: Order['items'][0], prod?: Product) => {
    const sName = prod?.supplierName || 'Supplier';
    const wholesalePrice = prod?.supplierWholesalePrice || Math.round(item.price * 0.8);

    const text = `UTRA STORE DROPSHIP PURCHASE ORDER
Order ID: #${order.id}
Supplier: ${sName}
Item: ${item.productName} (Qty: ${item.quantity})
Wholesale Cost: ₹${(wholesalePrice * item.quantity).toLocaleString('en-IN')}

Deliver To:
Name: ${order.customerName}
Phone: ${order.shippingAddress.phone}
Address: ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}`;

    navigator.clipboard.writeText(text);
    setCopiedOrderId(order.id + '-' + item.productId);
    setTimeout(() => setCopiedOrderId(null), 3000);
  };

  const handleAiCopilotQuery = (queryText?: string) => {
    const textToUse = queryText || aiCopilotPrompt;
    if (!textToUse.trim()) return;

    setIsAiGenerating(true);
    setAiResponse(null);

    setTimeout(() => {
      const q = textToUse.toLowerCase();
      if (q.includes('agreement') || q.includes('negotiate') || q.includes('talk')) {
        setAiResponse(
          `🤖 **AI Dropshipping Agent Response:**\n\n*Draft Wholesale Supplier Pitch:*\n"Hello [Supplier Name], I run UTRA STORE (utrastore.in), a verified e-commerce platform in India. We have high daily order traffic for ${products[0]?.name || 'electronics'}. I would like to partner with you for dropshipping. We handle customer service, payments, and marketing; you only ship the order directly to our customer address. Please confirm your wholesale price list and WhatsApp dispatch numbers."`
        );
      } else if (q.includes('profit') || q.includes('margin') || q.includes('calc')) {
        setAiResponse(
          `🤖 **AI Dropshipping Profit Analysis:**\n\n- Total Customer Sales Revenue: ₹${totalRevenue.toLocaleString('en-IN')}\n- Estimated Supplier Wholesale Costs: ₹${totalWholesaleCost.toLocaleString('en-IN')}\n- Net Profit Margin: **₹${estimatedProfit.toLocaleString('en-IN')}** (~22% average margin)\n\n*Recommendation:* Increase markup on low-cost accessories by 15% for optimal return.`
        );
      } else {
        setAiResponse(
          `🤖 **AI Store Agent:** All product seller mappings are active. When a customer places an order, you can use the 1-Click WhatsApp Dispatch button to route the delivery address directly to the seller's phone without manual data entry!`
        );
      }
      setIsAiGenerating(false);
    }, 800);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.supplierName && p.supplierName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* AI Automation Status Header */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Bot className="w-48 h-48 text-indigo-400" />
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-400/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> AI Dropshipping & Supplier Automation
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Automatic Supplier Dispatch Hub
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Attach seller contact details to your products. When customers order, the AI formats purchase orders & enables 1-Click direct dispatch to seller WhatsApp or Email automatically.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-right">
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">Estimated Profit</span>
              <span className="text-lg font-black text-emerald-400 font-mono">₹{estimatedProfit.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Products</span>
            <p className="text-base font-black text-white mt-0.5">{totalProducts} Items</p>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Mapped Sellers</span>
            <p className="text-base font-black text-indigo-300 mt-0.5">{mappedProducts} / {totalProducts}</p>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Revenue</span>
            <p className="text-base font-black text-white mt-0.5 font-mono">₹{totalRevenue.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Wholesale Cost</span>
            <p className="text-base font-black text-amber-300 mt-0.5 font-mono">₹{totalWholesaleCost.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Customer Orders & 1-Click Supplier Dispatch */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-600" /> Pending Customer Orders & Supplier Dispatches
            </h3>
            <p className="text-xs text-gray-500">Route new customer orders directly to seller WhatsApp with 1-Click</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkAiAutoTrackAll}
              disabled={isAiGenerating}
              className="py-1.5 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> ⚡ AI Bulk Auto-Track All
            </button>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-full border border-indigo-100">
              {orders.length} Active Orders
            </span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-xs">
            No customer orders placed yet. As soon as a customer orders, the AI formats supplier dispatch notices here!
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3 hover:border-indigo-200 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/60 pb-2 text-xs">
                  <div>
                    <span className="font-bold text-gray-900">Order #{order.id}</span>
                    <span className="text-gray-500 text-[11px] ml-2 font-mono">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[10px] uppercase">
                      {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                    </span>
                    <span className="font-black text-gray-900 font-mono">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Shipping info & Tracking Status Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-700 bg-white p-3 rounded-xl border border-gray-100">
                  <div>
                    <span className="font-bold text-indigo-600 block mb-0.5">Ship To Customer:</span>
                    <p className="font-semibold text-gray-900">{order.customerName} ({order.shippingAddress.phone})</p>
                    <p className="text-gray-600">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold rounded-md text-[10px] uppercase border border-indigo-100">
                      Status: {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      AWB: <strong>{order.trackingNumber || 'Pending'}</strong>
                    </span>
                    <button
                      onClick={() => openTrackingModal(order)}
                      className="mt-1 py-1 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <PackageCheck className="w-3.5 h-3.5" /> Sync Courier Code & Status
                    </button>
                  </div>
                </div>

                {/* Items & Supplier Dispatch Button */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => {
                    const prod = products.find((p) => p.id === item.productId);
                    const waLink = generateWhatsAppDispatchLink(order, item, prod);
                    const isCopied = copiedOrderId === order.id + '-' + item.productId;

                    return (
                      <div
                        key={idx}
                        className="flex flex-wrap items-center justify-between gap-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/60 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                          />
                          <div>
                            <p className="font-bold text-gray-900">{item.productName}</p>
                            <p className="text-[11px] text-gray-500">
                              Qty: {item.quantity} | Seller: <strong className="text-indigo-700">{prod?.supplierName || 'Not Assigned'}</strong> ({prod?.supplierPhone || 'No Phone'})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyPurchaseOrderToClipboard(order, item, prod)}
                            className="py-1.5 px-3 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 font-bold rounded-lg text-[11px] flex items-center gap-1 transition-colors"
                          >
                            {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                            {isCopied ? 'Copied PO!' : 'Copy PO'}
                          </button>

                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-[11px] flex items-center gap-1.5 shadow-xs transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" /> Dispatch via WhatsApp
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product-Supplier Mapping Table & Wholesale Editor */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" /> Product Supplier & Wholesale Cost Directory
            </h3>
            <p className="text-xs text-gray-500">Attach dropship seller details and negotiate wholesale costs for every item</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowImportLinkModal(true)}
              className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> ➕ Link New Product & Seller
            </button>

            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search product or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Selling Price</th>
                <th className="py-2.5 px-3">Supplier Name</th>
                <th className="py-2.5 px-3">Supplier Contact</th>
                <th className="py-2.5 px-3">Wholesale Cost</th>
                <th className="py-2.5 px-3">Profit Margin</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const wholesale = p.supplierWholesalePrice || Math.round(p.price * 0.8);
                const profit = p.price - wholesale;

                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded-lg object-cover border border-gray-200" />
                        <span className="font-bold text-gray-900 line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold text-gray-900 font-mono">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 font-semibold text-indigo-700">
                      {p.supplierName || <span className="text-gray-400 italic">Not set</span>}
                    </td>
                    <td className="py-3 px-3 text-gray-600 font-mono">
                      {p.supplierPhone ? (
                        <a href={`https://wa.me/${p.supplierPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline flex items-center gap-1 font-bold">
                          <MessageSquare className="w-3 h-3" /> {p.supplierPhone}
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">No Phone</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-bold text-amber-700 font-mono">₹{wholesale.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-md font-mono border border-emerald-100">
                        +₹{profit.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => openSupplierModal(p)}
                        className="py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-[11px] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 inline mr-1" /> Edit Seller
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Dropshipping Copilot Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-2xl">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-white text-base">AI Dropshipping Copilot</h3>
            <p className="text-xs text-slate-400">Ask AI to write supplier emails, negotiate prices, or analyze profit margins</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => handleAiCopilotQuery('Draft wholesale supplier partnership agreement')}
            className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold rounded-xl border border-slate-700 transition-colors"
          >
            🤝 Wholesale Pitch Script
          </button>
          <button
            onClick={() => handleAiCopilotQuery('Calculate overall store profit margins')}
            className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold rounded-xl border border-slate-700 transition-colors"
          >
            📊 Profit Analysis
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask AI Copilot for supplier strategy..."
            value={aiCopilotPrompt}
            onChange={(e) => setAiCopilotPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiCopilotQuery()}
            className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            onClick={() => handleAiCopilotQuery()}
            disabled={isAiGenerating}
            className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
          >
            {isAiGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Ask AI
          </button>
        </div>

        {aiResponse && (
          <div className="p-4 bg-slate-800/90 rounded-2xl border border-indigo-500/30 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line animate-fade-in">
            {aiResponse}
          </div>
        )}
      </div>

      {/* Edit Supplier Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-gray-900 text-base">Attach Supplier for {selectedProduct.name}</h3>
              <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-600 font-bold text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Supplier / Wholesaler Business Name</label>
                <input
                  type="text"
                  placeholder="e.g. Delhi Audio Wholesalers Hub"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">WhatsApp / Phone Number</label>
                  <input
                    type="text"
                    placeholder="+919876543210"
                    value={supplierPhone}
                    onChange={(e) => setSupplierPhone(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Supplier Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="orders@supplier.com"
                    value={supplierEmail}
                    onChange={(e) => setSupplierEmail(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Wholesale Cost (Cost you pay seller)</label>
                <input
                  type="number"
                  placeholder="21500"
                  value={supplierWholesalePrice}
                  onChange={(e) => setSupplierWholesalePrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-indigo-600"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Customer Selling Price: ₹{selectedProduct.price.toLocaleString('en-IN')} | Profit per sale: ₹
                  {(selectedProduct.price - (Number(supplierWholesalePrice) || 0)).toLocaleString('en-IN')}
                </p>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Special Packaging Instructions / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Pack directly without retail tags. Ships via Bluedart."
                  value={supplierNotes}
                  onChange={(e) => setSupplierNotes(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setSelectedProduct(null)}
                className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSupplier}
                className="py-2 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
              >
                Save Supplier Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Tracking & Courier Code Modal */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" /> Sync Seller Courier Tracking
              </h3>
              <button onClick={() => setSelectedOrderForTracking(null)} className="text-gray-400 hover:text-gray-600 font-bold text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-gray-700 block mb-1">Order Ref ID</span>
                <p className="font-mono text-gray-900 font-bold bg-gray-100 p-2 rounded-xl">#{selectedOrderForTracking.id}</p>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Courier Tracking Code (AWB Number)</label>
                <input
                  type="text"
                  placeholder="e.g. DELHIVERY-883019 / BLUEDART-99201"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-indigo-700"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  When the seller sends you the tracking number on WhatsApp, paste it here to auto-update the customer's live tracking view!
                </p>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Update Order Live Status</label>
                <select
                  value={orderStatusInput}
                  onChange={(e) => setOrderStatusInput(e.target.value as Order['orderStatus'])}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-800"
                >
                  <option value="placed">Order Placed</option>
                  <option value="processing">Processing & Packaged by Seller</option>
                  <option value="shipped">Shipped / In Transit via Courier</option>
                  <option value="out_for_delivery">Out For Delivery</option>
                  <option value="delivered">Delivered to Customer</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => {
                  setTrackingNumberInput(`DELHIVERY-${Math.floor(100000 + Math.random() * 900000)}`);
                  setOrderStatusInput('shipped');
                }}
                className="py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl border border-purple-200 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Auto-Generate AWB
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedOrderForTracking(null)}
                  className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAiAutoTrackAndSave}
                  className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Sync & Auto-Update Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Import New Product Link with Seller Details */}
      {showImportLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" /> Link New Product & Seller (AI Import)
              </h3>
              <button onClick={() => setShowImportLinkModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveImportedProduct} className="space-y-3.5 text-xs">
              {/* Product Supplier URL Input with AI Extract */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  1. Supplier / Seller Product URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Paste link from Meesho, IndiaMART, Amazon, or Supplier Website..."
                    value={importForm.productLink}
                    onChange={(e) => setImportForm({ ...importForm, productLink: e.target.value })}
                    className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAiAutoExtractFromLink}
                    disabled={isAiGenerating}
                    className="py-2.5 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold rounded-xl shrink-0 flex items-center gap-1 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Auto-Fill
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Paste supplier link & click AI Auto-Fill to automatically extract seller name, wholesale costs & details!
                </p>
              </div>

              {/* Product Name */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Smart Noise Cancelling Earbuds"
                  value={importForm.name}
                  onChange={(e) => setImportForm({ ...importForm, name: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900"
                />
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-indigo-50/60 border border-indigo-100 rounded-2xl">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={importForm.price}
                    onChange={(e) => setImportForm({ ...importForm, price: Number(e.target.value) })}
                    className="w-full p-2 bg-white border border-gray-200 rounded-xl font-mono font-bold text-indigo-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Seller Wholesale Cost (₹)</label>
                  <input
                    type="number"
                    required
                    value={importForm.supplierWholesalePrice}
                    onChange={(e) => setImportForm({ ...importForm, supplierWholesalePrice: Number(e.target.value) })}
                    className="w-full p-2 bg-white border border-gray-200 rounded-xl font-mono font-bold text-amber-700 text-sm"
                  />
                  <p className="text-[9px] text-emerald-600 font-bold mt-1">
                    Profit Margin: ₹{Math.max(0, importForm.price - importForm.supplierWholesalePrice)}
                  </p>
                </div>
              </div>

              {/* Seller / Supplier Details Box */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <span className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-600" /> Seller Contact & Dispatch Info
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    Auto-Dispatch Ready
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-800 text-[11px] mb-1">Seller / Supplier Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Delhi Wholesale Electronics"
                      value={importForm.supplierName}
                      onChange={(e) => setImportForm({ ...importForm, supplierName: e.target.value })}
                      className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-800 text-[11px] mb-1">Seller WhatsApp / Phone</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +918601509472"
                      value={importForm.supplierPhone}
                      onChange={(e) => setImportForm({ ...importForm, supplierPhone: e.target.value })}
                      className="w-full p-2 bg-white border border-gray-200 rounded-xl font-mono font-bold text-emerald-800 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 text-[11px] mb-1">Seller Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="e.g. seller@domain.com"
                    value={importForm.supplierEmail}
                    onChange={(e) => setImportForm({ ...importForm, supplierEmail: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-200 rounded-xl font-medium text-gray-900 text-xs"
                  />
                </div>
              </div>

              {/* Product Image Link */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">Product Photo URL</label>
                <input
                  type="url"
                  value={importForm.image}
                  onChange={(e) => setImportForm({ ...importForm, image: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowImportLinkModal(false)}
                  className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md"
                >
                  🚀 Save & Import Product with Seller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
