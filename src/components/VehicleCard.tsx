import React, { useState } from 'react';
import {
  Heart,
  Fuel,
  Users,
  Gauge,
  Shield,
  Star,
  MapPin,
  Check,
  ChevronRight,
  ShieldAlert,
  Wind,
} from 'lucide-react';
import { Vehicle } from '../types';
import { formatCurrencyINR } from '../utils/pricing';

interface VehicleCardProps {
  vehicle: Vehicle;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onViewDetails: (vehicle: Vehicle) => void;
  onBookNow: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  isWishlisted,
  onToggleWishlist,
  onViewDetails,
  onBookNow,
}) => {
  const [imageError, setImageError] = useState(false);

  // High quality reliable fallback images based on type
  const fallbackImage =
    vehicle.vehicleType === 'car'
      ? 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80'
      : 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80';

  const imageUrl = imageError ? fallbackImage : vehicle.imageUrls[0] || fallbackImage;

  return (
    <div className="group relative bg-[#191919] border border-[#35312A] hover:border-[#D4AF6A]/80 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF6A]/10 flex flex-col justify-between">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#101010]">
        <img
          src={imageUrl}
          alt={`${vehicle.brand} ${vehicle.model}`}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient shadow for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#191919] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-[#101010]/90 text-[#E8C786] border border-[#D4AF6A]/40 backdrop-blur-md">
            {vehicle.category}
          </span>
          {vehicle.featured && (
            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md bg-gradient-to-r from-[#D4AF6A] to-[#E8C786] text-[#101010]">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(vehicle.id);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 ${
            isWishlisted
              ? 'bg-[#D4AF6A] text-[#101010] shadow-lg shadow-[#D4AF6A]/40'
              : 'bg-[#101010]/80 text-[#F5F0E8] hover:text-[#D4AF6A] border border-[#35312A]'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Rating overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-[#101010]/90 px-2 py-1 rounded text-xs border border-[#35312A] text-[#E8C786]">
          <Star className="w-3.5 h-3.5 fill-[#D4AF6A] text-[#D4AF6A]" />
          <span className="font-bold">{vehicle.rating.toFixed(1)}</span>
          <span className="text-[#A6A6A6] text-[10px]">({vehicle.reviewCount})</span>
        </div>

        {/* Registration plate preview */}
        {vehicle.plateNumber && (
          <div className="absolute bottom-3 right-3 text-[10px] font-mono tracking-widest px-2 py-0.5 rounded bg-black/80 text-[#A6A6A6] border border-[#35312A]">
            {vehicle.plateNumber}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Model */}
          <div className="text-xs uppercase tracking-widest text-[#D4AF6A] font-semibold mb-1">
            {vehicle.brand}
          </div>
          <h3 className="font-serif text-xl font-bold text-[#F5F0E8] group-hover:text-[#E8C786] transition-colors leading-snug">
            {vehicle.model}
          </h3>

          <p className="text-xs text-[#A6A6A6] line-clamp-2 mt-2 leading-relaxed">
            {vehicle.description}
          </p>

          {/* Specifications Pills */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#35312A]/70 text-xs text-[#A6A6A6]">
            {vehicle.vehicleType === 'car' ? (
              <>
                <div className="flex items-center gap-1.5 truncate" title={vehicle.specifications.transmission}>
                  <Gauge className="w-3.5 h-3.5 text-[#D4AF6A] shrink-0" />
                  <span className="truncate">{vehicle.specifications.transmission}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate" title={vehicle.specifications.fuelType}>
                  <Fuel className="w-3.5 h-3.5 text-[#D4AF6A] shrink-0" />
                  <span className="truncate">{vehicle.specifications.fuelType}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate" title={`${vehicle.specifications.seatingCapacity} Seater`}>
                  <Users className="w-3.5 h-3.5 text-[#D4AF6A] shrink-0" />
                  <span>{vehicle.specifications.seatingCapacity} Seats</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 truncate" title={`${vehicle.specifications.engineCapacityCc} cc Engine`}>
                  <Gauge className="w-3.5 h-3.5 text-[#D4AF6A] shrink-0" />
                  <span>{vehicle.specifications.engineCapacityCc} cc</span>
                </div>
                <div className="flex items-center gap-1.5 truncate" title={vehicle.specifications.mileage}>
                  <Fuel className="w-3.5 h-3.5 text-[#D4AF6A] shrink-0" />
                  <span>{vehicle.specifications.mileage}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate" title="Helmet Included">
                  <Shield className="w-3.5 h-3.5 text-[#D4AF6A] shrink-0" />
                  <span>Helmet Inc.</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 pt-4 border-t border-[#35312A] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#A6A6A6]">
              Daily Rental
            </div>
            <div className="font-serif text-xl font-bold text-[#E8C786]">
              {formatCurrencyINR(vehicle.dailyPrice)}
              <span className="text-xs font-sans font-normal text-[#A6A6A6]"> / day</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewDetails(vehicle)}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-[#252018] text-[#E8C786] border border-[#35312A] hover:border-[#D4AF6A] hover:bg-[#2e261a] transition-all cursor-pointer"
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => onBookNow(vehicle)}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-[#D4AF6A] to-[#E8C786] text-[#101010] hover:brightness-110 shadow-md shadow-[#D4AF6A]/20 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Book</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
