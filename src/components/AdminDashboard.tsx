import React, { useState } from 'react';
import {
  ShieldCheck,
  Car,
  Bike,
  Plus,
  Edit2,
  Trash2,
  CalendarCheck,
  Users,
  IndianRupee,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Check,
  AlertCircle,
  X,
  MapPin,
} from 'lucide-react';
import { Vehicle, Booking, User } from '../types';
import { RentalStore } from '../services/store';
import { formatCurrencyINR } from '../utils/pricing';
import { SUPPORTED_CITIES } from '../data/vehicles';

interface AdminDashboardProps {
  onViewVehicle: (vehicle: Vehicle) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewVehicle }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'vehicles' | 'bookings' | 'users'>('stats');
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => RentalStore.getVehicles());
  const [bookings, setBookings] = useState<Booking[]>(() => RentalStore.getBookings());
  const [users, setUsers] = useState<User[]>(() => RentalStore.getUsers());

  // Search & filter for vehicles
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<'all' | 'car' | 'bike'>('all');

  // Add / Edit Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formBrand, setFormBrand] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formType, setFormType] = useState<'car' | 'bike'>('car');
  const [formCategory, setFormCategory] = useState('SUV');
  const [formDailyPrice, setFormDailyPrice] = useState('2500');
  const [formDeposit, setFormDeposit] = useState('3000');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  // Compute stats
  const totalVehiclesCount = vehicles.length;
  const availableVehiclesCount = vehicles.filter((v) => v.active).length;
  const totalBookingsCount = bookings.length;
  const confirmedBookingsCount = bookings.filter((b) => b.bookingStatus === 'confirmed').length;
  const completedBookingsCount = bookings.filter((b) => b.bookingStatus === 'completed').length;
  const totalRevenue = bookings
    .filter((b) => b.bookingStatus !== 'cancelled')
    .reduce((sum, b) => sum + (b.priceBreakdown?.finalTotal || 0), 0);

  const handleOpenAddModal = () => {
    setEditingVehicle(null);
    setFormBrand('');
    setFormModel('');
    setFormType('car');
    setFormCategory('SUV');
    setFormDailyPrice('2500');
    setFormDeposit('3000');
    setFormImageUrl('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80');
    setFormDescription('Luxury commercial rental vehicle impeccably maintained by Shiva Car & Bike Rental.');
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormBrand(vehicle.brand);
    setFormModel(vehicle.model);
    setFormType(vehicle.vehicleType);
    setFormCategory(vehicle.category);
    setFormDailyPrice(String(vehicle.dailyPrice));
    setFormDeposit(String(vehicle.securityDeposit));
    setFormImageUrl(vehicle.imageUrls[0] || '');
    setFormDescription(vehicle.description);
    setIsEditModalOpen(true);
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(formDailyPrice) || 2000;
    const deposit = Number(formDeposit) || 3000;

    if (editingVehicle) {
      RentalStore.updateVehicle(editingVehicle.id, {
        brand: formBrand,
        model: formModel,
        vehicleType: formType,
        category: formCategory,
        dailyPrice: price,
        securityDeposit: deposit,
        imageUrls: [formImageUrl],
        description: formDescription,
      });
      setNotice(`Updated ${formBrand} ${formModel} successfully.`);
    } else {
      RentalStore.addVehicle({
        brand: formBrand,
        model: formModel,
        vehicleType: formType,
        category: formCategory,
        dailyPrice: price,
        securityDeposit: deposit,
        imageUrls: [formImageUrl],
        description: formDescription,
        rating: 5.0,
        reviewCount: 1,
        active: true,
        supportedCities: SUPPORTED_CITIES,
        features: ['Full Insurance', 'Clean Interior', 'Fast GPS', 'Commercial Permit'],
        specifications: {
          transmission: 'Automatic',
          fuelType: 'Petrol',
          seatingCapacity: formType === 'car' ? 5 : undefined,
          engineCapacityCc: formType === 'bike' ? 250 : undefined,
          mileage: formType === 'car' ? '16 km/l' : '40 km/l',
          airConditioning: formType === 'car',
          helmetIncluded: formType === 'bike',
        },
      });
      setNotice(`Added ${formBrand} ${formModel} to Shiva Fleet.`);
    }

    setVehicles(RentalStore.getVehicles());
    setIsEditModalOpen(false);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleDeleteVehicle = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name} from active fleet?`)) {
      RentalStore.deleteVehicle(id);
      setVehicles(RentalStore.getVehicles());
      setNotice(`Removed ${name} from inventory.`);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const handleToggleActive = (v: Vehicle) => {
    RentalStore.updateVehicle(v.id, { active: !v.active });
    setVehicles(RentalStore.getVehicles());
  };

  const handleUpdateBookingStatus = (
    bookingId: string,
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  ) => {
    RentalStore.updateBookingStatus(bookingId, status);
    setBookings(RentalStore.getBookings());
    setNotice(`Booking status updated to ${status}.`);
    setTimeout(() => setNotice(null), 3000);
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (vehicleTypeFilter !== 'all' && v.vehicleType !== vehicleTypeFilter) return false;
    if (vehicleSearch.trim()) {
      const q = vehicleSearch.toLowerCase();
      return (
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#201A12] via-[#2A2216] to-[#191919] border border-[#D4AF6A]/50 shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#101010] border border-[#D4AF6A] flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-[#D4AF6A]" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-[#E8C786] font-bold">
              Shiva Car &amp; Bike Rental • Admin Control
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F0E8]">
              Royal Ride Fleet Management
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF6A] to-[#E8C786] text-[#101010] font-bold text-xs flex items-center gap-2 hover:brightness-110 shadow-lg shadow-[#D4AF6A]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vehicle</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#35312A] gap-6">
        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'stats'
              ? 'text-[#D4AF6A] border-b-2 border-[#D4AF6A]'
              : 'text-[#A6A6A6] hover:text-[#F5F0E8]'
          }`}
        >
          <IndianRupee className="w-4 h-4" />
          Analytics &amp; Statistics
        </button>

        <button
          onClick={() => setActiveTab('vehicles')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'vehicles'
              ? 'text-[#D4AF6A] border-b-2 border-[#D4AF6A]'
              : 'text-[#A6A6A6] hover:text-[#F5F0E8]'
          }`}
        >
          <Car className="w-4 h-4" />
          Fleet Inventory ({vehicles.length})
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'bookings'
              ? 'text-[#D4AF6A] border-b-2 border-[#D4AF6A]'
              : 'text-[#A6A6A6] hover:text-[#F5F0E8]'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          Reservations ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'users'
              ? 'text-[#D4AF6A] border-b-2 border-[#D4AF6A]'
              : 'text-[#A6A6A6] hover:text-[#F5F0E8]'
          }`}
        >
          <Users className="w-4 h-4" />
          Customers ({users.length})
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#191919] border border-[#35312A] space-y-1">
              <div className="text-xs uppercase text-[#A6A6A6]">Total Vehicles</div>
              <div className="font-serif text-3xl font-bold text-[#E8C786]">
                {totalVehiclesCount}
              </div>
              <div className="text-[11px] text-emerald-400 font-medium">
                {availableVehiclesCount} Available for Immediate Hire
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#191919] border border-[#35312A] space-y-1">
              <div className="text-xs uppercase text-[#A6A6A6]">Total Bookings</div>
              <div className="font-serif text-3xl font-bold text-[#F5F0E8]">
                {totalBookingsCount}
              </div>
              <div className="text-[11px] text-[#A6A6A6]">
                {confirmedBookingsCount} Active Confirmed
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#191919] border border-[#35312A] space-y-1">
              <div className="text-xs uppercase text-[#A6A6A6]">Gross Rental Revenue</div>
              <div className="font-serif text-3xl font-bold text-[#E8C786]">
                {formatCurrencyINR(totalRevenue)}
              </div>
              <div className="text-[11px] text-emerald-400 font-medium">
                via Razorpay Online Gateway
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#191919] border border-[#35312A] space-y-1">
              <div className="text-xs uppercase text-[#A6A6A6]">Registered Users</div>
              <div className="font-serif text-3xl font-bold text-[#F5F0E8]">{users.length}</div>
              <div className="text-[11px] text-[#A6A6A6]">Verified Driving Licenses</div>
            </div>
          </div>

          {/* Quick Hub Distribution */}
          <div className="p-6 rounded-2xl bg-[#191919] border border-[#35312A] space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#F5F0E8]">
              Operating City Hubs (Shiva Car &amp; Bike Rental)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {SUPPORTED_CITIES.map((c) => (
                <div
                  key={c}
                  className="p-3 rounded-xl bg-[#101010] border border-[#35312A] text-center"
                >
                  <MapPin className="w-4 h-4 text-[#D4AF6A] mx-auto mb-1" />
                  <div className="text-xs font-semibold text-[#F5F0E8]">{c}</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Active Fleet Hub</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vehicles Inventory Tab */}
      {activeTab === 'vehicles' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#191919] p-4 rounded-xl border border-[#35312A]">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#A6A6A6] absolute left-3 top-2.5" />
              <input
                type="text"
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
                placeholder="Search brand, model..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#101010] border border-[#35312A] rounded-lg text-xs text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#A6A6A6]">Type:</span>
              {(['all', 'car', 'bike'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setVehicleTypeFilter(t)}
                  className={`px-3 py-1 rounded-lg capitalize font-medium ${
                    vehicleTypeFilter === t
                      ? 'bg-[#D4AF6A] text-[#101010]'
                      : 'bg-[#101010] text-[#A6A6A6] hover:text-[#F5F0E8]'
                  }`}
                >
                  {t === 'all' ? 'All (30)' : t === 'car' ? 'Cars (15)' : 'Bikes (15)'}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#35312A] bg-[#191919]">
            <table className="w-full text-left text-xs text-[#A6A6A6]">
              <thead className="bg-[#101010] text-[#E8C786] uppercase text-[10px] tracking-wider border-b border-[#35312A]">
                <tr>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Daily Price</th>
                  <th className="py-3 px-4">Deposit</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#35312A]/60">
                {filteredVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-[#202020] transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={v.imageUrls[0]}
                        alt={v.model}
                        className="w-12 h-9 rounded object-cover border border-[#35312A]"
                      />
                      <div>
                        <div className="font-semibold text-[#F5F0E8]">
                          {v.brand} {v.model}
                        </div>
                        <div className="text-[10px] font-mono text-[#D4AF6A]">
                          {v.plateNumber || 'Verified Fleet'}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-[#F5F0E8]">{v.category}</td>
                    <td className="py-3 px-4 capitalize">{v.vehicleType}</td>
                    <td className="py-3 px-4 font-semibold text-[#E8C786]">
                      {formatCurrencyINR(v.dailyPrice)}
                    </td>
                    <td className="py-3 px-4">{formatCurrencyINR(v.securityDeposit)}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(v)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                          v.active
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {v.active ? 'Available' : 'Maintenance'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(v)}
                        className="p-1.5 rounded bg-[#101010] text-[#E8C786] hover:bg-[#252018] border border-[#35312A]"
                        title="Edit vehicle details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteVehicle(v.id, `${v.brand} ${v.model}`)}
                        className="p-1.5 rounded bg-red-950/30 text-red-400 hover:bg-red-900/40 border border-red-900/50"
                        title="Remove vehicle"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bookings Management Tab */}
      {activeTab === 'bookings' && (
        <div className="overflow-x-auto rounded-xl border border-[#35312A] bg-[#191919]">
          <table className="w-full text-left text-xs text-[#A6A6A6]">
            <thead className="bg-[#101010] text-[#E8C786] uppercase text-[10px] tracking-wider border-b border-[#35312A]">
              <tr>
                <th className="py-3 px-4">Ref Code</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#35312A]/60">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#202020] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#E8C786]">
                    {b.bookingReference}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#F5F0E8]">{b.userName}</div>
                    <div className="text-[10px] text-[#A6A6A6]">{b.userMobile}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-[#F5F0E8]">{b.vehicle.model}</div>
                    <div className="text-[10px]">{b.vehicle.brand}</div>
                  </td>
                  <td className="py-3 px-4">{b.pickupCity}</td>
                  <td className="py-3 px-4">
                    <div>
                      {new Date(b.pickupDateTime).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="text-[10px] text-neutral-500">{b.rentalDurationDays} Days</div>
                  </td>
                  <td className="py-3 px-4 font-serif font-bold text-[#F5F0E8]">
                    {formatCurrencyINR(b.priceBreakdown.finalTotal)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        b.bookingStatus === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : b.bookingStatus === 'completed'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    {b.bookingStatus !== 'confirmed' && (
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                        className="px-2 py-1 bg-emerald-950/40 text-emerald-300 border border-emerald-800 rounded text-[10px] font-semibold hover:bg-emerald-900/50"
                      >
                        Confirm
                      </button>
                    )}
                    {b.bookingStatus !== 'completed' && (
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, 'completed')}
                        className="px-2 py-1 bg-blue-950/40 text-blue-300 border border-blue-800 rounded text-[10px] font-semibold hover:bg-blue-900/50"
                      >
                        Complete
                      </button>
                    )}
                    {b.bookingStatus !== 'cancelled' && (
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                        className="px-2 py-1 bg-red-950/40 text-red-300 border border-red-800 rounded text-[10px] font-semibold hover:bg-red-900/50"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="overflow-x-auto rounded-xl border border-[#35312A] bg-[#191919]">
          <table className="w-full text-left text-xs text-[#A6A6A6]">
            <thead className="bg-[#101010] text-[#E8C786] uppercase text-[10px] tracking-wider border-b border-[#35312A]">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#35312A]/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#202020]">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-8 h-8 rounded-full border border-[#35312A]"
                    />
                    <span className="font-semibold text-[#F5F0E8]">{u.name}</span>
                  </td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">{u.mobile}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-[#D4AF6A]/20 text-[#E8C786] border border-[#D4AF6A]/30'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {u.role === 'admin' ? 'Fleet Admin' : 'Customer'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(u.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Vehicle Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#151515] border border-[#35312A] rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#A6A6A6] hover:text-[#F5F0E8]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-[#F5F0E8]">
              {editingVehicle ? 'Edit Vehicle Details' : 'Add New Vehicle to Fleet'}
            </h3>

            <form onSubmit={handleSaveVehicle} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A6A6A6] mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="e.g. BMW, Royal Enfield"
                    className="w-full px-3 py-2 bg-[#101010] border border-[#35312A] rounded-lg text-[#F5F0E8]"
                  />
                </div>
                <div>
                  <label className="block text-[#A6A6A6] mb-1">Model Name</label>
                  <input
                    type="text"
                    required
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    placeholder="e.g. 3 Series, Classic 350"
                    className="w-full px-3 py-2 bg-[#101010] border border-[#35312A] rounded-lg text-[#F5F0E8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A6A6A6] mb-1">Vehicle Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as 'car' | 'bike')}
                    className="w-full px-3 py-2 bg-[#101010] border border-[#35312A] rounded-lg text-[#F5F0E8]"
                  >
                    <option value="car">Car (4-Wheeler)</option>
                    <option value="bike">Bike (2-Wheeler)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#A6A6A6] mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g. SUV, Sports Bike"
                    className="w-full px-3 py-2 bg-[#101010] border border-[#35312A] rounded-lg text-[#F5F0E8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A6A6A6] mb-1">Daily Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={formDailyPrice}
                    onChange={(e) => setFormDailyPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-[#101010] border border-[#35312A] rounded-lg text-[#F5F0E8]"
                  />
                </div>
                <div>
                  <label className="block text-[#A6A6A6] mb-1">Refundable Deposit (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={formDeposit}
                    onChange={(e) => setFormDeposit(e.target.value)}
                    className="w-full px-3 py-2 bg-[#101010] border border-[#35312A] rounded-lg text-[#F5F0E8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A6A6A6] mb-1">Photograph URL</label>
                <input
                  type="url"
                  required
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#101010] border border-[#35312A] rounded-lg text-[#F5F0E8]"
                />
              </div>

              <div>
                <label className="block text-[#A6A6A6] mb-1">Vehicle Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#101010] border border-[#35312A] rounded-lg text-[#F5F0E8]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#191919] border border-[#35312A] text-[#A6A6A6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#D4AF6A] to-[#E8C786] text-[#101010] font-bold"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
