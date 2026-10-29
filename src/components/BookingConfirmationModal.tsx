import React from 'react';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  Crown,
  Share2,
} from 'lucide-react';
import { Booking } from '../types';
import { formatCurrencyINR } from '../utils/pricing';

interface BookingConfirmationModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToDashboard: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  booking,
  isOpen,
  onClose,
  onGoToDashboard,
}) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#151515] border border-[#D4AF6A] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Celebration Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 mb-1">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="text-xs uppercase tracking-widest text-[#D4AF6A] font-bold">
            Shiva Car &amp; Bike Rental • Confirmed Reservation
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F0E8]">
            Royal Ride Booking Confirmed!
          </h2>

          <div className="inline-block mt-1 px-3 py-1 rounded-full bg-[#101010] border border-[#35312A] text-xs font-mono text-[#E8C786]">
            Booking Reference: <span className="font-bold">{booking.bookingReference}</span>
          </div>
        </div>

        {/* Vehicle & Rental Summary Card */}
        <div className="p-4 rounded-xl bg-[#101010] border border-[#35312A] space-y-4 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={booking.vehicle.imageUrls[0]}
              alt={booking.vehicle.model}
              className="w-20 h-14 object-cover rounded-lg border border-[#35312A]"
            />
            <div>
              <div className="text-[10px] uppercase text-[#D4AF6A] font-bold">
                {booking.vehicle.brand}
              </div>
              <div className="text-base font-serif font-bold text-[#F5F0E8]">
                {booking.vehicle.model}
              </div>
              <div className="text-[#A6A6A6]">
                {booking.vehicle.category} • {booking.rentalDurationDays} Day Rental
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#35312A]/60">
            <div>
              <span className="text-[#A6A6A6] block">Pickup Location</span>
              <span className="font-semibold text-[#F5F0E8] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF6A]" />
                {booking.pickupCity} Hub
              </span>
            </div>

            <div>
              <span className="text-[#A6A6A6] block">Total Paid (Razorpay)</span>
              <span className="font-serif font-bold text-base text-[#E8C786] mt-0.5 block">
                {formatCurrencyINR(booking.priceBreakdown.finalTotal)}
              </span>
            </div>

            <div>
              <span className="text-[#A6A6A6] block">Pickup Date &amp; Time</span>
              <span className="font-medium text-[#F5F0E8] mt-0.5 block">
                {new Date(booking.pickupDateTime).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>

            <div>
              <span className="text-[#A6A6A6] block">Return Date &amp; Time</span>
              <span className="font-medium text-[#F5F0E8] mt-0.5 block">
                {new Date(booking.returnDateTime).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-[#A6A6A6] border-t border-[#35312A]/60">
            Customer: <strong className="text-[#F5F0E8]">{booking.userName}</strong> ({booking.userMobile})
          </div>
        </div>

        {/* Notice */}
        <div className="p-3 rounded-lg bg-[#252018] border border-[#D4AF6A]/30 text-xs text-[#E8C786] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#D4AF6A] shrink-0" />
          <span>
            Complimentary doorstep delivery arranged. Our Shiva Rental fleet executive will contact you 2 hours prior to your scheduled journey.
          </span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrint}
            className="py-3 px-4 rounded-xl bg-[#191919] hover:bg-[#202020] border border-[#35312A] text-xs font-semibold text-[#F5F0E8] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#D4AF6A]" />
            Print Receipt
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToDashboard();
            }}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF6A] to-[#E8C786] text-[#101010] text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 shadow-lg shadow-[#D4AF6A]/20 transition-all cursor-pointer"
          >
            <span>My Bookings</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
