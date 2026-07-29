import React, { useState } from 'react';
import { X, MapPin, CreditCard, CheckCircle2, Truck, ShieldCheck, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { Address, Order } from '../types';
import { RazorpayModal } from './RazorpayModal';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
  onOpenAuthModal?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted,
  onOpenAuthModal,
}) => {
  if (!isOpen) return null;

  const { cart, subtotal, discountAmount, shippingFee, total, clearCart } = useCart();
  const { userProfile, currentUser } = useAuth();
  const { placeOrder, settings } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState<Address>({
    id: 'addr-1',
    fullName: userProfile?.displayName || currentUser?.displayName || '',
    phone: userProfile?.phone || '9876543210',
    street: '42 MG Road, Sector 14',
    city: 'Bengaluru',
    state: 'Karnataka',
    zipCode: '560001',
  });

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'qr' | 'cod'>('razorpay');
  const [razorpayModalOpen, setRazorpayModalOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateOrder = async (
    paymentDetails?: { method: 'razorpay' | 'upi' | 'qr'; transactionId: string }
  ) => {
    if (!currentUser && !userProfile) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    setIsSubmitting(true);
    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0],
    }));

    const activeUid = userProfile?.uid || currentUser?.uid || 'user-' + Date.now();
    const activeEmail = userProfile?.email || currentUser?.email || 'customer@utrastore.com';
    const activeName = address.fullName || userProfile?.displayName || currentUser?.displayName || 'Valued Customer';

    const newOrder = await placeOrder({
      userId: activeUid,
      customerEmail: activeEmail,
      customerName: activeName,
      shippingAddress: address,
      items: orderItems,
      subtotal,
      discount: discountAmount,
      shippingFee,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'placed',
      trackingNumber: '',
    });

    try {
      const existingGuestOrders = JSON.parse(localStorage.getItem('guest_order_ids') || '[]');
      localStorage.setItem('guest_order_ids', JSON.stringify([...existingGuestOrders, newOrder.id]));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    clearCart();
    setCompletedOrder(newOrder);
    setIsSubmitting(false);
    setStep(3);
    onOrderCompleted(newOrder);
  };

  const handleProceedPayment = () => {
    if (!currentUser && !userProfile) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    if (paymentMethod === 'razorpay' || paymentMethod === 'upi' || paymentMethod === 'qr') {
      setRazorpayModalOpen(true);
    } else {
      // Cash on Delivery
      handleCreateOrder();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Stepper Bar */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div
              className={`flex items-center gap-2 text-xs font-bold ${
                step >= 1 ? 'text-indigo-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                }`}
              >
                1
              </div>
              <span>Shipping Address</span>
            </div>
            <div className={`h-0.5 w-12 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            <div
              className={`flex items-center gap-2 text-xs font-bold ${
                step >= 2 ? 'text-indigo-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                }`}
              >
                2
              </div>
              <span>Payment</span>
            </div>
            <div className={`h-0.5 w-12 ${step === 3 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            <div
              className={`flex items-center gap-2 text-xs font-bold ${
                step === 3 ? 'text-indigo-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  step === 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                }`}
              >
                3
              </div>
              <span>Confirmation</span>
            </div>
          </div>

          {/* STEP 1: Shipping Address */}
          {step === 1 && (
            <div className="space-y-4">
              {!currentUser && !userProfile && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in">
                  <div className="flex items-center gap-2 text-amber-900 font-semibold">
                    <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <strong className="block text-amber-900 font-bold">Login Required to Place Order</strong>
                      <span className="text-[11px] text-amber-800">Order book karne ke liye kripya pehle Sign In / Register karein.</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenAuthModal}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs"
                  >
                    Sign In / Register
                  </button>
                </div>
              )}

              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" /> Shipping & Delivery Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mobile Phone Number</label>
                  <input
                    type="text"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="10 digit phone number"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Street Address / House No.</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="Street name, apartment, landmark"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">State / Pincode</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-1/2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                      placeholder="State"
                    />
                    <input
                      type="text"
                      value={address.zipCode}
                      onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                      className="w-1/2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                      placeholder="Pincode"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => {
                    if (!currentUser && !userProfile) {
                      if (onOpenAuthModal) onOpenAuthModal();
                    } else {
                      setStep(2);
                    }
                  }}
                  disabled={!address.fullName || !address.street}
                  className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
                >
                  <span>{!currentUser && !userProfile ? 'Sign In / Register to Pay' : 'Continue to Payment'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Select Payment Method */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" /> Select Payment Method
              </h3>

              <div className="grid grid-cols-1 gap-3">
                <div
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'razorpay'
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm">
                      R
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">Razorpay Instant Gateway</h4>
                      <p className="text-gray-500 text-[11px]">UPI, Cards, Netbanking & Wallets</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Recommended
                  </span>
                </div>

                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'upi'
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                      UPI
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">UPI ID / Google Pay / PhonePe</h4>
                      <p className="text-gray-500 text-[11px]">Pay directly via UPI application</p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'cod'
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                      COD
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">Cash on Delivery</h4>
                      <p className="text-gray-500 text-[11px]">Pay cash upon doorstep package delivery</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Block */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Items Total</span>
                  <span className="font-bold">{settings.currency}{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-{settings.currency}{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Charges</span>
                  <span>{shippingFee === 0 ? 'FREE' : `${settings.currency}${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                  <span>Payable Amount</span>
                  <span className="text-indigo-600">{settings.currency}{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-800"
                >
                  ← Back to Address
                </button>
                <button
                  onClick={handleProceedPayment}
                  disabled={isSubmitting}
                  className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
                >
                  <span>{paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Confirmation */}
          {step === 3 && completedOrder && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-black text-gray-900">Order Placed Successfully!</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Thank you for shopping with us! We have sent an email confirmation to{' '}
                <strong className="text-gray-800">{completedOrder.customerEmail}</strong>.
              </p>

              {/* Order Box */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Order ID</span>
                  <span className="font-bold text-indigo-600">{completedOrder.id}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Tracking Number</span>
                  <span className="font-mono font-bold text-gray-900">{completedOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Total Amount</span>
                  <span className="font-bold text-emerald-600">
                    {settings.currency}{completedOrder.total.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Address</span>
                  <span className="font-medium text-gray-800 truncate max-w-[200px]">
                    {completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.city}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="py-3 px-6 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Embedded Razorpay Modal Overlay */}
      <RazorpayModal
        isOpen={razorpayModalOpen}
        amount={total}
        customerName={address.fullName}
        customerEmail={currentUser?.email || 'customer@store.com'}
        onSuccess={(paymentDetails) => {
          setRazorpayModalOpen(false);
          handleCreateOrder(paymentDetails);
        }}
        onClose={() => setRazorpayModalOpen(false)}
      />
    </>
  );
};
