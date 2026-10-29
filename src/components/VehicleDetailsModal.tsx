import React, { useState } from 'react';
import {
  X,
  Star,
  Shield,
  Gauge,
  Fuel,
  Users,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle,
  Tag,
  CreditCard,
  AlertCircle,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Vehicle, User } from '../types';
import {
  calculatePriceBreakdown,
  calculateRentalDays,
  formatCurrencyINR,
  validateRentalDates,
} from '../utils/pricing';
import { SUPPORTED_CITIES } from '../data/vehicles';
import { RentalStore } from '../services/store';

interface VehicleDetailsModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onProceedToPayment: (bookingData: any) => void;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  currentUser,
  onOpenAuth,
  onProceedToPayment,
}) => {
  if (!isOpen || !vehicle) return null;

  // Tomorrow 10:00 as default pickup, +2 days 18:00 as return
  const getDefaultDates = () => {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(10, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 2);
    end.setHours(18, 0, 0, 0);

    const formatToLocalISO = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${mins}`;
    };

    return {
      pickup: formatToLocalISO(start),
      returnDate: formatToLocalISO(end),
    };
  };

  const defaults = getDefaultDates();
  const [pickupCity, setPickupCity] = useState(vehicle.supportedCities[0] || 'Hyderabad');
  const [pickupDateTime, setPickupDateTime] = useState(defaults.pickup);
  const [returnDateTime, setReturnDateTime] = useState(defaults.returnDate);

  // Extras
  const [chauffeur, setChauffeur] = useState(false);
  const [extraHelmet, setExtraHelmet] = useState(false);
  const [insuranceCover, setInsuranceCover] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Review states
  const reviews = RentalStore.getReviews(vehicle.id);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Price calculation
  const breakdown = calculatePriceBreakdown(
    vehicle.dailyPrice,
    pickupDateTime,
    returnDateTime,
    vehicle.securityDeposit,
    {
      chauffeur: vehicle.vehicleType === 'car' ? chauffeur : false,
      extraHelmet: vehicle.vehicleType === 'bike' ? extraHelmet : false,
      insuranceCover,
      couponCode: appliedCoupon,
    }
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const code = couponCode.trim().toUpperCase();
    if (code === 'ROYAL10' || code === 'SHIVA500') {
      setAppliedCoupon(code);
      setBookingError(null);
    } else {
      setBookingError('Invalid coupon code. Try "ROYAL10" for 10% off or "SHIVA500" for ₹500 off.');
    }
  };

  const handleProceedBooking = () => {
    setBookingError(null);

    // Validate dates
    const dateValidation = validateRentalDates(pickupDateTime, returnDateTime);
    if (!dateValidation.valid) {
      setBookingError(dateValidation.error || 'Please select valid rental dates.');
      return;
    }

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    onProceedToPayment({
      vehicle,
      pickupCity,
      pickupDateTime,
      returnDateTime,
      breakdown,
      options: {
        chauffeur: vehicle.vehicleType === 'car' ? chauffeur : false,
        extraHelmet: vehicle.vehicleType === 'bike' ? extraHelmet : false,
        insuranceCover,
        couponCode: appliedCoupon,
      },
    });
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!newComment.trim()) return;

    RentalStore.addReview({
      vehicleId: vehicle.id,
      userId: currentUser.id,
      userName: currentUser.name,
      rating: newRating,
      comment: newComment.trim(),
    });

    setNewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-5xl bg-[#141414] border border-[#35312A] rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#101010]/80 text-[#A6A6A6] hover:text-[#F5F0E8] border border-[#35312A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
          {/* Left Column: Visuals & Specifications (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#35312A] space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest font-bold px-2.5 py-0.5 rounded bg-[#D4AF6A]/20 text-[#E8C786] border border-[#D4AF6A]/30">
                  {vehicle.category}
                </span>
                <span className="text-xs text-[#A6A6A6] font-medium">•</span>
                <span className="text-xs text-[#E8C786] font-semibold tracking-wide">
                  Shiva Car &amp; Bike Rental Fleet
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5F0E8] leading-tight">
                {vehicle.brand} <span className="gold-gradient-text">{vehicle.model}</span>
              </h2>
              <div className="flex items-center gap-3 mt-2 text-xs text-[#A6A6A6]">
                <div className="flex items-center gap-1 text-[#E8C786]">
                  <Star className="w-4 h-4 fill-[#D4AF6A] text-[#D4AF6A]" />
                  <span className="font-bold text-sm">{vehicle.rating.toFixed(1)}</span>
                  <span>({vehicle.reviewCount} customer reviews)</span>
                </div>
                <span>•</span>
                <span className="font-mono bg-[#191919] px-2 py-0.5 rounded border border-[#35312A]">
                  Reg: {vehicle.plateNumber || 'Verified Commercial Fleet'}
                </span>
              </div>
            </div>

            {/* Main Image Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#101010] border border-[#35312A]">
                <img
                  src={vehicle.imageUrls[activeImageIdx] || vehicle.imageUrls[0]}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {vehicle.imageUrls.length > 1 && (
                <div className="flex gap-2">
                  {vehicle.imageUrls.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImageIdx === idx ? 'border-[#D4AF6A]' : 'border-[#35312A] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Description */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-[#D4AF6A] font-semibold mb-2">
                Overview &amp; Character
              </h3>
              <p className="text-sm text-[#A6A6A6] leading-relaxed">{vehicle.description}</p>
            </div>

            {/* Specifications Matrix */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-[#D4AF6A] font-semibold mb-3">
                Key Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#191919] border border-[#35312A]">
                  <div className="text-[10px] uppercase text-[#A6A6A6]">Transmission</div>
                  <div className="text-sm font-semibold text-[#F5F0E8] mt-0.5">
                    {vehicle.specifications.transmission}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#191919] border border-[#35312A]">
                  <div className="text-[10px] uppercase text-[#A6A6A6]">Fuel / Engine</div>
                  <div className="text-sm font-semibold text-[#F5F0E8] mt-0.5">
                    {vehicle.vehicleType === 'car'
                      ? vehicle.specifications.fuelType
                      : `${vehicle.specifications.engineCapacityCc} cc Single-Cylinder`}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#191919] border border-[#35312A]">
                  <div className="text-[10px] uppercase text-[#A6A6A6]">
                    {vehicle.vehicleType === 'car' ? 'Seating Capacity' : 'Certified Mileage'}
                  </div>
                  <div className="text-sm font-semibold text-[#F5F0E8] mt-0.5">
                    {vehicle.vehicleType === 'car'
                      ? `${vehicle.specifications.seatingCapacity} Adult Passengers`
                      : vehicle.specifications.mileage}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#191919] border border-[#35312A]">
                  <div className="text-[10px] uppercase text-[#A6A6A6]">Top Speed</div>
                  <div className="text-sm font-semibold text-[#F5F0E8] mt-0.5">
                    {vehicle.specifications.topSpeed || '160 km/h'}
                  </div>
                </div>

                {vehicle.vehicleType === 'car' ? (
                  <div className="p-3 rounded-xl bg-[#191919] border border-[#35312A]">
                    <div className="text-[10px] uppercase text-[#A6A6A6]">Air Conditioning</div>
                    <div className="text-sm font-semibold text-[#E8C786] mt-0.5">
                      Dual Climate AC
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[#191919] border border-[#35312A]">
                    <div className="text-[10px] uppercase text-[#A6A6A6]">Safety Gear</div>
                    <div className="text-sm font-semibold text-[#E8C786] mt-0.5">
                      ISI Helmet Included
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-[#191919] border border-[#35312A]">
                  <div className="text-[10px] uppercase text-[#A6A6A6]">
                    {vehicle.vehicleType === 'car' ? 'Boot Capacity' : 'Braking Technology'}
                  </div>
                  <div className="text-sm font-semibold text-[#F5F0E8] mt-0.5">
                    {vehicle.vehicleType === 'car'
                      ? vehicle.specifications.bootSpace || '400+ Litres'
                      : 'Dual-Channel ABS'}
                  </div>
                </div>
              </div>
            </div>

            {/* Features Checklist */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-[#D4AF6A] font-semibold mb-2.5">
                Included Luxury &amp; Safety Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#F5F0E8]">
                {vehicle.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#D4AF6A] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Genuine Reviews Section */}
            <div className="pt-4 border-t border-[#35312A]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs uppercase tracking-wider text-[#D4AF6A] font-semibold">
                  Customer Reviews ({reviews.length})
                </h3>
                <span className="text-xs text-[#A6A6A6]">Verified Shiva Rental Bookings</span>
              </div>

              <div className="space-y-3 mb-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-xl bg-[#191919] border border-[#35312A]/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#F5F0E8]">{rev.userName}</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#D4AF6A] text-[#D4AF6A]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#A6A6A6] mt-1.5">{rev.comment}</p>
                    {rev.bookingReference && (
                      <span className="inline-block mt-1 text-[10px] text-[#D4AF6A] font-mono">
                        Booking Ref: {rev.bookingReference}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Add review form */}
              <form onSubmit={handleAddReview} className="p-3.5 rounded-xl bg-[#101010] border border-[#35312A]">
                <div className="text-xs font-semibold text-[#F5F0E8] mb-2">Write a Review</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-[#A6A6A6]">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= newRating ? 'fill-[#D4AF6A] text-[#D4AF6A]' : 'text-neutral-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience renting this vehicle with Shiva Car & Bike Rental..."
                  rows={2}
                  className="w-full p-2.5 text-xs bg-[#191919] border border-[#35312A] rounded-lg text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
                />
                {reviewSuccess && (
                  <p className="text-xs text-emerald-400 mt-1">
                    Thank you! Your verified review has been submitted.
                  </p>
                )}
                <button
                  type="submit"
                  className="mt-2 px-3 py-1.5 text-xs font-semibold bg-[#252018] text-[#E8C786] border border-[#D4AF6A]/50 rounded-lg hover:bg-[#33281c]"
                >
                  Post Review
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Interactive Booking Calculator (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[#181818] flex flex-col justify-between">
            <div>
              {/* Daily rate header */}
              <div className="p-4 rounded-xl bg-[#101010] border border-[#D4AF6A]/40 mb-6">
                <div className="text-xs text-[#A6A6A6] uppercase tracking-wider">
                  Transparent Rental Rate
                </div>
                <div className="font-serif text-3xl font-bold text-[#E8C786] mt-0.5">
                  {formatCurrencyINR(vehicle.dailyPrice)}
                  <span className="text-xs font-sans font-normal text-[#A6A6A6]"> / 24-hr day</span>
                </div>
                <div className="text-[11px] text-[#A6A6A6] mt-1">
                  100% Free Doorstep Delivery &amp; Pickup at Airport / Railway Station.
                </div>
              </div>

              {bookingError && (
                <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{bookingError}</span>
                </div>
              )}

              {/* Booking Fields */}
              <div className="space-y-4">
                {/* City */}
                <div>
                  <label className="block text-xs font-medium text-[#F5F0E8] mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF6A]" /> Pickup City
                  </label>
                  <select
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#101010] border border-[#35312A] rounded-lg text-sm text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
                  >
                    {SUPPORTED_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c} (Shiva Rental Hub)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pickup & Return Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#F5F0E8] mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF6A]" /> Pickup Date &amp; Time
                    </label>
                    <input
                      type="datetime-local"
                      value={pickupDateTime}
                      onChange={(e) => setPickupDateTime(e.target.value)}
                      className="w-full px-2.5 py-2 bg-[#101010] border border-[#35312A] rounded-lg text-xs text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#F5F0E8] mb-1.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF6A]" /> Return Date &amp; Time
                    </label>
                    <input
                      type="datetime-local"
                      value={returnDateTime}
                      onChange={(e) => setReturnDateTime(e.target.value)}
                      className="w-full px-2.5 py-2 bg-[#101010] border border-[#35312A] rounded-lg text-xs text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Optional Extras */}
                <div className="pt-2 border-t border-[#35312A]/60 space-y-2">
                  <div className="text-xs font-semibold text-[#E8C786] mb-1">
                    Optional Add-ons
                  </div>

                  {vehicle.vehicleType === 'car' ? (
                    <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#101010] border border-[#35312A] cursor-pointer hover:border-[#D4AF6A]/50">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={chauffeur}
                          onChange={(e) => setChauffeur(e.target.checked)}
                          className="rounded border-[#35312A] text-[#D4AF6A]"
                        />
                        <span className="text-xs text-[#F5F0E8]">Professional Royal Chauffeur</span>
                      </div>
                      <span className="text-xs font-semibold text-[#E8C786]">₹800 / day</span>
                    </label>
                  ) : (
                    <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#101010] border border-[#35312A] cursor-pointer hover:border-[#D4AF6A]/50">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={extraHelmet}
                          onChange={(e) => setExtraHelmet(e.target.checked)}
                          className="rounded border-[#35312A] text-[#D4AF6A]"
                        />
                        <span className="text-xs text-[#F5F0E8]">Extra Pillion ISI Helmet</span>
                      </div>
                      <span className="text-xs font-semibold text-[#E8C786]">₹50 / day</span>
                    </label>
                  )}

                  <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#101010] border border-[#35312A] cursor-pointer hover:border-[#D4AF6A]/50">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={insuranceCover}
                        onChange={(e) => setInsuranceCover(e.target.checked)}
                        className="rounded border-[#35312A] text-[#D4AF6A]"
                      />
                      <span className="text-xs text-[#F5F0E8]">Zero-Depreciation Insurance Cover</span>
                    </div>
                    <span className="text-xs font-semibold text-[#E8C786]">₹150 / day</span>
                  </label>
                </div>

                {/* Promo Coupon */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#A6A6A6] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon Code (ROYAL10 or SHIVA500)"
                      className="w-full pl-9 pr-3 py-2 bg-[#101010] border border-[#35312A] rounded-lg text-xs text-[#F5F0E8] uppercase placeholder-[#666] focus:border-[#D4AF6A] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#252018] text-[#E8C786] border border-[#35312A] hover:border-[#D4AF6A] transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Coupon &ldquo;{appliedCoupon}&rdquo; applied successfully!
                  </div>
                )}

                {/* Transparent Price Breakdown */}
                <div className="p-4 rounded-xl bg-[#101010] border border-[#35312A] space-y-2 text-xs">
                  <div className="text-[11px] uppercase tracking-wider text-[#D4AF6A] font-semibold border-b border-[#35312A] pb-1.5">
                    Cost Breakdown ({breakdown.days} {breakdown.days === 1 ? 'Day' : 'Days'})
                  </div>

                  <div className="flex justify-between text-[#A6A6A6]">
                    <span>
                      Base Rental ({formatCurrencyINR(breakdown.dailyRate)} × {breakdown.days}d)
                    </span>
                    <span className="text-[#F5F0E8] font-medium">
                      {formatCurrencyINR(breakdown.baseAmount)}
                    </span>
                  </div>

                  {breakdown.extrasAmount > 0 && (
                    <div className="flex justify-between text-[#A6A6A6]">
                      <span>Add-ons &amp; Insurance</span>
                      <span className="text-[#F5F0E8] font-medium">
                        {formatCurrencyINR(breakdown.extrasAmount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#A6A6A6]">
                    <span>GST (18% Statutory Tax)</span>
                    <span className="text-[#F5F0E8] font-medium">
                      {formatCurrencyINR(breakdown.gstAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#A6A6A6]">
                    <span>Refundable Security Deposit</span>
                    <span className="text-[#E8C786] font-medium">
                      {formatCurrencyINR(breakdown.securityDeposit)}
                    </span>
                  </div>

                  {breakdown.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Promotional Discount</span>
                      <span>-{formatCurrencyINR(breakdown.discountAmount)}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#35312A] flex justify-between items-baseline">
                    <span className="font-semibold text-sm text-[#F5F0E8]">Final Payable</span>
                    <span className="font-serif text-2xl font-bold text-[#E8C786]">
                      {formatCurrencyINR(breakdown.finalTotal)}
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-400 italic">
                    *Deposit is refunded within 24 hours of vehicle return.
                  </div>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="mt-6 pt-4 border-t border-[#35312A]">
              <button
                type="button"
                onClick={handleProceedBooking}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF6A] to-[#E8C786] text-[#101010] font-bold text-sm tracking-wide hover:brightness-110 shadow-lg shadow-[#D4AF6A]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>
                  {currentUser ? 'Proceed to Razorpay Checkout' : 'Login to Confirm Booking'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
