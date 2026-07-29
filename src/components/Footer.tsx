import React, { useState } from 'react';
import { Shield, Truck, RefreshCw, Lock, Phone, Mail, MapPin, MessageSquare, FileText } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PolicyModal } from './PolicyModal';

export const Footer: React.FC = () => {
  const { settings } = useStore();
  const [policyTab, setPolicyTab] = useState<'privacy' | 'terms' | 'refund' | 'security' | null>(null);

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
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">FamPay & UPI Secure</h4>
            <p className="text-[11px] text-slate-400">256-bit SSL encrypted checkout</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Owner Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        {/* Col 1: Store Intro & Owner */}
        <div className="space-y-3">
          <h3 className="text-white font-black text-base">{settings.storeName.split(' - ')[0]}</h3>
          <p className="text-slate-400 leading-relaxed">
            Your destination for premium electronics, smart wearables, fashion drops, and daily lifestyle essentials.
          </p>

          <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl space-y-2">
            <div className="font-bold text-white text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Store Manager: Jigar Dubey
            </div>
            <div className="space-y-1 text-slate-300 text-[11px]">
              <a href="tel:8601509472" className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono font-bold">+91 8601509472</span>
              </a>
              <a href="https://wa.me/918601509472" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: +91 8601509472</span>
              </a>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>jigardubey2806@gmail.com</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Varanasi, UP, India</span>
              </div>
            </div>
          </div>
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
          <h4 className="text-white font-semibold uppercase text-xs tracking-wider mb-3">Customer Service & Policies</h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => setPolicyTab('refund')} className="hover:text-white transition-colors text-left">
                Returns & Refunds Policy
              </button>
            </li>
            <li>
              <button onClick={() => setPolicyTab('privacy')} className="hover:text-white transition-colors text-left">
                Privacy Policy & Security
              </button>
            </li>
            <li>
              <button onClick={() => setPolicyTab('terms')} className="hover:text-white transition-colors text-left">
                Terms & Conditions
              </button>
            </li>
            <li>
              <button onClick={() => setPolicyTab('security')} className="hover:text-amber-300 transition-colors text-left font-bold text-slate-300">
                Merchant Trust & Certification
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold uppercase text-xs tracking-wider mb-3">Accepted Payment Gateways</h4>
          <p className="text-slate-400 mb-3">We accept all major payment methods including Instant FamPay UPI QR, Credit/Debit cards, Netbanking, and Cash on Delivery.</p>
          <div className="flex flex-wrap gap-2 text-[10px] font-bold">
            <span className="px-2 py-1 bg-slate-800 text-indigo-300 rounded-md border border-slate-700">FamPay UPI</span>
            <span className="px-2 py-1 bg-slate-800 text-emerald-300 rounded-md border border-slate-700">GPay / PhonePe</span>
            <span className="px-2 py-1 bg-slate-800 text-amber-300 rounded-md border border-slate-700">Razorpay</span>
            <span className="px-2 py-1 bg-slate-800 text-blue-300 rounded-md border border-slate-700">Cards & Banking</span>
            <span className="px-2 py-1 bg-slate-800 text-gray-300 rounded-md border border-slate-700">COD</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>© {new Date().getFullYear()} <strong className="text-slate-300 font-bold">UTRA STORE</strong>. All rights reserved.</div>
        <div>Owner: <span className="text-slate-300 font-bold">Jigar Dubey</span> (+91 8601509472)</div>
      </div>

      <PolicyModal
        isOpen={Boolean(policyTab)}
        onClose={() => setPolicyTab(null)}
        initialTab={policyTab || 'privacy'}
      />
    </footer>
  );
};
