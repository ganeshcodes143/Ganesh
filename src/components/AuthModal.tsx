import React, { useState } from 'react';
import {
  Crown,
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { User } from '../types';
import { RentalStore } from '../services/store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFillDemo = (type: 'admin' | 'customer') => {
    setError(null);
    setActiveTab('login');
    if (type === 'admin') {
      setLoginEmail('admin@royalride.in');
      setLoginPassword('admin123');
    } else {
      setLoginEmail('shiva@royalride.in');
      setLoginPassword('shiva123');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Please provide both email address and password.');
      return;
    }

    try {
      const user = RentalStore.loginUser(loginEmail, loginPassword);
      setSuccessMsg(`Welcome back, ${user.name}!`);
      setTimeout(() => {
        onSuccess(user);
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regName.trim() || !regEmail.trim() || !regMobile.trim() || !regPassword.trim()) {
      setError('Please complete all required fields.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    // Mobile number validation (Indian 10-digit)
    const cleanMobile = regMobile.replace(/[^0-9]/g, '');
    if (cleanMobile.length < 10) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      const newUser = RentalStore.registerUser({
        name: regName.trim(),
        email: regEmail.trim(),
        mobile: `+91 ${cleanMobile.slice(-10)}`,
        password: regPassword,
      });
      setSuccessMsg(`Account successfully registered! Welcome, ${newUser.name}.`);
      setTimeout(() => {
        onSuccess(newUser);
        onClose();
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#151515] border border-[#35312A] rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header with Shiva Car & Bike Rental prominently displayed */}
        <div className="relative bg-gradient-to-r from-[#201A12] via-[#2A2216] to-[#201A12] p-6 text-center border-b border-[#35312A]">
          <button
            onClick={onClose}
            aria-label="Close authentication modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-[#151515]/80 text-[#A6A6A6] hover:text-[#F5F0E8] hover:bg-[#191919] border border-[#35312A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#101010] border border-[#D4AF6A]/60 shadow-lg mb-3">
            <Crown className="w-6 h-6 text-[#D4AF6A]" />
          </div>

          <div className="text-xs uppercase tracking-widest text-[#E8C786] font-semibold flex items-center justify-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-[#D4AF6A]" />
            SHIVA CAR AND BIKE RENTAL
          </div>

          <h2 className="font-serif text-2xl font-bold tracking-wide gold-gradient-text">
            Royal Ride — Luxury on Wheels
          </h2>

          <p className="text-xs text-[#A6A6A6] mt-1 max-w-md mx-auto">
            Log in to manage your luxury vehicle reservations, browse cars &amp; bikes, and enjoy seamless bookings across South India.
          </p>

          {/* Quick Demo Credentials Box - prominently showing Shiva Car and Bike Rental username & password */}
          <div className="mt-4 p-3 bg-[#101010]/90 rounded-xl border border-[#D4AF6A]/40 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#E8C786] uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#D4AF6A]" />
                Demo Credentials (Shiva Car &amp; Bike Rental)
              </span>
              <span className="text-[10px] text-[#A6A6A6]">Tap to Auto-fill</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleFillDemo('admin')}
                className="p-2.5 rounded-lg bg-[#191919] hover:bg-[#252018] border border-[#35312A] hover:border-[#D4AF6A] transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#F5F0E8] group-hover:text-[#D4AF6A]">
                    Shiva Kumar (Fleet Owner)
                  </span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#D4AF6A]/20 text-[#E8C786]">
                    Admin
                  </span>
                </div>
                <div className="text-[11px] text-[#A6A6A6] mt-1 font-mono">
                  Username: <span className="text-[#E8C786]">admin@royalride.in</span>
                </div>
                <div className="text-[11px] text-[#A6A6A6] font-mono">
                  Password: <span className="text-[#E8C786]">admin123</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('customer')}
                className="p-2.5 rounded-lg bg-[#191919] hover:bg-[#252018] border border-[#35312A] hover:border-[#D4AF6A] transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#F5F0E8] group-hover:text-[#D4AF6A]">
                    Shiva Customer Account
                  </span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    User
                  </span>
                </div>
                <div className="text-[11px] text-[#A6A6A6] mt-1 font-mono">
                  Username: <span className="text-[#E8C786]">shiva@royalride.in</span>
                </div>
                <div className="text-[11px] text-[#A6A6A6] font-mono">
                  Password: <span className="text-[#E8C786]">shiva123</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Tab switcher: Login / Register */}
        <div className="flex border-b border-[#35312A] bg-[#101010]">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setError(null);
            }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'login'
                ? 'text-[#D4AF6A] border-b-2 border-[#D4AF6A] bg-[#151515]'
                : 'text-[#A6A6A6] hover:text-[#F5F0E8]'
            }`}
          >
            Sign In to Account
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setError(null);
            }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'register'
                ? 'text-[#D4AF6A] border-b-2 border-[#D4AF6A] bg-[#151515]'
                : 'text-[#A6A6A6] hover:text-[#F5F0E8]'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#F5F0E8] mb-1.5">
                  Email Address / Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A6A6A6] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@royalride.in or shiva@royalride.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#101010] border border-[#35312A] rounded-lg text-sm text-[#F5F0E8] placeholder-[#666] focus:border-[#D4AF6A] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-[#F5F0E8]">Password</label>
                  <span className="text-[11px] text-[#D4AF6A] cursor-pointer hover:underline">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A6A6A6] absolute left-3.5 top-3" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password (e.g. admin123 or shiva123)"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#101010] border border-[#35312A] rounded-lg text-sm text-[#F5F0E8] placeholder-[#666] focus:border-[#D4AF6A] focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3 text-[#A6A6A6] hover:text-[#F5F0E8]"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#A6A6A6] pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-[#35312A] bg-[#101010] text-[#D4AF6A] focus:ring-0"
                  />
                  <span>Remember my login</span>
                </label>
                <span className="text-[#E8C786]">256-Bit SSL Encrypted</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#D4AF6A] to-[#E8C786] text-[#101010] font-bold text-sm tracking-wide hover:brightness-110 shadow-lg shadow-[#D4AF6A]/20 transition-all cursor-pointer mt-2"
              >
                Sign In to Shiva Car &amp; Bike Rental
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#F5F0E8] mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#A6A6A6] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Shiva Prasad"
                    className="w-full pl-10 pr-4 py-2 bg-[#101010] border border-[#35312A] rounded-lg text-sm text-[#F5F0E8] placeholder-[#666] focus:border-[#D4AF6A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F0E8] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A6A6A6] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. shiva.prasad@example.com"
                    className="w-full pl-10 pr-4 py-2 bg-[#101010] border border-[#35312A] rounded-lg text-sm text-[#F5F0E8] placeholder-[#666] focus:border-[#D4AF6A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F0E8] mb-1">
                  Mobile Number (India +91)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#A6A6A6] absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    placeholder="e.g. 98490 12345"
                    className="w-full pl-10 pr-4 py-2 bg-[#101010] border border-[#35312A] rounded-lg text-sm text-[#F5F0E8] placeholder-[#666] focus:border-[#D4AF6A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#F5F0E8] mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#A6A6A6] absolute left-3 top-2.5" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-9 pr-8 py-2 bg-[#101010] border border-[#35312A] rounded-lg text-sm text-[#F5F0E8] placeholder-[#666] focus:border-[#D4AF6A] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-2.5 text-[#A6A6A6]"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5F0E8] mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#A6A6A6] absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-9 pr-3 py-2 bg-[#101010] border border-[#35312A] rounded-lg text-sm text-[#F5F0E8] placeholder-[#666] focus:border-[#D4AF6A] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#A6A6A6]">
                By registering, you agree to Royal Ride &amp; Shiva Car &amp; Bike Rental’s terms and rental policy.
              </p>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#D4AF6A] to-[#E8C786] text-[#101010] font-bold text-sm tracking-wide hover:brightness-110 shadow-lg shadow-[#D4AF6A]/20 transition-all cursor-pointer"
              >
                Create My Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
