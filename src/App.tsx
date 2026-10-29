import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CarsPage } from './pages/CarsPage';
import { BikesPage } from './pages/BikesPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactPage } from './pages/ContactPage';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { VehicleDetailsModal } from './components/VehicleDetailsModal';
import { RazorpayModal } from './components/RazorpayModal';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';
import { SearchModal } from './components/SearchModal';
import { Vehicle, User, Booking } from './types';
import { RentalStore } from './services/store';
import { KeyRound, ShieldCheck, Sparkles, X } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(() => RentalStore.getCurrentUser());
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => RentalStore.getVehicles());
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => RentalStore.getWishlist());

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedVehicleForDetails, setSelectedVehicleForDetails] = useState<Vehicle | null>(null);
  const [bookingDataForPayment, setBookingDataForPayment] = useState<any | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showDemoCredentialsBanner, setShowDemoCredentialsBanner] = useState(true);

  // Sync state helpers
  const handleToggleWishlist = (id: string) => {
    RentalStore.toggleWishlist(id);
    setWishlistIds(RentalStore.getWishlist());
  };

  const handleOpenAuth = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    RentalStore.setCurrentUser(user);
  };

  const handleLogout = () => {
    RentalStore.logoutUser();
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicleForDetails(vehicle);
  };

  const handleBookNow = (vehicle: Vehicle) => {
    setSelectedVehicleForDetails(vehicle);
  };

  // Triggered from details modal when customer clicks Proceed to Payment
  const handleProceedToPayment = (bookingData: any) => {
    setSelectedVehicleForDetails(null);
    setBookingDataForPayment(bookingData);
  };

  // Triggered when Razorpay payment succeeds
  const handlePaymentSuccess = (paymentResult: any) => {
    if (!bookingDataForPayment || !currentUser) return;

    try {
      const newBooking = RentalStore.createBooking({
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userMobile: currentUser.mobile,
        vehicleId: bookingDataForPayment.vehicle.id,
        pickupCity: bookingDataForPayment.pickupCity,
        pickupDateTime: bookingDataForPayment.pickupDateTime,
        returnDateTime: bookingDataForPayment.returnDateTime,
        options: bookingDataForPayment.options,
        paymentMethod: paymentResult.method,
        notes: `Simulated Razorpay transaction ref: ${paymentResult.paymentId}`,
      });

      setBookingDataForPayment(null);
      setConfirmedBooking(newBooking);
    } catch (err: any) {
      alert(err.message || 'Booking reservation could not be processed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#101010] text-[#F5F0E8] font-sans flex flex-col selection:bg-[#D4AF6A] selection:text-[#101010]">
      {/* Prominent Quick-Login & Shiva Car & Bike Rental Banner */}
      {showDemoCredentialsBanner && (
        <div className="bg-[#18140E] border-b border-[#D4AF6A]/40 px-4 py-2.5 text-xs text-[#E8C786]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 font-bold bg-[#D4AF6A]/20 px-2 py-0.5 rounded border border-[#D4AF6A]/40 text-[#F5F0E8] text-[11px]">
                <KeyRound className="w-3 h-3 text-[#D4AF6A]" />
                Shiva Car &amp; Bike Rental Login
              </span>
              <span className="text-[#A6A6A6]">Quick Credentials:</span>
              <button
                onClick={() => {
                  RentalStore.loginUser('admin@royalride.in', 'admin123');
                  setCurrentUser(RentalStore.getCurrentUser());
                }}
                className="font-mono bg-[#101010] hover:bg-[#252018] px-2 py-0.5 rounded border border-[#35312A] hover:border-[#D4AF6A] transition-colors cursor-pointer text-[#F5F0E8]"
              >
                Owner/Admin: <span className="text-[#D4AF6A]">admin@royalride.in</span> / <span className="text-[#D4AF6A]">admin123</span>
              </button>
              <button
                onClick={() => {
                  RentalStore.loginUser('shiva@royalride.in', 'shiva123');
                  setCurrentUser(RentalStore.getCurrentUser());
                }}
                className="font-mono bg-[#101010] hover:bg-[#252018] px-2 py-0.5 rounded border border-[#35312A] hover:border-[#D4AF6A] transition-colors cursor-pointer text-[#F5F0E8]"
              >
                Customer: <span className="text-[#D4AF6A]">shiva@royalride.in</span> / <span className="text-[#D4AF6A]">shiva123</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenAuth}
                className="text-[11px] underline font-semibold text-[#F5F0E8] hover:text-[#D4AF6A]"
              >
                Open Login Window
              </button>
              <button
                onClick={() => setShowDemoCredentialsBanner(false)}
                className="text-[#A6A6A6] hover:text-[#F5F0E8] p-0.5"
                title="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        setCurrentView={setCurrentView}
        wishlistCount={wishlistIds.length}
        onOpenAuthModal={handleOpenAuth}
        onLogout={handleLogout}
        onOpenSearch={() => setIsSearchModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            vehicles={vehicles}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onViewDetails={handleViewDetails}
            onBookNow={handleBookNow}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}

        {currentView === 'cars' && (
          <CarsPage
            vehicles={vehicles}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onViewDetails={handleViewDetails}
            onBookNow={handleBookNow}
          />
        )}

        {currentView === 'bikes' && (
          <BikesPage
            vehicles={vehicles}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onViewDetails={handleViewDetails}
            onBookNow={handleBookNow}
          />
        )}

        {currentView === 'about' && <AboutUsPage />}

        {currentView === 'contact' && <ContactPage />}

        {(currentView === 'dashboard' || currentView === 'wishlist') && currentUser && (
          <CustomerDashboard
            currentUser={currentUser}
            onExploreVehicles={() => setCurrentView('cars')}
            onViewVehicle={handleViewDetails}
          />
        )}

        {currentView === 'admin' && currentUser?.role === 'admin' && (
          <AdminDashboard onViewVehicle={handleViewDetails} />
        )}

        {/* If trying to access protected views while logged out */}
        {(currentView === 'dashboard' || currentView === 'admin') && !currentUser && (
          <div className="py-24 text-center max-w-md mx-auto px-4 space-y-4">
            <ShieldCheck className="w-12 h-12 text-[#D4AF6A] mx-auto" />
            <h2 className="font-serif text-2xl font-bold text-[#F5F0E8]">
              Authentication Required
            </h2>
            <p className="text-xs text-[#A6A6A6]">
              Please log in to your Shiva Car &amp; Bike Rental account to access reservations or fleet management.
            </p>
            <button
              onClick={handleOpenAuth}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF6A] to-[#E8C786] text-[#101010] font-bold text-xs"
            >
              Sign In Now
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(view) => setCurrentView(view)} />

      {/* Modals & Overlays */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <VehicleDetailsModal
        vehicle={selectedVehicleForDetails}
        isOpen={Boolean(selectedVehicleForDetails)}
        onClose={() => setSelectedVehicleForDetails(null)}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onProceedToPayment={handleProceedToPayment}
      />

      <RazorpayModal
        isOpen={Boolean(bookingDataForPayment)}
        onClose={() => setBookingDataForPayment(null)}
        bookingData={bookingDataForPayment}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <BookingConfirmationModal
        booking={confirmedBooking}
        isOpen={Boolean(confirmedBooking)}
        onClose={() => setConfirmedBooking(null)}
        onGoToDashboard={() => setCurrentView('dashboard')}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        vehicles={vehicles}
        onSelectVehicle={handleViewDetails}
      />
    </div>
  );
}
