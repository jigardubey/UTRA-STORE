import React, { useState } from 'react';
import { X, PackageCheck, Truck, CheckCircle2, Clock, MapPin, Copy, Check, Sparkles, MessageSquare, ExternalLink } from 'lucide-react';
import { Order } from '../types';
import { useStore } from '../context/StoreContext';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const { settings } = useStore();
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const statuses: Order['orderStatus'][] = [
    'placed',
    'processing',
    'shipped',
    'out_for_delivery',
    'delivered',
  ];

  const currentIdx = statuses.indexOf(order.orderStatus);

  const copyTracking = () => {
    navigator.clipboard.writeText(order.trackingNumber || 'UTR-882910');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefreshCourierStatus = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  // Generate dynamic courier checkpoint logs
  const getCourierCheckpoints = () => {
    const orderDate = new Date(order.createdAt);
    const tracking = order.trackingNumber || 'UTR-882910';

    const checkpoints = [
      {
        title: 'Order Verified & Payment Received',
        location: 'UTRA STORE Order Hub (Varanasi)',
        time: orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: currentIdx >= 0,
      },
      {
        title: 'Supplier Packaged Item & Dispatched',
        location: 'Dropshipping Partner Facility',
        time: 'Within 12 hours of order',
        completed: currentIdx >= 1,
      },
      {
        title: `Handed to Express Courier (${tracking})`,
        location: 'In Transit via Express Logistics',
        time: 'Courier AWB Code Active',
        completed: currentIdx >= 2,
      },
      {
        title: 'Out For Delivery with Local Executive',
        location: `${order.shippingAddress.city} Delivery Hub`,
        time: 'Expected Delivery Today',
        completed: currentIdx >= 3,
      },
      {
        title: 'Order Delivered Successfully',
        location: `${order.shippingAddress.street}, ${order.shippingAddress.city}`,
        time: 'Handed to Customer',
        completed: currentIdx >= 4,
      },
    ];

    return checkpoints;
  };

  const checkpoints = getCourierCheckpoints();

  const ownerWhatsAppMessage = `Hello Jigar Dubey Sir! 👋
I need assistance with live courier tracking for my Order #${order.id}.
Tracking Code: ${order.trackingNumber || 'UTR-882910'}
Current Status: ${order.orderStatus.toUpperCase()}

(Sent via UTRA STORE Live Tracking - Wait for owner reply)`;

  const ownerWhatsAppUrl = `https://wa.me/918601509472?text=${encodeURIComponent(ownerWhatsAppMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 relative shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
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
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              AI Live Courier Tracking
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md uppercase">
                {order.orderStatus.replace(/_/g, ' ')}
              </span>
            </h3>
            <p className="text-gray-500 text-xs">Order #{order.id}</p>
          </div>
        </div>

        {/* Tracking Code Bar */}
        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between mb-6 text-xs">
          <div>
            <span className="text-gray-500 block text-[10px] font-semibold uppercase">Courier AWB / Tracking Code</span>
            <span className="font-mono font-bold text-gray-900 text-sm">{order.trackingNumber || 'UTR-882910'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRefreshCourierStatus}
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-600"
              title="Refresh Live Status"
            >
              <Sparkles className={`w-3.5 h-3.5 text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={copyTracking}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy AWB'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic AI Status Checkpoints Timeline */}
        <div className="py-2 space-y-5 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-200">
          {checkpoints.map((cp, idx) => (
            <div key={idx} className="flex items-start gap-4 relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 font-bold text-xs shrink-0 transition-colors ${
                  cp.completed ? 'bg-indigo-600 text-white shadow-xs' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {cp.completed ? '✓' : idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`font-bold text-xs ${cp.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                    {cp.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 font-mono">{cp.time}</span>
                </div>
                <p className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-indigo-500" /> {cp.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Support Handoff Card */}
        <div className="mt-6 p-4 bg-slate-900 text-white rounded-2xl text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-400" /> Need delivery assistance?
            </span>
            <span className="text-[10px] text-slate-400">Jigar Dubey (+91 8601509472)</span>
          </div>
          <p className="text-slate-300 text-[11px]">
            If your package is delayed or you need delivery driver contact details, message store manager Jigar Dubey on WhatsApp directly.
          </p>
          <a
            href={ownerWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <MessageSquare className="w-4 h-4" /> Ask Jigar Dubey on WhatsApp (Wait for Owner Reply)
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Items Summary in Order */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="font-bold text-gray-900 text-xs mb-2">Order Items ({order.items.length})</h4>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center gap-2">
                  <img src={item.image} alt={item.productName} className="w-8 h-8 rounded-md object-cover border border-gray-200" />
                  <span className="font-medium text-gray-800 truncate max-w-[220px]">
                    {item.productName} (x{item.quantity})
                  </span>
                </div>
                <span className="font-bold text-gray-900 font-mono">
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
