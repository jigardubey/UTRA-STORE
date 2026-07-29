import React, { useState } from 'react';
import { X, Shield, Lock, FileText, RotateCcw, CheckCircle2, Phone } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'refund' | 'security';
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, initialTab = 'privacy' }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'refund' | 'security'>(initialTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
              U
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-base">UTRA STORE Legal & Privacy Center</h3>
              <p className="text-[11px] text-gray-500">Customer Protection & Official Store Policies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Tabs */}
        <div className="flex border-b border-gray-200 mt-4 text-xs font-bold gap-2 overflow-x-auto pb-1 shrink-0">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('refund')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'refund'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" /> 7-Day Refund Policy
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-300" /> Merchant Trust
          </button>
        </div>

        {/* Tab Body */}
        <div className="mt-4 overflow-y-auto pr-2 text-xs text-gray-700 space-y-4 leading-relaxed flex-1">
          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>Your data is 100% private. UTRA STORE never sells or shares your personal info or phone numbers.</span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm">1. Collection of Personal Information</h4>
              <p>
                When you browse or place an order on UTRA STORE, we only collect information necessary to fulfill your delivery: your name, shipping address, email address, and phone number for courier updates.
              </p>
              <h4 className="font-bold text-gray-900 text-sm">2. Payment Data & Security</h4>
              <p>
                All online payments via UPI QR, GPay, PhonePe, or Razorpay are processed directly via bank-grade 256-bit SSL encrypted channels. UTRA STORE does not store sensitive credit card numbers or banking PINs on its servers.
              </p>
              <h4 className="font-bold text-gray-900 text-sm">3. Order Updates & Support</h4>
              <p>
                We use your phone number exclusively for WhatsApp order confirmations, delivery tracking SMS, and direct support by store owner Jigar Dubey (+91 8601509472).
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 text-sm">1. Terms of Shopping on UTRA STORE</h4>
              <p>
                By accessing UTRA STORE, you agree to comply with our store guidelines. All products listed are authentic with official brand warranty.
              </p>
              <h4 className="font-bold text-gray-900 text-sm">2. Order Processing & Pricing</h4>
              <p>
                Prices listed include all applicable taxes (GST). Orders are dispatched within 24 hours of payment or COD confirmation.
              </p>
              <h4 className="font-bold text-gray-900 text-sm">3. Cash on Delivery (COD) Rules</h4>
              <p>
                For Cash on Delivery orders, delivery verification may be conducted via phone or WhatsApp (+91 8601509472) prior to shipping.
              </p>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-3">
              <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-2xl">
                <p className="font-bold">7-Day Easy Return & Instant Replacement Guarantee</p>
                <p className="text-[11px] text-indigo-700">If your package arrives damaged, defective, or incorrect, receive a free replacement or instant full refund.</p>
              </div>
              <h4 className="font-bold text-gray-900 text-sm">How to Request a Return:</h4>
              <ol className="list-decimal pl-5 space-y-1.5 text-gray-700">
                <li>Contact Jigar Dubey on WhatsApp (+91 8601509472) or email <strong>jigardubey2806@gmail.com</strong>.</li>
                <li>Share your Order ID and photo/video of the unboxing.</li>
                <li>Our courier partner will pick up the item from your doorstep free of cost.</li>
                <li>Refunds are credited back to your UPI or Bank Account within 24 hours of pickup.</li>
              </ol>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-black text-amber-400">
                  <Shield className="w-5 h-5" /> UTRA STORE Certified Verified Merchant
                </div>
                <p className="text-xs text-slate-300">
                  UTRA STORE is owned and operated by <strong>Jigar Dubey</strong>.
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  Location: Varanasi, Uttar Pradesh, India | Contact: +91 8601509472
                </p>
              </div>
              <p className="text-gray-600 text-xs">
                We prioritize buyer trust and transparent business practices. Every purchase comes with an official GST Tax Invoice and dedicated customer support.
              </p>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs shrink-0">
          <span className="text-gray-500 font-medium flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-indigo-600" /> Support: +91 8601509472
          </span>
          <button
            onClick={onClose}
            className="py-2 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
          >
            Close Policy Window
          </button>
        </div>
      </div>
    </div>
  );
};
