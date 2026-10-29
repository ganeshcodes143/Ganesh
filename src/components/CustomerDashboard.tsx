import React, { useState } from 'react';
import {
  CalendarCheck,
  Heart,
  User as UserIcon,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  XCircle,
  CheckCircle,
  Shield,
  CreditCard,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { User, Booking, Vehicle } from '../types';
import { formatCurrencyINR } from '../utils/pricing';
import { RentalStore } from '../services/store';

interface CustomerDashboardProps {
  currentUser: User;
  onExploreVehicles: () => void;
  onViewVehicle: (vehicle: Vehicle) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  onExploreVehicles,
  onViewVehicle,
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'wishlist' | 'profile'>('bookings');
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Load user bookings
  const allBookings = RentalStore.getBookings();
  const userBookings = allBookings.filter((b) => b.userId === currentUser.id);

  // Load wishlist
  const wishlistIds = RentalStore.getWishlist();
  const allVehicles = RentalStore.getVehicles();
  const wishlistedVehicles = allVehicles.filter((v) => wishlistIds.includes(v.id));

  const filteredBookings = userBookings.filter((b) => {
    if (filterStatus === 'all') return true;
    return b.bookingStatus === filterStatus;
  });

  const handleCancelBooking = (bookingId: string) => {
    const updated = RentalStore.updateBookingStatus(bookingId, 'cancelled');
    if (updated) {
      setActionNotice(`Booking ${updated.bookingReference} has been cancelled. Refund initiated to original payment source.`);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const handleRemoveWishlist = (id: string) => {
    RentalStore.toggleWishlist(id);
    setActionNotice('Vehicle removed from wishlist.');
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1E1912] via-[#282115] to-[#191919] border border-[#35312A] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={
              currentUser.avatar ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
            }
            alt={currentUser.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF6A] shadow-md"
          />
          <div>
            <div className="text-xs uppercase tracking-widest text-[#D4AF6A] font-semibold">
              Shiva Car &amp; Bike Rental Member
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F0E8]">
              {currentUser.name}
            </h1>
            <div className="text-xs text-[#A6A6A6] mt-0.5">
              {currentUser.email} • {currentUser.mobile}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-center">
          <div className="px-4 py-2.5 rounded-xl bg-[#101010]/80 border border-[#35312A]">
            <div className="text-[10px] uppercase text-[#A6A6A6]">Total Bookings</div>
            <div className="font-serif text-xl font-bold text-[#E8C786]">
              {userBookings.length}
            </div>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-[#101010]/80 border border-[#35312A]">
            <div className="text-[10px] uppercase text-[#A6A6A6]">Saved in Wishlist</div>
            <div className="font-serif text-xl font-bold text-[#E8C786]">
              {wishlistedVehicles.length}
            </div>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#35312A] gap-4">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'bookings'
              ? 'text-[#D4AF6A] border-b-2 border-[#D4AF6A]'
              : 'text-[#A6A6A6] hover:text-[#F5F0E8]'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          My Reservations ({userBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'wishlist'
              ? 'text-[#D4AF6A] border-b-2 border-[#D4AF6A]'
              : 'text-[#A6A6A6] hover:text-[#F5F0E8]'
          }`}
        >
          <Heart className="w-4 h-4" />
          Wishlist ({wishlistedVehicles.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'text-[#D4AF6A] border-b-2 border-[#D4AF6A]'
              : 'text-[#A6A6A6] hover:text-[#F5F0E8]'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          Member Profile
        </button>
      </div>

      {/* Bookings View */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {/* Status Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#191919] p-3 rounded-xl border border-[#35312A]">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#A6A6A6]">Filter status:</span>
              {(['all', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg capitalize transition-colors font-medium ${
                    filterStatus === st
                      ? 'bg-[#D4AF6A] text-[#101010]'
                      : 'bg-[#101010] text-[#A6A6A6] hover:text-[#F5F0E8]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              onClick={onExploreVehicles}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#252018] text-[#E8C786] border border-[#D4AF6A]/50 hover:bg-[#33281c] transition-colors"
            >
              + Rent Another Vehicle
            </button>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-16 bg-[#191919] rounded-2xl border border-[#35312A] space-y-4">
              <CalendarCheck className="w-12 h-12 text-[#A6A6A6] mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[#F5F0E8]">No Bookings Found</h3>
              <p className="text-xs text-[#A6A6A6] max-w-sm mx-auto">
                You do not have any {filterStatus !== 'all' ? filterStatus : ''} vehicle reservations with Shiva Car &amp; Bike Rental currently.
              </p>
              <button
                onClick={onExploreVehicles}
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#D4AF6A] to-[#E8C786] text-[#101010] hover:brightness-110 shadow-lg shadow-[#D4AF6A]/20"
              >
                Explore 30 Vehicles Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#191919] border border-[#35312A] rounded-2xl p-5 hover:border-[#D4AF6A]/60 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={b.vehicle.imageUrls[0]}
                      alt={b.vehicle.model}
                      className="w-24 h-18 sm:w-28 sm:h-20 object-cover rounded-xl border border-[#35312A]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF6A]">
                          {b.vehicle.brand}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            b.bookingStatus === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : b.bookingStatus === 'completed'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </div>

                      <h4 className="font-serif text-lg font-bold text-[#F5F0E8] mt-0.5">
                        {b.vehicle.model}
                      </h4>

                      <div className="text-xs text-[#A6A6A6] flex items-center gap-3 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF6A]" /> {b.pickupCity}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#D4AF6A]" /> {b.rentalDurationDays} Days
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[#E8C786]">Ref: {b.bookingReference}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-[#35312A]">
                    <div className="text-left md:text-right">
                      <div className="text-[10px] text-[#A6A6A6] uppercase">Total Paid</div>
                      <div className="font-serif text-xl font-bold text-[#E8C786]">
                        {formatCurrencyINR(b.priceBreakdown.finalTotal)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewVehicle(b.vehicle)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#252018] text-[#E8C786] border border-[#35312A] hover:border-[#D4AF6A]"
                      >
                        Vehicle Info
                      </button>

                      {b.bookingStatus === 'confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-950/40 text-red-300 border border-red-800/60 hover:bg-red-900/50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Wishlist View */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {wishlistedVehicles.length === 0 ? (
            <div className="text-center py-16 bg-[#191919] rounded-2xl border border-[#35312A] space-y-4">
              <Heart className="w-12 h-12 text-[#A6A6A6] mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[#F5F0E8]">Your Wishlist is Empty</h3>
              <p className="text-xs text-[#A6A6A6] max-w-sm mx-auto">
                Explore our fleet of 15 cars and 15 bikes and click the heart icon on any vehicle to save it.
              </p>
              <button
                onClick={onExploreVehicles}
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#D4AF6A] to-[#E8C786] text-[#101010]"
              >
                Browse Fleet
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedVehicles.map((v) => (
                <div
                  key={v.id}
                  className="bg-[#191919] border border-[#35312A] rounded-2xl overflow-hidden p-4 space-y-3"
                >
                  <img
                    src={v.imageUrls[0]}
                    alt={v.model}
                    className="w-full aspect-[16/10] object-cover rounded-xl"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase text-[#D4AF6A] font-bold">{v.brand}</div>
                      <h4 className="font-serif text-lg font-bold text-[#F5F0E8]">{v.model}</h4>
                    </div>
                    <div className="text-right">
                      <div className="font-serif text-lg font-bold text-[#E8C786]">
                        {formatCurrencyINR(v.dailyPrice)}
                      </div>
                      <span className="text-[10px] text-[#A6A6A6]">/ day</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#35312A]">
                    <button
                      onClick={() => onViewVehicle(v)}
                      className="flex-1 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-[#D4AF6A] to-[#E8C786] text-[#101010]"
                    >
                      Rent Now
                    </button>
                    <button
                      onClick={() => handleRemoveWishlist(v.id)}
                      className="p-2 text-red-400 bg-[#101010] border border-[#35312A] rounded-lg hover:bg-red-950/20"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile View */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-[#191919] border border-[#35312A] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full border-2 border-[#D4AF6A]"
            />
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#F5F0E8]">{currentUser.name}</h3>
              <p className="text-xs text-[#A6A6A6]">
                Role: <span className="text-[#E8C786] capitalize font-semibold">{currentUser.role}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#101010] border border-[#35312A]">
              <span className="text-[#A6A6A6] block">Verified Email</span>
              <span className="text-sm font-semibold text-[#F5F0E8] mt-1 block">
                {currentUser.email}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#101010] border border-[#35312A]">
              <span className="text-[#A6A6A6] block">Registered Mobile</span>
              <span className="text-sm font-semibold text-[#F5F0E8] mt-1 block">
                {currentUser.mobile}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#101010] border border-[#35312A]">
              <span className="text-[#A6A6A6] block">Account Status</span>
              <span className="text-sm font-semibold text-emerald-400 mt-1 block flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Active &amp; Verified Driving License
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#101010] border border-[#35312A]">
              <span className="text-[#A6A6A6] block">Registered Hub</span>
              <span className="text-sm font-semibold text-[#E8C786] mt-1 block">
                Shiva Car &amp; Bike Rental HQ, Hyderabad
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
