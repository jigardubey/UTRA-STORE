import React from 'react';
import { Shield, Truck, RefreshCw, Headphones, CreditCard, Lock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings } = useStore();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      {/* Value Proposition Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Fast Delivery</h4>
            <p className="text-[11px] text-slate-400">Free express over {settings.currency}{settings.freeShippingThreshold}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Authentic Products</h4>
            <p className="text-[11px] text-slate-400">100% Verified Brand Warranty</p>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">7 Days Return</h4>
            <p className="text-[11px] text-slate-400">Hassle-free instant replacement</p>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Razorpay & UPI Secure</h4>
            <p className="text-[11px] text-slate-400">256-bit SSL encrypted checkout</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        <div>
          <h3 className="text-white font-bold text-base mb-3">{settings.storeName.split(' - ')[0]}</h3>
          <p className="text-slate-400 leading-relaxed mb-4">
            Your destination for premium electronics, fashion drops, smart wearables, and daily lifestyle essentials.
          </p>
          <p className="text-slate-500 font-medium">Customer Support: support@{settings.storeName.toLowerCase().replace(/[^a-z]/g, '')}.com</p>
        </div>

        <div>
          <h4 className="text-white font-semibold uppercase text-xs tracking-wider mb-3">Shop Categories</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Mobiles & Tablets</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Electronics & Audio</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Fashion & Apparel</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Smartwatches & Accessories</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold uppercase text-xs tracking-wider mb-3">Customer Service</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Track Your Order</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Shipping & Delivery Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Returns & Refunds</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service & Privacy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold uppercase text-xs tracking-wider mb-3">Accepted Payment Gateways</h4>
          <p className="text-slate-400 mb-3">We accept all major payment methods including Instant UPI QR, Credit/Debit cards, Netbanking, and Cash on Delivery.</p>
          <div className="flex flex-wrap gap-2 text-[10px] font-bold">
            <span className="px-2 py-1 bg-slate-800 text-indigo-300 rounded-md border border-slate-700">Razorpay</span>
            <span className="px-2 py-1 bg-slate-800 text-emerald-300 rounded-md border border-slate-700">UPI / BHIM</span>
            <span className="px-2 py-1 bg-slate-800 text-amber-300 rounded-md border border-slate-700">GPay / PhonePe</span>
            <span className="px-2 py-1 bg-slate-800 text-blue-300 rounded-md border border-slate-700">VISA / MasterCard</span>
            <span className="px-2 py-1 bg-slate-800 text-gray-300 rounded-md border border-slate-700">COD</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500">
        © {new Date().getFullYear()} {settings.storeName.split(' - ')[0]}. Built with Firebase Firestore & React.
      </div>
    </footer>
  );
};
