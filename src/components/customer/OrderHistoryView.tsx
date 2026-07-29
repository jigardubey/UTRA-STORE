import React, { useState } from 'react';
import { PackageCheck, Truck, ArrowLeft, Clock, Eye, RefreshCw, FileText } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Order } from '../../types';
import { OrderTrackingModal } from '../OrderTrackingModal';
import { InvoiceModal } from '../InvoiceModal';

interface OrderHistoryViewProps {
  onBack: () => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ onBack }) => {
  const { orders, settings } = useStore();
  const { currentUser, userProfile } = useAuth();
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  // Filter orders strictly belonging to the currently logged in user account
  const activeEmail = (userProfile?.email || currentUser?.email || '').toLowerCase().trim();
  const activeUid = userProfile?.uid || currentUser?.uid;

  const userOrders = orders.filter((o) => {
    // If user is logged in (has email or uid)
    if (activeEmail || activeUid) {
      const orderEmail = (o.customerEmail || '').toLowerCase().trim();
      const matchUid = Boolean(activeUid && o.userId === activeUid);
      const matchEmail = Boolean(activeEmail && orderEmail === activeEmail);
      return matchUid || matchEmail;
    }

    // Guest mode: only show orders placed in this specific guest browser session
    try {
      const guestOrderIds = JSON.parse(localStorage.getItem('guest_order_ids') || '[]');
      return Array.isArray(guestOrderIds) && guestOrderIds.includes(o.id);
    } catch {
      return false;
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-fade-in">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </button>

        <h1 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-indigo-600" /> My Orders ({userOrders.length})
        </h1>
      </div>

      {userOrders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <PackageCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 text-base mb-1">No orders found</h3>
          <p className="text-gray-500 text-xs mb-6">You haven't placed any orders yet.</p>
          <button onClick={onBack} className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 text-xs">
                <div>
                  <span className="text-gray-500 font-medium">Order ID: </span>
                  <strong className="text-gray-900 font-mono">{order.id}</strong>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Placed on: </span>
                  <strong className="text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      order.orderStatus === 'delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : order.orderStatus === 'shipped' || order.orderStatus === 'out_for_delivery'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {order.orderStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <img src={item.image} alt={item.productName} className="w-12 h-12 rounded-xl object-cover bg-gray-50 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{item.productName}</h4>
                      <p className="text-gray-500">Qty: {item.quantity} × {settings.currency}{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer & Tracking CTA */}
              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-gray-500 font-medium">Total Paid: </span>
                  <strong className="text-indigo-600 text-sm font-black">
                    {settings.currency}{order.total.toLocaleString('en-IN')}
                  </strong>
                  <span className="text-[10px] text-gray-400 font-semibold ml-2 uppercase">({order.paymentMethod})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedOrderForInvoice(order)}
                    className="py-2 px-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-indigo-600" /> GST Invoice
                  </button>
                  <button
                    onClick={() => setSelectedOrderForTracking(order)}
                    className="py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Truck className="w-4 h-4 text-indigo-600" /> Track Package
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <OrderTrackingModal
        order={selectedOrderForTracking}
        onClose={() => setSelectedOrderForTracking(null)}
      />

      <InvoiceModal
        order={selectedOrderForInvoice}
        onClose={() => setSelectedOrderForInvoice(null)}
      />
    </div>
  );
};
