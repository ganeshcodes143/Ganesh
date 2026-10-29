export type VehicleType = 'car' | 'bike';

export interface VehicleSpecifications {
  transmission: 'Manual' | 'Automatic';
  fuelType?: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  seatingCapacity?: number;
  engineCapacityCc?: number;
  mileage?: string;
  airConditioning?: boolean;
  topSpeed?: string;
  bootSpace?: string;
  helmetIncluded?: boolean;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  vehicleType: VehicleType;
  category: string;
  dailyPrice: number;
  securityDeposit: number;
  imageUrls: string[];
  description: string;
  specifications: VehicleSpecifications;
  features: string[];
  supportedCities: string[];
  active: boolean;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  plateNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'customer' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface BookingPriceBreakdown {
  dailyRate: number;
  days: number;
  baseAmount: number;
  gstAmount: number; // 18% GST in India
  securityDeposit: number; // Refundable deposit
  extrasAmount: number;
  discountAmount: number;
  finalTotal: number;
}

export interface Booking {
  id: string;
  bookingReference: string;
  userId: string;
  userName: string;
  userEmail: string;
  userMobile: string;
  vehicleId: string;
  vehicle: Vehicle;
  pickupCity: string;
  pickupDateTime: string;
  returnDateTime: string;
  rentalDurationDays: number;
  priceBreakdown: BookingPriceBreakdown;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  bookingStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentDetails?: {
    paymentId: string;
    orderId: string;
    method: string;
    paidAt: string;
  };
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  vehicleId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  bookingReference?: string;
  createdAt: string;
}

export interface FilterState {
  type?: VehicleType | 'all';
  searchQuery: string;
  brand: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  transmission: string;
  fuelType: string;
  city: string;
  sortBy: 'price-low-high' | 'price-high-low' | 'alphabetical' | 'rating';
}
