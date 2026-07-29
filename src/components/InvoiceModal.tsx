import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck, Phone, Mail } from 'lucide-react';
import { Order } from '../types';
import { useStore } from '../context/StoreContext';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const { settings } = useStore();

  const handlePrint = () => {
    window.print();
  };

  const gstNumber = "09ABCDE1234F1Z5"; // UTRA STORE sample GSTIN
  const taxRate = 0.18; // 18% GST calculation
  const taxableAmount = Math.round(order.subtotal / (1 + taxRate));
  const gstAmount = order.subtotal - taxableAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in print:bg-white print:p-0 print:static">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto print:shadow-none print:border-none print:max-h-none print:p-0">
        
        {/* Modal Actions (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Official GST Tax Invoice
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Header */}
        <div className="space-y-6 text-gray-800">
          <div className="flex justify-between items-start border-b border-gray-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl">
                  U
                </div>
                <span className="text-xl font-black text-gray-900 tracking-tight">UTRA STORE</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Official E-Commerce Store</p>
              <p className="text-[11px] text-gray-500 font-mono mt-1">GSTIN: {gstNumber}</p>
              <p className="text-[11px] text-gray-500">Manager: Jigar Dubey (+91 8601509472)</p>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-lg border border-emerald-200 uppercase inline-block mb-2">
                PAID INVOICE
              </span>
              <h2 className="text-xs text-gray-400 font-bold uppercase tracking-wider">Invoice #</h2>
              <p className="font-mono font-bold text-gray-900 text-sm">{order.id}</p>
              <p className="text-xs text-gray-500 mt-1">
                Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
            <div>
              <h4 className="font-bold text-gray-900 uppercase text-[10px] tracking-wider mb-1 text-indigo-600">Billed To</h4>
              <p className="font-bold text-gray-800">{order.customerName}</p>
              <p className="text-gray-600 font-mono text-[11px]">{order.customerEmail}</p>
              <p className="text-gray-600 mt-0.5">{order.shippingAddress.phone}</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 uppercase text-[10px] tracking-wider mb-1 text-indigo-600">Shipping Address</h4>
              <p className="text-gray-700 leading-relaxed">
                {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} - {order.shippingAddress.zipCode}
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px]">
                  <th className="py-2 font-bold">Item Description</th>
                  <th className="py-2 text-center font-bold">Qty</th>
                  <th className="py-2 text-right font-bold">Unit Price</th>
                  <th className="py-2 text-right font-bold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="py-3">
                    <td className="py-3 pr-2">
                      <p className="font-bold text-gray-900">{item.productName}</p>
                    </td>
                    <td className="py-3 text-center text-gray-700 font-bold">{item.quantity}</td>
                    <td className="py-3 text-right text-gray-600 font-mono">
                      {settings.currency}{item.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-right font-bold text-gray-900 font-mono">
                      {settings.currency}{(item.price * item.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown & Totals */}
          <div className="pt-4 border-t border-gray-200 flex justify-between items-start text-xs">
            <div className="space-y-1.5 max-w-xs">
              <p className="text-[11px] text-gray-500">
                <strong className="text-gray-700">Payment Mode:</strong> {order.paymentMethod.toUpperCase()} (Confirmed)
              </p>
              <p className="text-[11px] text-gray-500">
                <strong className="text-gray-700">Tracking Code:</strong> {order.trackingNumber || 'UTR-882910'}
              </p>
              <p className="text-[10px] text-gray-400 italic mt-2">
                This is a computer-generated tax invoice for UTRA STORE orders. No signature required.
              </p>
            </div>

            <div className="w-48 space-y-2 text-right">
              <div className="flex justify-between text-gray-600">
                <span>Taxable Amount:</span>
                <span className="font-mono">{settings.currency}{taxableAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (18% Included):</span>
                <span className="font-mono">{settings.currency}{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee:</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>Grand Total:</span>
                <span className="text-indigo-600 font-mono">{settings.currency}{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer Contact & Trust Notice */}
          <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl text-[11px] flex flex-wrap items-center justify-between gap-2 mt-6">
            <div>
              <p className="font-bold text-white">Need help with this order?</p>
              <p className="text-slate-400">Call/WhatsApp Jigar Dubey: +91 8601509472</p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" /> 100% Authentic Product Guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
