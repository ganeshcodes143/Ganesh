import React from 'react';
import {
  Crown,
  ShieldCheck,
  Award,
  Sparkles,
  Users,
  MapPin,
  Clock,
  Car,
  Bike,
} from 'lucide-react';
import { SUPPORTED_CITIES } from '../data/vehicles';

export const AboutUsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#191919] border border-[#D4AF6A]/40 text-xs text-[#E8C786] font-semibold">
          <Crown className="w-3.5 h-3.5 text-[#D4AF6A]" />
          Our Heritage &amp; Vision
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#F5F0E8] leading-tight">
          About <span className="gold-gradient-text">Shiva Car &amp; Bike Rental</span>
        </h1>
        <p className="text-sm sm:text-base text-[#A6A6A6] leading-relaxed">
          Founded with a singular commitment: to deliver uncompromised luxury, mechanical perfection, and royal hospitality on wheels across Telangana, Andhra Pradesh, and Karnataka.
        </p>
      </div>

      {/* Story grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-5 text-sm text-[#A6A6A6] leading-relaxed">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F0E8]">
            The Royal Ride Standard
          </h2>
          <p>
            Shiva Car &amp; Bike Rental was established to solve the persistent challenges of vehicle hire in India—hidden charges, poorly maintained engines, and delayed deposits. Under our luxury label <strong className="text-[#E8C786]">Royal Ride — Luxury on Wheels</strong>, we have redefined executive mobility.
          </p>
          <p>
            Our current showroom fleet comprises precisely 15 curated cars and 15 precision-maintained motorcycles. Whether you need an agile commuter like the Swift or Splendor, a rugged off-roader like the Mahindra Thar, an interstate grand tourer like the Himalayan 450, or a head-turning Mercedes-Benz E-Class or Land Rover Defender, every vehicle is sanitized, detailed, and certified before departure.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#35312A]">
            <div className="p-4 rounded-xl bg-[#191919] border border-[#35312A]">
              <div className="font-serif text-3xl font-bold text-[#E8C786]">30+</div>
              <div className="text-xs text-[#F5F0E8] font-semibold mt-1">Premium Fleet Inventory</div>
              <div className="text-[11px] text-[#A6A6A6]">15 Cars &amp; 15 Bikes</div>
            </div>

            <div className="p-4 rounded-xl bg-[#191919] border border-[#35312A]">
              <div className="font-serif text-3xl font-bold text-[#E8C786]">7</div>
              <div className="text-xs text-[#F5F0E8] font-semibold mt-1">Major Hub Cities</div>
              <div className="text-[11px] text-[#A6A6A6]">South India Network</div>
            </div>
          </div>
        </div>

        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#D4AF6A]/40 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80"
            alt="Royal Ride Executive Fleet"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#101010]/90 backdrop-blur-md border border-[#35312A]">
            <div className="text-xs font-bold text-[#E8C786] uppercase tracking-wider">
              Fleet Maintenance Guarantee
            </div>
            <div className="text-xs text-[#F5F0E8] mt-0.5">
              150-Point Pre-Rental Diagnostic Inspection &amp; Direct Authorized Service History.
            </div>
          </div>
        </div>
      </div>

      {/* City Hubs */}
      <div className="p-8 rounded-3xl bg-[#151515] border border-[#35312A] space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs uppercase tracking-widest text-[#D4AF6A] font-bold">
            Physical Hub Network
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#F5F0E8]">
            Available Across 7 Cities
          </h3>
          <p className="text-xs text-[#A6A6A6]">
            Free doorstep delivery available at all domestic airports, major transit terminals, and central city locations.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
          {SUPPORTED_CITIES.map((city) => (
            <div
              key={city}
              className="p-4 rounded-2xl bg-[#191919] border border-[#35312A] hover:border-[#D4AF6A] transition-all text-center space-y-1"
            >
              <MapPin className="w-5 h-5 text-[#D4AF6A] mx-auto mb-1" />
              <div className="font-serif font-bold text-sm text-[#F5F0E8]">{city}</div>
              <div className="text-[10px] text-emerald-400 font-medium">Delivery Active</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
