import React, { useState } from 'react';
import {
  Crown,
  Car,
  Bike,
  Calendar,
  Clock,
  MapPin,
  Search,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle2,
  Headphones,
  KeyRound,
  FileCheck,
  ChevronRight,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { Vehicle, User } from '../types';
import { VehicleCard } from '../components/VehicleCard';
import { SUPPORTED_CITIES } from '../data/vehicles';
import { validateRentalDates } from '../utils/pricing';

interface HomePageProps {
  vehicles: Vehicle[];
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onViewDetails: (vehicle: Vehicle) => void;
  onBookNow: (vehicle: Vehicle) => void;
  onNavigate: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  vehicles,
  wishlistIds,
  onToggleWishlist,
  onViewDetails,
  onBookNow,
  onNavigate,
}) => {
  // Booking Search bar state
  const [searchCategory, setSearchCategory] = useState<'all' | 'car' | 'bike'>('all');
  const [searchCity, setSearchCity] = useState('Hyderabad');

  const getDefaultSearchDates = () => {
    const s = new Date();
    s.setDate(s.getDate() + 1);
    s.setHours(9, 0, 0, 0);

    const e = new Date(s);
    e.setDate(e.getDate() + 2);
    e.setHours(18, 0, 0, 0);

    const pad = (n: number) => String(n).padStart(2, '0');
    const toISO = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

    return { start: toISO(s), end: toISO(e) };
  };

  const dates = getDefaultSearchDates();
  const [pickupDate, setPickupDate] = useState(dates.start);
  const [returnDate, setReturnDate] = useState(dates.end);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateRentalDates(pickupDate, returnDate);
    if (!res.valid) {
      setSearchError(res.error || 'Please enter valid pickup and return dates.');
      return;
    }
    setSearchError(null);

    // Route to cars or bikes based on category
    if (searchCategory === 'bike') {
      onNavigate('bikes');
    } else {
      onNavigate('cars');
    }
  };

  // Featured cars & bikes
  const featuredCars = vehicles.filter((v) => v.vehicleType === 'car' && v.featured).slice(0, 6);
  const featuredBikes = vehicles.filter((v) => v.vehicleType === 'bike' && v.featured).slice(0, 6);

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0A0A0A]">
        {/* Background automotive hero image with dramatic dark vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=85"
            alt="Royal Ride Fleet Luxury Automotive"
            className="w-full h-full object-cover object-center opacity-30 filter saturate-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/80 to-[#101010]/60" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-[#101010]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#191919]/90 border border-[#D4AF6A]/50 text-xs text-[#E8C786] shadow-xl backdrop-blur-md animate-in fade-in">
            <Crown className="w-4 h-4 text-[#D4AF6A]" />
            <span className="font-semibold tracking-wider uppercase">
              Shiva Car &amp; Bike Rental • Royal Fusion
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-[#F5F0E8]">15 Cars &amp; 15 Bikes Ready for Instant Booking</span>
          </div>

          <div className="space-y-4">
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F0E8] leading-[1.1]">
              Drive Beyond <span className="gold-gradient-text italic font-normal">Ordinary.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-lg text-[#A6A6A6] font-sans font-light leading-relaxed">
              Discover premium cars and bikes for every journey. Experience comfort, freedom, and luxury with Royal Ride.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('cars')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF6A] to-[#E8C786] text-[#101010] font-bold text-sm tracking-wide hover:brightness-110 shadow-xl shadow-[#D4AF6A]/20 transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <Car className="w-4 h-4" />
              <span>Explore Cars (15 Models)</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('bikes')}
              className="px-8 py-3.5 rounded-xl bg-[#191919] hover:bg-[#252018] text-[#F5F0E8] hover:text-[#E8C786] border border-[#35312A] hover:border-[#D4AF6A] font-semibold text-sm tracking-wide transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <Bike className="w-4 h-4 text-[#D4AF6A]" />
              <span>Explore Bikes (15 Models)</span>
            </button>
          </div>

          {/* Interactive Hero Search Form */}
          <div className="mt-8 max-w-4xl mx-auto bg-[#191919]/95 backdrop-blur-xl border border-[#35312A] rounded-2xl p-5 sm:p-7 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-[#35312A] pb-3 mb-5">
              <span className="text-xs uppercase tracking-widest text-[#E8C786] font-bold flex items-center gap-2">
                <Search className="w-4 h-4 text-[#D4AF6A]" /> Search Vehicle Availability
              </span>

              {/* Category tabs */}
              <div className="flex items-center gap-1 bg-[#101010] p-1 rounded-lg border border-[#35312A]">
                <button
                  type="button"
                  onClick={() => setSearchCategory('all')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    searchCategory === 'all'
                      ? 'bg-[#D4AF6A] text-[#101010]'
                      : 'text-[#A6A6A6] hover:text-[#F5F0E8]'
                  }`}
                >
                  All Vehicles
                </button>
                <button
                  type="button"
                  onClick={() => setSearchCategory('car')}
                  className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                    searchCategory === 'car'
                      ? 'bg-[#D4AF6A] text-[#101010]'
                      : 'text-[#A6A6A6] hover:text-[#F5F0E8]'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" /> Cars
                </button>
                <button
                  type="button"
                  onClick={() => setSearchCategory('bike')}
                  className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                    searchCategory === 'bike'
                      ? 'bg-[#D4AF6A] text-[#101010]'
                      : 'text-[#A6A6A6] hover:text-[#F5F0E8]'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" /> Bikes
                </button>
              </div>
            </div>

            {searchError && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs">
                {searchError}
              </div>
            )}

            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#A6A6A6] mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF6A]" /> Pickup City
                </label>
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#101010] border border-[#35312A] rounded-xl text-xs text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
                >
                  {SUPPORTED_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A6A6A6] mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF6A]" /> Pickup Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#101010] border border-[#35312A] rounded-xl text-xs text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A6A6A6] mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF6A]" /> Return Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#101010] border border-[#35312A] rounded-xl text-xs text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF6A] to-[#E8C786] text-[#101010] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#D4AF6A]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer h-[42px]"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Vehicles</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* TRUST PILLARS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#151515] border border-[#35312A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#252018] border border-[#D4AF6A]/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#D4AF6A]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#F5F0E8]">100% Verified Fleet</div>
              <div className="text-[11px] text-[#A6A6A6]">Certified commercial taxi plates</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#252018] border border-[#D4AF6A]/40 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 text-[#D4AF6A]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#F5F0E8]">Zero Hidden Fees</div>
              <div className="text-[11px] text-[#A6A6A6]">Transparent GST &amp; deposit terms</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#252018] border border-[#D4AF6A]/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#D4AF6A]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#F5F0E8]">Doorstep Delivery</div>
              <div className="text-[11px] text-[#A6A6A6]">Free drop at Airport &amp; Station</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#252018] border border-[#D4AF6A]/40 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-[#D4AF6A]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#F5F0E8]">24/7 Road Assistance</div>
              <div className="text-[11px] text-[#A6A6A6]">+91 98490 12345 helpline</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CARS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#D4AF6A] font-bold">
              Exclusive Showroom Selection
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5F0E8] mt-1">
              Featured Luxury &amp; Premium Cars
            </h2>
            <p className="text-xs sm:text-sm text-[#A6A6A6] mt-1">
              From practical hatchbacks to iconic 4x4 Thar, Fortuner, and royal luxury sedans.
            </p>
          </div>

          <button
            onClick={() => onNavigate('cars')}
            className="px-5 py-2.5 rounded-xl bg-[#191919] hover:bg-[#252018] border border-[#35312A] hover:border-[#D4AF6A] text-[#E8C786] font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All 15 Cars</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map((car) => (
            <VehicleCard
              key={car.id}
              vehicle={car}
              isWishlisted={wishlistIds.includes(car.id)}
              onToggleWishlist={onToggleWishlist}
              onViewDetails={onViewDetails}
              onBookNow={onBookNow}
            />
          ))}
        </div>
      </section>

      {/* FEATURED BIKES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#D4AF6A] font-bold">
              Two-Wheeler Grand Touring
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5F0E8] mt-1">
              Featured Superbikes &amp; Cruisers
            </h2>
            <p className="text-xs sm:text-sm text-[#A6A6A6] mt-1">
              Thumping Royal Enfield Classics, high rev Yamaha R15/MT-15, and track-ready Ninjas and Ducatis.
            </p>
          </div>

          <button
            onClick={() => onNavigate('bikes')}
            className="px-5 py-2.5 rounded-xl bg-[#191919] hover:bg-[#252018] border border-[#35312A] hover:border-[#D4AF6A] text-[#E8C786] font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All 15 Bikes</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredBikes.map((bike) => (
            <VehicleCard
              key={bike.id}
              vehicle={bike}
              isWishlisted={wishlistIds.includes(bike.id)}
              onToggleWishlist={onToggleWishlist}
              onViewDetails={onViewDetails}
              onBookNow={onBookNow}
            />
          ))}
        </div>
      </section>

      {/* WHY CHOOSE ROYAL RIDE? */}
      <section className="bg-gradient-to-b from-[#141414] via-[#1A1814] to-[#101010] py-20 border-y border-[#35312A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="text-xs uppercase tracking-widest text-[#D4AF6A] font-bold">
              The Shiva Car &amp; Bike Rental Advantage
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F5F0E8]">
              Why Choose Royal Ride?
            </h2>
            <p className="text-sm text-[#A6A6A6]">
              Setting the standard for luxury, safety, and transparency across the Indian rental industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#191919] border border-[#35312A] hover:border-[#D4AF6A]/60 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#252018] border border-[#D4AF6A]/40 flex items-center justify-center">
                <Crown className="w-6 h-6 text-[#D4AF6A]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F5F0E8]">
                Premium Vehicle Collection
              </h3>
              <p className="text-xs text-[#A6A6A6] leading-relaxed">
                Hand-curated showroom fleet of 30 vehicles—from fuel-efficient commuters to exotic German luxury sedans and British SUVs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#191919] border border-[#35312A] hover:border-[#D4AF6A]/60 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#252018] border border-[#D4AF6A]/40 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#D4AF6A]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F5F0E8]">
                Easy Online Booking
              </h3>
              <p className="text-xs text-[#A6A6A6] leading-relaxed">
                Instant reservation in under 60 seconds. Instant confirmation receipts with Razorpay 256-bit bank grade security.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#191919] border border-[#35312A] hover:border-[#D4AF6A]/60 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#252018] border border-[#D4AF6A]/40 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#D4AF6A]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F5F0E8]">
                Transparent Rental Pricing
              </h3>
              <p className="text-xs text-[#A6A6A6] leading-relaxed">
                Every single rupee accounted for. Explicit GST calculations, clear daily rate multipliers, and guaranteed refund of security deposit.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#191919] border border-[#35312A] hover:border-[#D4AF6A]/60 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#252018] border border-[#D4AF6A]/40 flex items-center justify-center">
                <Headphones className="w-6 h-6 text-[#D4AF6A]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F5F0E8]">
                Reliable Customer Support
              </h3>
              <p className="text-xs text-[#A6A6A6] leading-relaxed">
                Dedicated fleet managers in Hyderabad, Vijayawada, Bengaluru, and Tirupati on standby 24 hours every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (4 STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-[#D4AF6A] font-bold">
            Effortless 4-Step Process
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5F0E8]">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-[#A6A6A6]">
            From vehicle selection to hitting the open highway in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#151515] border border-[#35312A] text-center space-y-3 relative group hover:border-[#D4AF6A]/60 transition-all">
            <div className="w-12 h-12 rounded-full bg-[#D4AF6A] text-[#101010] font-bold text-lg flex items-center justify-center mx-auto shadow-lg shadow-[#D4AF6A]/30">
              1
            </div>
            <h3 className="font-serif text-base font-bold text-[#F5F0E8]">Choose Your Vehicle</h3>
            <p className="text-xs text-[#A6A6A6]">
              Browse 15 cars or 15 bikes, compare specs, mileage, daily rates, and features.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#151515] border border-[#35312A] text-center space-y-3 relative group hover:border-[#D4AF6A]/60 transition-all">
            <div className="w-12 h-12 rounded-full bg-[#D4AF6A] text-[#101010] font-bold text-lg flex items-center justify-center mx-auto shadow-lg shadow-[#D4AF6A]/30">
              2
            </div>
            <h3 className="font-serif text-base font-bold text-[#F5F0E8]">Select Dates &amp; City</h3>
            <p className="text-xs text-[#A6A6A6]">
              Pick your departure hub and dates. Customize optional chauffeur or insurance.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#151515] border border-[#35312A] text-center space-y-3 relative group hover:border-[#D4AF6A]/60 transition-all">
            <div className="w-12 h-12 rounded-full bg-[#D4AF6A] text-[#101010] font-bold text-lg flex items-center justify-center mx-auto shadow-lg shadow-[#D4AF6A]/30">
              3
            </div>
            <h3 className="font-serif text-base font-bold text-[#F5F0E8]">Confirm Your Booking</h3>
            <p className="text-xs text-[#A6A6A6]">
              Secure instant verification via Razorpay and receive your Booking Reference receipt.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#151515] border border-[#35312A] text-center space-y-3 relative group hover:border-[#D4AF6A]/60 transition-all">
            <div className="w-12 h-12 rounded-full bg-[#D4AF6A] text-[#101010] font-bold text-lg flex items-center justify-center mx-auto shadow-lg shadow-[#D4AF6A]/30">
              4
            </div>
            <h3 className="font-serif text-base font-bold text-[#F5F0E8]">Enjoy Your Journey</h3>
            <p className="text-xs text-[#A6A6A6]">
              Receive your sanitized vehicle at your doorstep and embark with royal luxury and complete freedom.
            </p>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-[#D4AF6A] font-bold">
            Customer Testimonials
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5F0E8]">
            Rated 4.9 Stars Across 850+ Journeys
          </h2>
          <p className="text-xs text-[#A6A6A6]">
            Verified customer experiences from Shiva Car &amp; Bike Rental patrons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#191919] border border-[#35312A] space-y-4">
            <div className="flex items-center gap-1 text-[#D4AF6A]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-[#D4AF6A]" />
              ))}
            </div>
            <p className="text-xs text-[#A6A6A6] italic leading-relaxed">
              &ldquo;Rented the Mahindra Thar from Shiva Car and Bike Rental for a 4-day road trip to Vizag and Araku. The vehicle was spotlessly clean, delivered right at our Hyderabad apartment on time. Truly luxury on wheels.&rdquo;
            </p>
            <div className="pt-2 border-t border-[#35312A] flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                alt="Shiva Rama Krishna"
                className="w-10 h-10 rounded-full object-cover border border-[#D4AF6A]"
              />
              <div>
                <div className="text-xs font-bold text-[#F5F0E8]">Shiva Rama Krishna</div>
                <div className="text-[10px] text-[#A6A6A6]">Hyderabad • Thar 4x4 Rental</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#191919] border border-[#35312A] space-y-4">
            <div className="flex items-center gap-1 text-[#D4AF6A]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-[#D4AF6A]" />
              ))}
            </div>
            <p className="text-xs text-[#A6A6A6] italic leading-relaxed">
              &ldquo;The Mercedes-Benz E-Class was our wedding arrival vehicle in Vijayawada. Our driver was punctual, impeccably dressed, and polite. Booking was so smooth and transparent.&rdquo;
            </p>
            <div className="pt-2 border-t border-[#35312A] flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                alt="Priya Reddy"
                className="w-10 h-10 rounded-full object-cover border border-[#D4AF6A]"
              />
              <div>
                <div className="text-xs font-bold text-[#F5F0E8]">Priya Reddy</div>
                <div className="text-[10px] text-[#A6A6A6]">Vijayawada • Mercedes-Benz E-Class</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#191919] border border-[#35312A] space-y-4">
            <div className="flex items-center gap-1 text-[#D4AF6A]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-[#D4AF6A]" />
              ))}
            </div>
            <p className="text-xs text-[#A6A6A6] italic leading-relaxed">
              &ldquo;Rented the Royal Enfield Himalayan 450 for the Bengaluru-Ooty circuit. Brand new tyres, included ISI helmet, zero hassles with police checks since commercial permits were genuine.&rdquo;
            </p>
            <div className="pt-2 border-t border-[#35312A] flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="Karthik Varma"
                className="w-10 h-10 rounded-full object-cover border border-[#D4AF6A]"
              />
              <div>
                <div className="text-xs font-bold text-[#F5F0E8]">Karthik Varma</div>
                <div className="text-[10px] text-[#A6A6A6]">Bengaluru • Himalayan 450</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-r from-[#2A2113] via-[#1E1810] to-[#121212] border border-[#D4AF6A]/60 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101010] border border-[#D4AF6A]/40 text-xs text-[#E8C786]">
            <Crown className="w-3.5 h-3.5 text-[#D4AF6A]" />
            <span>Royal Ride by Shiva Car &amp; Bike Rental</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F5F0E8]">
            Your Next Journey Starts Here.
          </h2>

          <p className="max-w-xl mx-auto text-xs sm:text-base text-[#A6A6A6]">
            Choose from 15 luxury cars and 15 precision-tuned bikes. Instant booking, doorstep delivery, and 24/7 roadside assistance across South India.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('cars')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF6A] to-[#E8C786] text-[#101010] font-bold text-sm hover:brightness-110 shadow-xl shadow-[#D4AF6A]/20 transition-all cursor-pointer"
            >
              Explore Vehicles (Cars &amp; Bikes)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
