import React, { useState } from 'react';
import {
  Bot,
  X,
  Send,
  MessageSquare,
  Phone,
  Clock,
  ShieldCheck,
  PackageCheck,
  RefreshCw,
  Sparkles,
  ExternalLink,
  UserCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

interface AICustomerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  showOwnerHandoff?: boolean;
  orderIdRef?: string;
  timestamp: string;
}

export const AICustomerSupportModal: React.FC<AICustomerSupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { orders } = useStore();
  const { userProfile, currentUser } = useAuth();

  const userEmail = (userProfile?.email || currentUser?.email || '').toLowerCase().trim();
  const userOrders = orders.filter((o) => (o.customerEmail || '').toLowerCase().trim() === userEmail);
  const latestOrder = userOrders[0];

  const ownerPhone = '+918601509472';
  const ownerName = 'Jigar Dubey';

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: `Hello! 👋 I am **UTRA STORE AI Assistant**. How can I help you today?\n\nI can track your orders, explain FamPay/UPI payments, or connect you directly with store owner **Jigar Dubey** (+91 8601509472).`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleQuickPrompt = (promptText: string) => {
    handleSendMessage(promptText);
  };

  const handleSendMessage = (customText?: string) => {
    const query = (customText || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const q = query.toLowerCase();
      let responseText = '';
      let showHandoff = false;

      if (q.includes('track') || q.includes('order') || q.includes('status') || q.includes('kahan hai')) {
        if (latestOrder) {
          responseText = `📦 **Order Status Found:**\n\n- **Order ID:** #${latestOrder.id}\n- **Current Status:** ${latestOrder.orderStatus.toUpperCase().replace(/_/g, ' ')}\n- **Tracking Code:** ${latestOrder.trackingNumber || 'UTR-882910'}\n\nYour order is currently processing/in transit with our partner courier.`;
        } else {
          responseText = `📦 You don't have any active orders under your email (${userEmail || 'guest'}). If you placed an order with a different phone/email, Jigar Dubey can search it manually!`;
          showHandoff = true;
        }
      } else if (q.includes('fampay') || q.includes('upi') || q.includes('payment') || q.includes('qr')) {
        responseText = `💳 **FamPay & UPI Payment Info:**\n\n1. At checkout, select **Online Payment / UPI QR**.\n2. Scan the store QR code using FamPay, GPay, or PhonePe, or pay to VPA **jigardubey@fampay**.\n3. Orders are verified and confirmed automatically!`;
      } else if (q.includes('return') || q.includes('refund') || q.includes('replace')) {
        responseText = `🛡️ **7-Day Easy Return Guarantee:**\n\nIf your product is damaged or defective, we offer 100% free pickup and replacement within 7 days. Click below to contact owner Jigar Dubey with your unboxing video.`;
        showHandoff = true;
      } else if (q.includes('owner') || q.includes('jigar') || q.includes('talk') || q.includes('human') || q.includes('call')) {
        responseText = `👨‍💼 **Connecting to Store Owner Jigar Dubey:**\n\nI have prepared your request details. Click the green WhatsApp button below to open a direct chat with **Jigar Dubey** (+91 8601509472).\n\n*Please wait for owner reply once message is sent.*`;
        showHandoff = true;
      } else {
        responseText = `🤖 I have recorded your message: "${query}".\n\nFor custom assistance, I am forwarding your message directly to store owner **Jigar Dubey** (+91 8601509472). Click below to send on WhatsApp!`;
        showHandoff = true;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: responseText,
        showOwnerHandoff: showHandoff,
        orderIdRef: latestOrder?.id,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const getOwnerWhatsAppLink = (customText?: string, orderId?: string) => {
    const text = customText || 'I need support regarding my UTRA STORE order.';
    const oId = orderId || latestOrder?.id || 'General Inquiry';
    const message = `Hello Jigar Dubey Sir! 👋
UTRA STORE Customer Support Ticket
Order ID: #${oId}
Issue / Inquiry: ${text}

(Sent via UTRA STORE AI Assistant - Wait for owner reply)`;

    return `https://wa.me/918601509472?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[85vh] flex flex-col relative shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md relative">
              <Bot className="w-6 h-6" />
              <div className="w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 absolute -bottom-0.5 -right-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-white text-base">UTRA STORE AI Assistant</h3>
                <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-300 text-[10px] font-bold rounded-full border border-indigo-400/30">
                  24/7 AI
                </span>
              </div>
              <p className="text-[11px] text-slate-300 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-amber-300" /> Managed by Jigar Dubey (+91 8601509472)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Help Chips */}
        <div className="p-3 bg-indigo-50/60 border-b border-indigo-100/80 flex gap-2 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => handleQuickPrompt('Where is my order / Track Package')}
            className="px-3 py-1.5 bg-white hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl border border-indigo-200 shadow-2xs whitespace-nowrap flex items-center gap-1"
          >
            <PackageCheck className="w-3.5 h-3.5" /> Track My Order
          </button>
          <button
            onClick={() => handleQuickPrompt('FamPay and UPI payment help')}
            className="px-3 py-1.5 bg-white hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl border border-indigo-200 shadow-2xs whitespace-nowrap flex items-center gap-1"
          >
            💳 FamPay Payment Help
          </button>
          <button
            onClick={() => handleQuickPrompt('Talk to store owner Jigar Dubey')}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-2xs whitespace-nowrap flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" /> Talk to Jigar Dubey
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-xs font-medium'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200/60'
                }`}
              >
                {m.text}

                {/* Owner WhatsApp Handoff CTA Button */}
                {m.showOwnerHandoff && (
                  <div className="mt-3 pt-3 border-t border-gray-200/80 space-y-2">
                    <p className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Need human reply from Jigar Dubey?
                    </p>
                    <a
                      href={getOwnerWhatsAppLink(m.text, m.orderIdRef)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-sm text-xs transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" /> Message Jigar Dubey (+91 8601509472)
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <p className="text-[10px] text-gray-500 text-center italic">
                      (After messaging on WhatsApp, please wait for owner reply)
                    </p>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">{m.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-gray-400 text-xs italic p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>UTRA STORE AI is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-white border-t border-gray-100 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask AI about orders, shipping, or payments..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
