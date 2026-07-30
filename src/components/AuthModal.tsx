import React, { useState } from 'react';
import { X, Mail, Lock, User, KeyRound, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const {
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    resetPassword,
    loginAsGuest,
    loginAsAdminWithPin,
  } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup' | 'reset'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [authAttempts, setAuthAttempts] = useState<number[]>([]);

  // Admin PIN prompt state
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Rate limiting: max 5 attempts per minute
    const now = Date.now();
    const recentAttempts = authAttempts.filter((t) => now - t < 60000);
    if (recentAttempts.length >= 5) {
      setError('Too many authentication attempts. Please wait 1 minute before trying again.');
      return;
    }
    setAuthAttempts([...recentAttempts, now]);
    setLoading(true);

    try {
      if (tab === 'login') {
        await loginWithEmail(email, password);
        onClose();
      } else if (tab === 'signup') {
        await signupWithEmail(email, password, name || 'Customer');
        onClose();
      } else if (tab === 'reset') {
        await resetPassword(email);
        setMessage('Password reset link processed successfully.');
      }
    } catch (err: any) {
      setError('Authentication request could not be completed. Please check your details or try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      if (email.trim()) {
        await loginWithGoogle(email.trim());
        onClose();
        return;
      }
      await loginWithGoogle(undefined);
      onClose();
    } catch (err: any) {
      if (email.trim()) {
        try {
          await loginWithGoogle(email.trim());
          onClose();
        } catch (e: any) {
          setError(e.message || 'Google Login process failed.');
        }
      } else {
        setError('Google popup iframe me blocked/constrained hai. Apni Email address box me type karein aur Continue with Google pe click karein!');
      }
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    onClose();
  };

  const handleAdminPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    const success = loginAsAdminWithPin(adminPin);
    if (success) {
      setShowAdminPinModal(false);
      setAdminPin('');
      onClose();
    } else {
      setPinError('Incorrect Secret Admin PIN. Access Denied.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {showAdminPinModal ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mb-3 shadow-md">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Store Owner Admin Access</h2>
              <p className="text-xs text-slate-500 mt-1">Enter your secret 4-digit Owner PIN to access Admin Dashboard</p>
            </div>

            {pinError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 mb-4 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <form onSubmit={handleAdminPinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Owner Secret PIN</label>
                <input
                  type="password"
                  required
                  maxLength={10}
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Enter Secret PIN..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-lg font-mono font-bold tracking-widest focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" /> Verify & Access Admin Dashboard
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAdminPinModal(false);
                  setPinError('');
                  setAdminPin('');
                }}
                className="w-full py-2 text-xs font-bold text-gray-500 hover:text-gray-800"
              >
                ← Back to Customer Login
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Header Title */}
            <div className="mb-4 text-center">
              <div className="w-10 h-10 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl mb-2">
                U
              </div>
              <h2 className="text-xl font-black text-gray-900">UTRA STORE Account</h2>
              <p className="text-xs text-gray-500">Sign in to track orders and save preferences</p>
            </div>

            {/* Tab Headers */}
            <div className="flex border-b border-gray-100 mb-6 font-bold text-xs justify-center">
              <button
                onClick={() => {
                  setTab('login');
                  setError('');
                }}
                className={`pb-2 px-4 transition-colors ${
                  tab === 'login' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setTab('signup');
                  setError('');
                }}
                className={`pb-2 px-4 transition-colors ${
                  tab === 'signup' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl mb-4 font-semibold">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {tab === 'signup' && (
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Your Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                      placeholder="e.g. Customer Name"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                    placeholder="you@example.com"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              {tab !== 'reset' && (
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="font-bold text-gray-700">Password</label>
                    {tab === 'login' && (
                      <button
                        type="button"
                        onClick={() => setTab('reset')}
                        className="text-[11px] text-indigo-600 font-bold hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      placeholder="••••••••"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-1"
              >
                {loading
                  ? 'Logging in...'
                  : tab === 'login'
                  ? 'Sign In to UTRA STORE'
                  : tab === 'signup'
                  ? 'Register Account'
                  : 'Send Reset Link'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4 text-center text-[10px] text-gray-400 uppercase tracking-wider font-bold">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <span className="relative bg-white px-3 text-indigo-600 font-extrabold">Instant Login</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleGoogle}
                className="w-full py-2.5 px-4 border border-gray-200 rounded-xl font-bold text-xs text-gray-800 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <span className="text-base">🌐</span> Continue with Google
              </button>

              <button
                onClick={handleGuest}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Guest Mode (Instant Browse)
              </button>
            </div>

            {/* Discrete Admin Link */}
            <div className="mt-5 pt-3 border-t border-gray-100 text-center">
              <button
                type="button"
                onClick={() => setShowAdminPinModal(true)}
                className="text-[11px] text-gray-400 hover:text-indigo-600 font-semibold inline-flex items-center gap-1 transition-colors"
              >
                <KeyRound className="w-3 h-3" /> Store Admin Access
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
