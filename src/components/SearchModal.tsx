import React, { useState, useMemo } from 'react';
import { Search, X, Car, Bike, Star, ChevronRight } from 'lucide-react';
import { Vehicle } from '../types';
import { formatCurrencyINR } from '../utils/pricing';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  onSelectVehicle,
}) => {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'car' | 'bike'>('all');

  const results = useMemo(() => {
    return vehicles
      .filter((v) => {
        if (typeFilter !== 'all' && v.vehicleType !== typeFilter) return false;
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          v.brand.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q)
        );
      })
      .slice(0, 8);
  }, [vehicles, query, typeFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#151515] border border-[#35312A] rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#35312A] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#D4AF6A] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 15 cars & 15 bikes (e.g. Swift, Thar, Defender, Classic 350, Duke)..."
            className="w-full bg-transparent text-sm text-[#F5F0E8] placeholder-[#666] focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1 rounded-full text-[#A6A6A6] hover:text-[#F5F0E8]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-4 py-2.5 bg-[#101010] border-b border-[#35312A] flex items-center justify-between text-xs text-[#A6A6A6]">
          <div className="flex gap-2">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 rounded-md ${
                typeFilter === 'all' ? 'bg-[#D4AF6A] text-[#101010] font-bold' : 'hover:text-[#F5F0E8]'
              }`}
            >
              All (30)
            </button>
            <button
              onClick={() => setTypeFilter('car')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 ${
                typeFilter === 'car' ? 'bg-[#D4AF6A] text-[#101010] font-bold' : 'hover:text-[#F5F0E8]'
              }`}
            >
              <Car className="w-3.5 h-3.5" /> Cars
            </button>
            <button
              onClick={() => setTypeFilter('bike')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 ${
                typeFilter === 'bike' ? 'bg-[#D4AF6A] text-[#101010] font-bold' : 'hover:text-[#F5F0E8]'
              }`}
            >
              <Bike className="w-3.5 h-3.5" /> Bikes
            </button>
          </div>
          <span>Showing top {results.length} results</span>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-[#35312A]/60">
          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#A6A6A6]">
              No vehicles found matching &ldquo;{query}&rdquo;.
            </div>
          ) : (
            results.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  onSelectVehicle(v);
                  onClose();
                }}
                className="w-full text-left p-3.5 hover:bg-[#1f1f1f] flex items-center justify-between gap-4 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={v.imageUrls[0]}
                    alt={v.model}
                    className="w-14 h-10 object-cover rounded-lg border border-[#35312A]"
                  />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#D4AF6A]">
                      {v.brand} • {v.category}
                    </div>
                    <div className="font-serif text-sm font-bold text-[#F5F0E8] group-hover:text-[#E8C786]">
                      {v.model}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-serif text-sm font-bold text-[#E8C786]">
                      {formatCurrencyINR(v.dailyPrice)}
                    </div>
                    <div className="text-[10px] text-[#A6A6A6]">/ day</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#A6A6A6] group-hover:text-[#D4AF6A] transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
