import React, { useState, useMemo } from 'react';
import {
  Car,
  Filter,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { Vehicle } from '../types';
import { VehicleCard } from '../components/VehicleCard';

interface CarsPageProps {
  vehicles: Vehicle[];
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onViewDetails: (vehicle: Vehicle) => void;
  onBookNow: (vehicle: Vehicle) => void;
}

export const CarsPage: React.FC<CarsPageProps> = ({
  vehicles,
  wishlistIds,
  onToggleWishlist,
  onViewDetails,
  onBookNow,
}) => {
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedSeats, setSelectedSeats] = useState('All');
  const [maxPrice, setMaxPrice] = useState(15000);
  const [sortBy, setSortBy] = useState<'low-to-high' | 'high-to-low' | 'alphabetical' | 'popular'>('popular');

  const carList = useMemo(() => vehicles.filter((v) => v.vehicleType === 'car'), [vehicles]);

  // Extract unique brands and categories
  const brands = useMemo(() => ['All', ...Array.from(new Set(carList.map((c) => c.brand)))], [carList]);
  const categories = useMemo(() => ['All', ...Array.from(new Set(carList.map((c) => c.category)))], [carList]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('All');
    setSelectedCategory('All');
    setSelectedTransmission('All');
    setSelectedFuel('All');
    setSelectedSeats('All');
    setMaxPrice(15000);
    setSortBy('popular');
  };

  const filteredCars = useMemo(() => {
    return carList
      .filter((car) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            car.brand.toLowerCase().includes(q) ||
            car.model.toLowerCase().includes(q) ||
            car.category.toLowerCase().includes(q);
          if (!match) return false;
        }

        if (selectedBrand !== 'All' && car.brand !== selectedBrand) return false;
        if (selectedCategory !== 'All' && car.category !== selectedCategory) return false;
        if (selectedTransmission !== 'All' && car.specifications.transmission !== selectedTransmission)
          return false;
        if (selectedFuel !== 'All' && car.specifications.fuelType !== selectedFuel) return false;
        if (
          selectedSeats !== 'All' &&
          String(car.specifications.seatingCapacity) !== selectedSeats
        )
          return false;
        if (car.dailyPrice > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'low-to-high') return a.dailyPrice - b.dailyPrice;
        if (sortBy === 'high-to-low') return b.dailyPrice - a.dailyPrice;
        if (sortBy === 'alphabetical') return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
        return b.rating - a.rating;
      });
  }, [
    carList,
    searchQuery,
    selectedBrand,
    selectedCategory,
    selectedTransmission,
    selectedFuel,
    selectedSeats,
    maxPrice,
    sortBy,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-r from-[#221B13] via-[#1B1813] to-[#121212] border border-[#35312A] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101010] border border-[#D4AF6A]/30 text-xs text-[#E8C786] mb-2 font-semibold">
            <Car className="w-3.5 h-3.5 text-[#D4AF6A]" />
            Shiva Car &amp; Bike Rental • 15 Premium Cars
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#F5F0E8]">
            Luxury &amp; Executive <span className="gold-gradient-text">Car Fleet</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A6A6A6] mt-1 max-w-xl">
            Explore 15 handpicked cars ranging from fuel-efficient Swift to rugged Mahindra Thar, executive sedans, and high-status Mercedes &amp; Land Rover Defender.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#101010]/90 border border-[#35312A] text-center">
            <div className="text-[10px] text-[#A6A6A6] uppercase">Showing</div>
            <div className="font-serif text-2xl font-bold text-[#E8C786]">
              {filteredCars.length} / 15
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controller Bar */}
      <div className="bg-[#191919] border border-[#35312A] rounded-2xl p-5 space-y-4 shadow-xl">
        {/* Top row: search + sort + reset */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#A6A6A6] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search car brand or model (e.g. Thar, Creta, Fortuner, Defender)..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#101010] border border-[#35312A] rounded-xl text-xs sm:text-sm text-[#F5F0E8] placeholder-[#666] focus:border-[#D4AF6A] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#A6A6A6] whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-[#101010] border border-[#35312A] rounded-xl text-xs text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
              >
                <option value="popular">Most Popular &amp; Top Rated</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
                <option value="alphabetical">Alphabetical Order (A-Z)</option>
              </select>
            </div>

            <button
              onClick={handleResetFilters}
              className="p-2 rounded-xl bg-[#101010] text-[#A6A6A6] hover:text-[#E8C786] border border-[#35312A] hover:border-[#D4AF6A] transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-[#35312A]/60 text-xs">
          {/* Brand */}
          <div>
            <label className="block text-[11px] text-[#A6A6A6] mb-1">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#101010] border border-[#35312A] rounded-lg text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] text-[#A6A6A6] mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#101010] border border-[#35312A] rounded-lg text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-[11px] text-[#A6A6A6] mb-1">Transmission</label>
            <select
              value={selectedTransmission}
              onChange={(e) => setSelectedTransmission(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#101010] border border-[#35312A] rounded-lg text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
            >
              <option value="All">All</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-[11px] text-[#A6A6A6] mb-1">Fuel Type</label>
            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#101010] border border-[#35312A] rounded-lg text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
            >
              <option value="All">All</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
            </select>
          </div>

          {/* Seating */}
          <div>
            <label className="block text-[11px] text-[#A6A6A6] mb-1">Seating</label>
            <select
              value={selectedSeats}
              onChange={(e) => setSelectedSeats(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#101010] border border-[#35312A] rounded-lg text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
            >
              <option value="All">All</option>
              <option value="4">4 Seater (Thar)</option>
              <option value="5">5 Seater (Sedan/SUV)</option>
              <option value="7">7 Seater (Innova/Fortuner/Defender)</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between text-[11px] text-[#A6A6A6] mb-1">
              <span>Max Price</span>
              <span className="text-[#E8C786] font-semibold">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={15000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#D4AF6A]"
            />
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      {filteredCars.length === 0 ? (
        <div className="py-20 text-center bg-[#191919] border border-[#35312A] rounded-3xl space-y-3">
          <Car className="w-12 h-12 text-[#A6A6A6] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#F5F0E8]">
            No cars match your selected filters
          </h3>
          <p className="text-xs text-[#A6A6A6] max-w-sm mx-auto">
            Try adjusting your search query, price slider, or resetting the filter options.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#252018] text-[#E8C786] border border-[#D4AF6A]/40"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
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
      )}
    </div>
  );
};
