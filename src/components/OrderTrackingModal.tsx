import React from 'react';
import { X, PackageCheck, Truck, CheckCircle2, Clock, MapPin, Copy, Check } from 'lucide-react';
import { Order } from '../types';
import { useStore } from '../context/StoreContext';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const { settings } = useStore();
  const [copied, setCopied] = React.useState(false);

  const statuses: Order['orderStatus'][] = [
    'placed',
    'processing',
    'shipped',
    'out_for_delivery',
    'delivered',
  ];

  const currentIdx = statuses.indexOf(order.orderStatus);

  const copyTracking = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 relative shadow-2xl border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Order Status & Live Tracking</h3>
            <p className="text-gray-500 text-xs">Order #{order.id}</p>
          </div>
        </div>

        {/* Tracking Code Bar */}
        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between mb-6 text-xs">
          <div>
            <span className="text-gray-500 block text-[10px] font-semibold uppercase">Tracking Number</span>
            <span className="font-mono font-bold text-gray-900">{order.trackingNumber}</span>
          </div>
          <button
            onClick={copyTracking}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 text-xs font-bold text-gray-700 shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Status Timeline */}
        <div className="py-4 space-y-6 relative before:absolute before:left-4 before:top-6 before:bottom-6 before:w-0.5 before:bg-gray-200">
          <div className="flex items-start gap-4 relative">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center z-10 font-bold text-xs ${
                currentIdx >= 0 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              ✓
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xs">Order Placed</h4>
              <p className="text-gray-500 text-[11px]">We received your order and payment confirmation.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 relative">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center z-10 font-bold text-xs ${
                currentIdx >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {currentIdx >= 1 ? '✓' : '2'}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xs">Processing & Packaging</h4>
              <p className="text-gray-500 text-[11px]">Items packed and quality checked at store hub.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 relative">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center z-10 font-bold text-xs ${
                currentIdx >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {currentIdx >= 2 ? '✓' : '3'}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xs">In Transit / Shipped</h4>
              <p className="text-gray-500 text-[11px]">Handed over to express courier partner.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 relative">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center z-10 font-bold text-xs ${
                currentIdx >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {currentIdx >= 3 ? '✓' : '4'}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xs">Out For Delivery</h4>
              <p className="text-gray-500 text-[11px]">Delivery executive assigned and arriving today.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 relative">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center z-10 font-bold text-xs ${
                currentIdx >= 4 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {currentIdx >= 4 ? '✓' : '5'}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xs">Package Delivered</h4>
              <p className="text-gray-500 text-[11px]">Delivered to {order.shippingAddress.fullName}.</p>
            </div>
          </div>
        </div>

        {/* Items Summary in Order */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="font-bold text-gray-900 text-xs mb-2">Order Items ({order.items.length})</h4>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center gap-2">
                  <img src={item.image} alt={item.productName} className="w-8 h-8 rounded-md object-cover" />
                  <span className="font-medium text-gray-800 truncate max-w-[220px]">
                    {item.productName} (x{item.quantity})
                  </span>
                </div>
                <span className="font-bold text-gray-900">
                  {settings.currency}{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
