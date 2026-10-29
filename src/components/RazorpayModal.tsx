import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle2,
  Lock,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { formatCurrencyINR } from '../utils/pricing';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: any;
  onPaymentSuccess: (paymentResult: any) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  bookingData,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('shiva@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 8190 2341 9082');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'processing' | 'done'>('select');

  if (!isOpen || !bookingData) return null;

  const totalAmount = bookingData.breakdown?.finalTotal || 0;
  const orderId = `order_rr_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setStep('processing');

    setTimeout(() => {
      setStep('done');
      const paymentResult = {
        paymentId: `pay_rr_${Math.random().toString(36).substring(2, 10)}`,
        orderId,
        method:
          selectedMethod === 'upi'
            ? `UPI (${upiId})`
            : selectedMethod === 'card'
            ? 'Credit Card'
            : 'Net Banking',
        paidAt: new Date().toISOString(),
      };

      setTimeout(() => {
        onPaymentSuccess(paymentResult);
      }, 1000);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#0F172A] border border-blue-900/60 rounded-2xl shadow-2xl overflow-hidden text-white font-sans">
        {/* Razorpay Brand Header */}
        <div className="bg-[#1E293B] px-5 py-4 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
              R
            </div>
            <div>
              <div className="text-xs font-bold tracking-wider text-blue-400 uppercase">
                Razorpay Checkout
              </div>
              <div className="text-sm font-semibold text-slate-100">
                Shiva Car &amp; Bike Rental
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={processing}
            className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount bar */}
        <div className="bg-[#0B132B] px-5 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Order Ref: {orderId}</span>
          <span className="text-base font-bold text-amber-400 font-serif">
            {formatCurrencyINR(totalAmount)}
          </span>
        </div>

        {/* Body */}
        <div className="p-5">
          {step === 'processing' ? (
            <div className="py-12 text-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
              <div>
                <h4 className="text-base font-semibold text-slate-100">
                  Contacting Bank Gateway...
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Authorizing payment with 256-bit bank encryption. Please do not refresh.
                </p>
              </div>
            </div>
          ) : step === 'done' ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
              <div>
                <h4 className="text-lg font-bold text-emerald-300">
                  Payment Verified!
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Your reservation is confirmed with Shiva Car &amp; Bike Rental.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePay} className="space-y-4">
              {/* Method tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    selectedMethod === 'upi'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    selectedMethod === 'card'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    selectedMethod === 'netbanking'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>NetBanking</span>
                </button>
              </div>

              {/* Method input */}
              {selectedMethod === 'upi' && (
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <label className="block text-xs font-medium text-slate-300">
                    Virtual Payment Address (VPA / UPI ID)
                  </label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                  <div className="flex gap-2 text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-700/60">GPay</span>
                    <span className="px-2 py-0.5 rounded bg-slate-700/60">PhonePe</span>
                    <span className="px-2 py-0.5 rounded bg-slate-700/60">Paytm</span>
                  </div>
                </div>
              )}

              {selectedMethod === 'card' && (
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2.5">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Expiry</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">CVV</label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'netbanking' && (
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <label className="block text-xs font-medium text-slate-300">Popular Banks</label>
                  <select className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100">
                    <option>HDFC Bank</option>
                    <option>State Bank of India (SBI)</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {/* Trust footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> PCI-DSS Level 1 Compliant
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> 256-Bit Bank Grade
                </span>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Pay {formatCurrencyINR(totalAmount)} Now</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
