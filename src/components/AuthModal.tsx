import React, { useState } from 'react';
import { X, Mail, Lock, User, KeyRound, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { loginWithEmail, signupWithEmail, loginWithGoogle, resetPassword, loginAsGuest, toggleAdminOverride } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup' | 'reset'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
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
        setMessage('Password reset link sent to your email!');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setError('Google Sign-In failed.');
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    onClose();
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

        {/* Tab Headers */}
        <div className="flex border-b border-gray-100 mb-6 font-bold text-sm">
          <button
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`pb-2 mr-6 transition-colors ${
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
            className={`pb-2 mr-6 transition-colors ${
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {tab === 'signup' && (
            <div>
              <label className="block font-bold text-gray-700 mb-1">Your Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
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
                className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Admin Email: jigardubey811@gmail.com</p>
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
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-2"
          >
            {loading
              ? 'Processing...'
              : tab === 'login'
              ? 'Sign In to Store'
              : tab === 'signup'
              ? 'Register Account'
              : 'Send Reset Link'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5 text-center text-[10px] text-gray-400 uppercase tracking-wider font-bold">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <span className="relative bg-white px-3">Or continue with</span>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleGoogle}
            className="w-full py-2.5 px-4 border border-gray-200 rounded-xl font-bold text-xs text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
          >
            <span className="text-base">🌐</span> Sign in with Google
          </button>

          <button
            onClick={handleGuest}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" /> Instant Guest Mode (Browse Catalog)
          </button>

          <button
            type="button"
            onClick={() => {
              toggleAdminOverride();
              onClose();
            }}
            className="w-full py-2 px-4 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" /> Demo Admin Mode (1-Click Access)
          </button>
        </div>
      </div>
    </div>
  );
};
