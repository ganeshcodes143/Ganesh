import React, { useState } from 'react';
import {
  Crown,
  Car,
  Bike,
  Heart,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  CalendarCheck,
  Search,
  Sparkles,
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  currentView: string;
  setCurrentView: (view: string) => void;
  wishlistCount: number;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  setCurrentView,
  wishlistCount,
  onOpenAuthModal,
  onLogout,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#101010]/95 backdrop-blur-md border-b border-[#35312A] transition-all">
      {/* Top micro-banner highlighting Shiva Car & Bike Rental */}
      <div className="bg-gradient-to-r from-[#191919] via-[#241F17] to-[#191919] border-b border-[#35312A]/60 text-xs py-1.5 px-4 text-center text-[#A6A6A6]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF6A] animate-pulse"></span>
            <span className="text-[#E8C786] font-semibold tracking-wide uppercase">
              Shiva Car &amp; Bike Rental
            </span>
            <span className="hidden sm:inline text-neutral-500">•</span>
            <span className="hidden sm:inline">Telangana &amp; Andhra Pradesh Premier Luxury Fleet</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#E8C786] font-medium hidden md:inline">
              ☎ +91 98490 12345 / 24x7 Roadside Assistance
            </span>
            <span className="bg-[#D4AF6A]/10 text-[#E8C786] px-2 py-0.5 rounded text-[11px] border border-[#D4AF6A]/30">
              Zero Hidden Charges
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
            aria-label="Royal Ride Home"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-[#252018] to-[#141414] border border-[#D4AF6A]/50 flex items-center justify-center shadow-lg shadow-[#D4AF6A]/10 group-hover:border-[#D4AF6A] transition-colors shrink-0">
              <Crown className="w-5 h-5 sm:w-7 sm:h-7 text-[#D4AF6A] transition-transform group-hover:scale-110" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-lg sm:text-2xl font-bold tracking-wider gold-gradient-text">
                  ROYAL RIDE
                </span>
                <span className="hidden xs:inline text-[9px] sm:text-[10px] tracking-widest uppercase bg-[#D4AF6A]/20 text-[#E8C786] px-1.5 py-0.5 rounded border border-[#D4AF6A]/30 font-sans font-semibold">
                  INDIA
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] font-sans tracking-wider uppercase text-[#A6A6A6]">
                <span className="hidden sm:inline">Luxury on Wheels • </span><span className="text-[#D4AF6A]">Shiva Rental</span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentView === 'home'
                  ? 'text-[#D4AF6A] bg-[#191919] border border-[#35312A]'
                  : 'text-[#F5F0E8] hover:text-[#D4AF6A] hover:bg-[#191919]/60'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('cars')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                currentView === 'cars'
                  ? 'text-[#D4AF6A] bg-[#191919] border border-[#35312A]'
                  : 'text-[#F5F0E8] hover:text-[#D4AF6A] hover:bg-[#191919]/60'
              }`}
            >
              <Car className="w-4 h-4 text-[#D4AF6A]" />
              Cars <span className="text-[10px] bg-[#35312A] text-[#E8C786] px-1.5 py-0.5 rounded-full">15</span>
            </button>
            <button
              onClick={() => handleNavClick('bikes')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                currentView === 'bikes'
                  ? 'text-[#D4AF6A] bg-[#191919] border border-[#35312A]'
                  : 'text-[#F5F0E8] hover:text-[#D4AF6A] hover:bg-[#191919]/60'
              }`}
            >
              <Bike className="w-4 h-4 text-[#D4AF6A]" />
              Bikes <span className="text-[10px] bg-[#35312A] text-[#E8C786] px-1.5 py-0.5 rounded-full">15</span>
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentView === 'about'
                  ? 'text-[#D4AF6A] bg-[#191919] border border-[#35312A]'
                  : 'text-[#F5F0E8] hover:text-[#D4AF6A] hover:bg-[#191919]/60'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentView === 'contact'
                  ? 'text-[#D4AF6A] bg-[#191919] border border-[#35312A]'
                  : 'text-[#F5F0E8] hover:text-[#D4AF6A] hover:bg-[#191919]/60'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <button
              onClick={onOpenSearch}
              aria-label="Search vehicles"
              className="p-2.5 rounded-lg bg-[#191919] text-[#A6A6A6] hover:text-[#D4AF6A] hover:bg-[#252018] border border-[#35312A] transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => handleNavClick('wishlist')}
              aria-label="View Wishlist"
              className="relative p-2.5 rounded-lg bg-[#191919] text-[#A6A6A6] hover:text-[#D4AF6A] hover:bg-[#252018] border border-[#35312A] transition-colors"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#D4AF6A] text-[#101010] text-[11px] font-bold rounded-full flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* User Profile or Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 pr-3 rounded-lg bg-[#191919] border border-[#35312A] hover:border-[#D4AF6A]/60 transition-all focus:outline-none"
                  aria-expanded={userMenuOpen}
                >
                  <img
                    src={
                      currentUser.avatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
                    }
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#D4AF6A]/60"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-semibold text-[#F5F0E8] leading-tight truncate max-w-[120px]">
                      {currentUser.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-[#D4AF6A] font-medium leading-none capitalize">
                      {currentUser.role === 'admin' ? 'Fleet Admin' : 'Customer'}
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#191919] border border-[#35312A] rounded-xl shadow-2xl py-2 z-50 divide-y divide-[#35312A]/60 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3">
                      <p className="text-sm font-semibold text-[#F5F0E8] truncate">{currentUser.name}</p>
                      <p className="text-xs text-[#A6A6A6] truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded bg-[#D4AF6A]/20 text-[#E8C786] font-medium border border-[#D4AF6A]/30">
                        {currentUser.role === 'admin' ? '★ Fleet Owner & Admin' : 'Verified Member'}
                      </span>
                    </div>

                    <div className="py-1">
                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => handleNavClick('admin')}
                          className="w-full text-left px-4 py-2 text-sm text-[#E8C786] hover:bg-[#252018] flex items-center gap-2.5 font-medium"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#D4AF6A]" />
                          Admin Fleet Dashboard
                        </button>
                      )}
                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full text-left px-4 py-2 text-sm text-[#F5F0E8] hover:bg-[#252018] flex items-center gap-2.5"
                      >
                        <CalendarCheck className="w-4 h-4 text-[#D4AF6A]" />
                        My Bookings
                      </button>
                      <button
                        onClick={() => handleNavClick('wishlist')}
                        className="w-full text-left px-4 py-2 text-sm text-[#F5F0E8] hover:bg-[#252018] flex items-center gap-2.5"
                      >
                        <Heart className="w-4 h-4 text-[#D4AF6A]" />
                        Saved Vehicles ({wishlistCount})
                      </button>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-950/20 flex items-center gap-2.5"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuthModal}
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-[#D4AF6A] to-[#E8C786] text-[#101010] hover:brightness-110 shadow-lg shadow-[#D4AF6A]/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Login / Register</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-lg bg-[#191919] text-[#F5F0E8] border border-[#35312A]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#151515] border-b border-[#35312A] px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentView === 'home' ? 'bg-[#191919] text-[#D4AF6A]' : 'text-[#F5F0E8]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('cars')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
              currentView === 'cars' ? 'bg-[#191919] text-[#D4AF6A]' : 'text-[#F5F0E8]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Car className="w-4 h-4 text-[#D4AF6A]" /> Cars
            </span>
            <span className="text-xs bg-[#35312A] text-[#E8C786] px-2 py-0.5 rounded-full">15 Models</span>
          </button>
          <button
            onClick={() => handleNavClick('bikes')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
              currentView === 'bikes' ? 'bg-[#191919] text-[#D4AF6A]' : 'text-[#F5F0E8]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Bike className="w-4 h-4 text-[#D4AF6A]" /> Bikes
            </span>
            <span className="text-xs bg-[#35312A] text-[#E8C786] px-2 py-0.5 rounded-full">15 Models</span>
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentView === 'about' ? 'bg-[#191919] text-[#D4AF6A]' : 'text-[#F5F0E8]'
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentView === 'contact' ? 'bg-[#191919] text-[#D4AF6A]' : 'text-[#F5F0E8]'
            }`}
          >
            Contact
          </button>
          {currentUser && (
            <>
              <div className="border-t border-[#35312A] pt-2 mt-2">
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#E8C786] flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#D4AF6A]" /> Admin Dashboard
                  </button>
                )}
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#F5F0E8] flex items-center gap-2"
                >
                  <CalendarCheck className="w-4 h-4 text-[#D4AF6A]" /> My Bookings
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
