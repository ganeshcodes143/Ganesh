import React, { useState, useMemo } from 'react';
import {
  Bike,
  Filter,
  Search,
  RotateCcw,
  Sparkles,
  Shield,
  Gauge,
} from 'lucide-react';
import { Vehicle } from '../types';
import { VehicleCard } from '../components/VehicleCard';

interface BikesPageProps {
  vehicles: Vehicle[];
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onViewDetails: (vehicle: Vehicle) => void;
  onBookNow: (vehicle: Vehicle) => void;
}

export const BikesPage: React.FC<BikesPageProps> = ({
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
  const [selectedCcRange, setSelectedCcRange] = useState('All');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState<'low-to-high' | 'high-to-low' | 'alphabetical' | 'popular'>('popular');

  const bikeList = useMemo(() => vehicles.filter((v) => v.vehicleType === 'bike'), [vehicles]);

  // Extract unique brands and categories
  const brands = useMemo(() => ['All', ...Array.from(new Set(bikeList.map((b) => b.brand)))], [bikeList]);
  const categories = useMemo(() => ['All', ...Array.from(new Set(bikeList.map((b) => b.category)))], [bikeList]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('All');
    setSelectedCategory('All');
    setSelectedCcRange('All');
    setMaxPrice(3000);
    setSortBy('popular');
  };

  const filteredBikes = useMemo(() => {
    return bikeList
      .filter((bike) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            bike.brand.toLowerCase().includes(q) ||
            bike.model.toLowerCase().includes(q) ||
            bike.category.toLowerCase().includes(q);
          if (!match) return false;
        }

        if (selectedBrand !== 'All' && bike.brand !== selectedBrand) return false;
        if (selectedCategory !== 'All' && bike.category !== selectedCategory) return false;

        const cc = bike.specifications.engineCapacityCc || 0;
        if (selectedCcRange === 'under-150' && cc >= 150) return false;
        if (selectedCcRange === '150-300' && (cc < 150 || cc > 300)) return false;
        if (selectedCcRange === 'above-300' && cc <= 300) return false;

        if (bike.dailyPrice > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'low-to-high') return a.dailyPrice - b.dailyPrice;
        if (sortBy === 'high-to-low') return b.dailyPrice - a.dailyPrice;
        if (sortBy === 'alphabetical') return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
        return b.rating - a.rating;
      });
  }, [
    bikeList,
    searchQuery,
    selectedBrand,
    selectedCategory,
    selectedCcRange,
    maxPrice,
    sortBy,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-r from-[#1E1912] via-[#241F16] to-[#121212] border border-[#35312A] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101010] border border-[#D4AF6A]/30 text-xs text-[#E8C786] mb-2 font-semibold">
            <Bike className="w-3.5 h-3.5 text-[#D4AF6A]" />
            Shiva Car &amp; Bike Rental • 15 Performance Motorcycles
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#F5F0E8]">
            Superbikes &amp; Highway <span className="gold-gradient-text">Cruiser Fleet</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A6A6A6] mt-1 max-w-xl">
            From city commuter Splendor &amp; Honda SP 125 to legendary Royal Enfield Classic, Himalayan 450, KTM Duke 390, Kawasaki Ninja 650, and Ducati Monster.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#101010]/90 border border-[#35312A] text-center">
            <div className="text-[10px] text-[#A6A6A6] uppercase">Showing</div>
            <div className="font-serif text-2xl font-bold text-[#E8C786]">
              {filteredBikes.length} / 15
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#191919] border border-[#35312A] rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#A6A6A6] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search motorcycle brand or model (e.g. Classic 350, MT-15, Duke, Monster)..."
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-[#35312A]/60 text-xs">
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
            <label className="block text-[11px] text-[#A6A6A6] mb-1">Bike Category</label>
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

          {/* Engine Capacity */}
          <div>
            <label className="block text-[11px] text-[#A6A6A6] mb-1">Engine Capacity</label>
            <select
              value={selectedCcRange}
              onChange={(e) => setSelectedCcRange(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#101010] border border-[#35312A] rounded-lg text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
            >
              <option value="All">All Displacements</option>
              <option value="under-150">Under 150 cc (Commuter)</option>
              <option value="150-300">150 cc - 300 cc (Street / Sports)</option>
              <option value="above-300">Above 300 cc (Cruiser / Superbike)</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between text-[11px] text-[#A6A6A6] mb-1">
              <span>Max Daily Price</span>
              <span className="text-[#E8C786] font-semibold">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={300}
              max={3000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#D4AF6A]"
            />
          </div>
        </div>
      </div>

      {/* Bikes Grid */}
      {filteredBikes.length === 0 ? (
        <div className="py-20 text-center bg-[#191919] border border-[#35312A] rounded-3xl space-y-3">
          <Bike className="w-12 h-12 text-[#A6A6A6] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#F5F0E8]">
            No motorcycles match your selected filters
          </h3>
          <p className="text-xs text-[#A6A6A6] max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters.
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
          {filteredBikes.map((bike) => (
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
      )}
    </div>
  );
};
