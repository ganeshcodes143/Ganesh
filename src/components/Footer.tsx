import React from 'react';
import { Crown, Heart, ShieldCheck, MapPin, Phone, Mail, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[#35312A] text-xs text-[#A6A6A6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#252018] border border-[#D4AF6A] flex items-center justify-center">
                <Crown className="w-6 h-6 text-[#D4AF6A]" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-wider gold-gradient-text">
                  ROYAL RIDE
                </span>
                <p className="text-[10px] tracking-widest uppercase text-[#A6A6A6]">
                  Luxury on Wheels • Shiva Car &amp; Bike Rental
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed max-w-sm">
              South India’s premier luxury vehicle rental platform. Offering 15 meticulously maintained cars and 15 precision-tuned motorcycles with instant booking, transparent Indian Rupee (₹) pricing, and 24/7 road concierge.
            </p>

            <div className="flex items-center gap-3 pt-2 text-[#E8C786]">
              <span className="p-2 rounded-lg bg-[#191919] border border-[#35312A] hover:border-[#D4AF6A] transition-colors cursor-pointer">
                <Instagram className="w-4 h-4" />
              </span>
              <span className="p-2 rounded-lg bg-[#191919] border border-[#35312A] hover:border-[#D4AF6A] transition-colors cursor-pointer">
                <Twitter className="w-4 h-4" />
              </span>
              <span className="p-2 rounded-lg bg-[#191919] border border-[#35312A] hover:border-[#D4AF6A] transition-colors cursor-pointer">
                <Facebook className="w-4 h-4" />
              </span>
              <span className="p-2 rounded-lg bg-[#191919] border border-[#35312A] hover:border-[#D4AF6A] transition-colors cursor-pointer">
                <Youtube className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#F5F0E8]">
              Fleet Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#D4AF6A] transition-colors"
                >
                  Home Showroom
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cars')}
                  className="hover:text-[#D4AF6A] transition-colors flex items-center gap-1.5"
                >
                  Cars Fleet (15 Models)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('bikes')}
                  className="hover:text-[#D4AF6A] transition-colors flex items-center gap-1.5"
                >
                  Bikes Fleet (15 Models)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('wishlist')}
                  className="hover:text-[#D4AF6A] transition-colors"
                >
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-[#D4AF6A] transition-colors"
                >
                  Customer Reservations
                </button>
              </li>
            </ul>
          </div>

          {/* Operational Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#F5F0E8]">
              Operating Hubs
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center gap-1.5 text-[#F5F0E8]">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF6A]" /> Hyderabad (HQ)
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF6A]" /> Bengaluru (Indiranagar)
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF6A]" /> Chennai (Anna Nagar)
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF6A]" /> Vijayawada (MG Road)
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF6A]" /> Kurnool &amp; Tirupati
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF6A]" /> Visakhapatnam Beach Road
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#F5F0E8]">
              Shiva Concierge
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="text-[#E8C786] font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#D4AF6A]" /> +91 98490 12345
              </div>
              <div className="text-[#A6A6A6] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#D4AF6A]" /> bookings@royalride.in
              </div>
              <div className="pt-2 text-[10px] text-[#A6A6A6] leading-tight">
                *Prices shown are illustrative demonstration data for Shiva Car &amp; Bike Rental.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#35312A] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} Royal Ride — Shiva Car and Bike Rental. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[#A6A6A6]">
            <span className="hover:text-[#D4AF6A] cursor-pointer">Terms &amp; Conditions</span>
            <span>•</span>
            <span className="hover:text-[#D4AF6A] cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[#D4AF6A] cursor-pointer">Cancellation Policy</span>
            <span>•</span>
            <span className="text-[#E8C786] font-semibold">256-Bit SSL Secured</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
