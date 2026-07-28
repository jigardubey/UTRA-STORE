import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Send,
  Star,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  User,
  ShieldCheck,
  HelpCircle,
  ThumbsUp,
  Award,
} from 'lucide-react';

interface FeedbackItem {
  id: string;
  name: string;
  phone: string;
  rating: number;
  message: string;
  date: string;
  verified?: boolean;
}

export const ContactFaqFeedback: React.FC = () => {
  // Feedback Form State
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackPhone, setFeedbackPhone] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Initial Sample Feedbacks
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([
    {
      id: '1',
      name: 'Anand Sharma',
      phone: '983******1',
      rating: 5,
      message: 'FamPay QR se instant payment ho gaya aur order 2 din me deliver ho gaya. Jigar Dubey bhai support par bohot responsive hain!',
      date: 'Yesterday',
      verified: true,
    },
    {
      id: '2',
      name: 'Priya Verma',
      phone: '870******4',
      rating: 5,
      message: 'Product quality ekdam original aur premium hai. PhonePe payment effortless tha.',
      date: '3 days ago',
      verified: true,
    },
    {
      id: '3',
      name: 'Rohan Gupta',
      phone: '912******8',
      rating: 5,
      message: 'Fastest delivery service in Uttar Pradesh! Call par saari information mil gayi.',
      date: '1 week ago',
      verified: true,
    },
  ]);

  // FAQ Accordion Toggle
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How can I pay using FamPay / UPI QR code on this store?',
      a: 'During checkout, choose the "Online Payment / UPI QR" option. Scan the store QR code using FamPay, PhonePe, Google Pay, or Paytm, or enter our UPI VPA (jigardubey@fampay). Payment receives automatic instant verification.',
    },
    {
      q: 'How do I contact store manager Jigar Dubey for instant order help?',
      a: 'You can directly call or WhatsApp store manager Jigar Dubey at +91 8601509472 between 9:00 AM and 10:00 PM daily. We assist with order updates, product inquiries, and custom requests.',
    },
    {
      q: 'Is Cash on Delivery (COD) available for my pincode?',
      a: 'Yes! Cash on Delivery is available across all major pincodes in India. Select COD at checkout to pay in cash upon package delivery.',
    },
    {
      q: 'How long does shipping take and how can I track my package?',
      a: 'Orders are processed within 24 hours. Delivery takes 2 to 4 business days depending on location. You can track your order status in real-time under "My Orders" or "Track Order" in the top menu.',
    },
    {
      q: 'What is the return and refund policy?',
      a: 'We offer a 7-day hassle-free replacement and return guarantee for defective or damaged items. Simply contact +91 8601509472 or submit feedback below.',
    },
    {
      q: 'Are online payments 100% safe on this website?',
      a: 'Yes, all online transactions are 256-bit SSL encrypted via verified Razorpay & direct UPI banking channels. Your sensitive data is never stored or shared.',
    },
  ];

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName.trim() || !feedbackMsg.trim()) return;

    const newFeedback: FeedbackItem = {
      id: Date.now().toString(),
      name: feedbackName.trim(),
      phone: feedbackPhone ? `${feedbackPhone.slice(0, 3)}******${feedbackPhone.slice(-1)}` : 'Verified Buyer',
      rating: feedbackRating,
      message: feedbackMsg.trim(),
      date: 'Just now',
      verified: true,
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    setFeedbackName('');
    setFeedbackPhone('');
    setFeedbackRating(5);
    setFeedbackMsg('');
    setSubmittedSuccess(true);

    setTimeout(() => {
      setSubmittedSuccess(false);
    }, 5000);
  };

  return (
    <div className="mt-16 space-y-12 pt-12 border-t border-gray-200">
      {/* 1. STORE OWNER & CONTACT DETAILS CARD */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          {/* Owner Profile & Info */}
          <div className="space-y-4 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Store Owner & Customer Support
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Jigar Dubey</h2>
              <p className="text-indigo-200 text-xs sm:text-sm font-medium mt-1">
                Founder & Managing Director — UTRA STORE India
              </p>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              aapke sabhi orders, payments, aur delivery queries ke liye hum hamesha available hain. kisi bhi sahayata ke liye direct call ya WhatsApp karein.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/80 rounded-lg text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> FamPay / UPI Verified
              </span>
              <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/80 rounded-lg text-[11px] font-semibold text-indigo-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 9 AM - 10 PM Everyday
              </span>
              <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/80 rounded-lg text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Varanasi, UP, India
              </span>
            </div>
          </div>

          {/* Direct Action Contact Buttons */}
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 w-full lg:w-80 shrink-0 space-y-3.5">
            <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider border-b border-slate-700 pb-2">
              Direct Contact Details
            </div>

            <a
              href="tel:8601509472"
              className="flex items-center gap-3 p-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-md group"
            >
              <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <div>
                <span className="block text-[10px] text-emerald-100 font-medium uppercase">Call Jigar Dubey</span>
                <span className="text-sm font-mono">+91 8601509472</span>
              </div>
            </a>

            <a
              href="https://wa.me/918601509472?text=Hello%20Jigar%20Dubey%20bhai,%20mujhe%20order%20ke%20regarding%20help%20chahiye."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl text-xs transition-colors group"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <div>
                <span className="block text-[10px] text-emerald-200 font-medium uppercase">Chat on WhatsApp</span>
                <span className="text-xs font-mono">+91 8601509472</span>
              </div>
            </a>

            <div className="pt-1 space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">jigardubey2806@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Varanasi, Uttar Pradesh, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FREQUENTLY ASKED QUESTIONS (Q&A) SECTION */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions (Q&A)
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">Have Questions? We Have Answers</h2>
          <p className="text-gray-500 text-xs sm:text-sm">
            Everything you need to know about placing orders, FamPay UPI payments, shipping, and direct support.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all shadow-2xs hover:border-indigo-300"
            >
              <button
                type="button"
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-gray-800 text-xs sm:text-sm flex items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors"
              >
                <span className="flex items-start gap-2.5">
                  <span className="text-indigo-600 font-extrabold shrink-0">Q{idx + 1}.</span>
                  <span>{faq.q}</span>
                </span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </button>

              {openFaqIndex === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. FEEDBACK FORM & CUSTOMER REVIEWS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Submit Feedback Form */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Customer Feedback
            </span>
            <h3 className="text-lg font-black text-gray-900 mt-2">Send Us Your Review & Feedback</h3>
            <p className="text-xs text-gray-500 mt-1">
              Your feedback helps us continuously improve product quality and store service!
            </p>
          </div>

          {submittedSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Thank you! Your review has been submitted successfully and listed below.</span>
            </div>
          )}

          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={feedbackName}
                onChange={(e) => setFeedbackName(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={feedbackPhone}
                  onChange={(e) => setFeedbackPhone(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Store Rating *</label>
                <div className="flex items-center gap-1 pt-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= feedbackRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Your Feedback / Review Message *</label>
              <textarea
                required
                rows={3}
                placeholder="Share your experience about order speed, product quality, or payment..."
                value={feedbackMsg}
                onChange={(e) => setFeedbackMsg(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Store Feedback
            </button>
          </form>
        </div>

        {/* Right: Recent Customer Feedbacks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-indigo-600" /> Recent Customer Reviews ({feedbacks.length})
            </h3>
            <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> 4.9 / 5 Overall Rating
            </span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {feedbacks.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-2 hover:border-indigo-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                        {item.name}
                        {item.verified && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                            Verified Buyer
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-mono">{item.phone}</p>
                    </div>
                  </div>

                  <span className="text-[10px] text-gray-400">{item.date}</span>
                </div>

                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs text-gray-700 leading-relaxed italic">"{item.message}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
