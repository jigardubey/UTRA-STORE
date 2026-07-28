import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, QrCode, CreditCard, Landmark, Smartphone, Lock, X, RefreshCw } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface RazorpayModalProps {
  isOpen: boolean;
  amount: number;
  customerName: string;
  customerEmail: string;
  onSuccess: (paymentDetails: { method: 'razorpay' | 'upi' | 'qr'; transactionId: string }) => void;
  onClose: () => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  amount,
  customerName,
  customerEmail,
  onSuccess,
  onClose,
}) => {
  if (!isOpen) return null;

  const { settings } = useStore();
  const [activeTab, setActiveTab] = useState<'upi' | 'qr' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('user@okicici');
  const [cardDetails, setCardDetails] = useState({ number: '4532 •••• •••• 8892', exp: '12/28', cvv: '•••' });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        const txnId = 'pay_' + Math.random().toString(36).substring(2, 12);
        onSuccess({
          method: activeTab === 'qr' ? 'qr' : activeTab === 'upi' ? 'upi' : 'razorpay',
          transactionId: txnId,
        });
      }, 1200);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 relative">
        {/* Gateway Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-md">
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Razorpay Secure Gateway</span>
              </div>
              <h3 className="font-bold text-white text-base truncate">{settings.storeName.split(' - ')[0]}</h3>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-blue-200 uppercase font-semibold">Total Payable</p>
            <p className="text-xl font-black text-emerald-400">
              {settings.currency}{amount.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Processing or Success State */}
        {processing ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <h4 className="font-bold text-gray-900 text-lg mb-1">Processing Payment...</h4>
            <p className="text-gray-500 text-xs">Authenticating with Bank / UPI network securely.</p>
          </div>
        ) : success ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
            <h4 className="font-bold text-gray-900 text-xl mb-1">Payment Successful!</h4>
            <p className="text-gray-500 text-xs">Redirecting to order confirmation...</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6 gap-2">
              <button
                onClick={() => setActiveTab('upi')}
                className={`flex-1 py-2 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'upi'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Smartphone className="w-4 h-4" /> UPI Apps
              </button>
              <button
                onClick={() => setActiveTab('qr')}
                className={`flex-1 py-2 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'qr'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <QrCode className="w-4 h-4" /> Scan QR
              </button>
              <button
                onClick={() => setActiveTab('card')}
                className={`flex-1 py-2 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'card'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Card
              </button>
              <button
                onClick={() => setActiveTab('netbanking')}
                className={`flex-1 py-2 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'netbanking'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Landmark className="w-4 h-4" /> NetBanking
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'upi' && (
              <div className="space-y-4">
                {settings.upiVpa && (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-indigo-600 font-bold uppercase block">Merchant FamPay / UPI ID</span>
                      <strong className="font-mono text-indigo-900 text-sm">{settings.upiVpa}</strong>
                    </div>
                    <span className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold">Verified</span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-gray-700">
                  <div className="p-3 bg-gray-50 border border-indigo-100 rounded-xl hover:border-indigo-500 cursor-pointer">
                    <span className="block text-lg">💬</span> Google Pay
                  </div>
                  <div className="p-3 bg-gray-50 border border-indigo-100 rounded-xl hover:border-indigo-500 cursor-pointer">
                    <span className="block text-lg">🟣</span> PhonePe
                  </div>
                  <div className="p-3 bg-gray-50 border border-indigo-100 rounded-xl hover:border-indigo-500 cursor-pointer">
                    <span className="block text-lg">🔷</span> FamPay / Paytm
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your VPA / UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="mobile@fampay or username@okaxis"
                  />
                </div>
              </div>
            )}

            {activeTab === 'qr' && (
              <div className="text-center py-2 space-y-3">
                <p className="text-xs font-semibold text-gray-600">Scan this QR code using FamPay, GPay, PhonePe, or Paytm</p>
                
                <div className="w-48 h-48 bg-white p-2.5 rounded-2xl border-2 border-indigo-500 shadow-md mx-auto flex flex-col items-center justify-center relative overflow-hidden">
                  {settings.customQrUrl ? (
                    <img src={settings.customQrUrl} alt="Store Payment QR Code" className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <div className="w-full h-full bg-slate-900 p-2 rounded-xl text-white flex flex-col items-center justify-center text-center font-mono text-[9px] gap-1">
                      <QrCode className="w-16 h-16 text-emerald-400" />
                      <span className="font-bold">FAMPAY / UPI QR</span>
                      <span className="text-[8px] text-indigo-300 font-mono">{settings.upiVpa || 'merchant@fampay'}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs font-mono font-bold text-indigo-900 bg-indigo-50 py-1.5 px-3 rounded-lg inline-block">
                  UPI VPA: {settings.upiVpa || 'merchant@fampay'}
                </p>

                <p className="text-[11px] text-emerald-600 font-bold">Auto-detecting payment receipt...</p>
              </div>
            )}

            {activeTab === 'card' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardDetails.exp}
                      onChange={(e) => setCardDetails({ ...cardDetails, exp: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'netbanking' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Select Your Bank</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Yes Bank'].map(
                    (bank) => (
                      <button
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                          selectedBank === bank
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        🏦 {bank}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Pay Button */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handlePay}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Pay {settings.currency}{amount.toLocaleString('en-IN')} Now</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
