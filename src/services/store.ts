import { Vehicle, User, Booking, Review, FilterState } from '../types';
import { INITIAL_VEHICLES, DEMO_USERS, DEMO_REVIEWS } from '../data/vehicles';
import { calculatePriceBreakdown, isVehicleAvailable } from '../utils/pricing';

const STORAGE_KEYS = {
  VEHICLES: 'royal_ride_vehicles_v1',
  USER: 'royal_ride_current_user_v1',
  USERS_LIST: 'royal_ride_users_list_v1',
  BOOKINGS: 'royal_ride_bookings_v1',
  WISHLIST: 'royal_ride_wishlist_v1',
  REVIEWS: 'royal_ride_reviews_v1',
};

// Initial sample bookings
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    bookingReference: 'RR-849120',
    userId: 'user-customer-1',
    userName: 'Shiva Rama Krishna',
    userEmail: 'shiva@royalride.in',
    userMobile: '+91 98888 77777',
    vehicleId: 'car-4',
    vehicle: INITIAL_VEHICLES.find((v) => v.id === 'car-4')!,
    pickupCity: 'Hyderabad',
    pickupDateTime: '2026-11-10T09:00',
    returnDateTime: '2026-11-13T18:00',
    rentalDurationDays: 4,
    priceBreakdown: calculatePriceBreakdown(3000, '2026-11-10T09:00', '2026-11-13T18:00', 4000),
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    paymentDetails: {
      paymentId: 'pay_rr_live_948271',
      orderId: 'order_rr_948271',
      method: 'Razorpay UPI / Netbanking',
      paidAt: '2026-10-25T14:30:00.000Z',
    },
    notes: 'Airport terminal delivery requested.',
    createdAt: '2026-10-25T14:28:00.000Z',
  },
  {
    id: 'booking-2',
    bookingReference: 'RR-729104',
    userId: 'user-customer-2',
    userName: 'Priya Reddy',
    userEmail: 'priya.reddy@example.com',
    userMobile: '+91 97000 11223',
    vehicleId: 'car-12',
    vehicle: INITIAL_VEHICLES.find((v) => v.id === 'car-12')!,
    pickupCity: 'Vijayawada',
    pickupDateTime: '2026-11-15T10:00',
    returnDateTime: '2026-11-17T10:00',
    rentalDurationDays: 2,
    priceBreakdown: calculatePriceBreakdown(8000, '2026-11-15T10:00', '2026-11-17T10:00', 15000),
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    paymentDetails: {
      paymentId: 'pay_rr_live_382910',
      orderId: 'order_rr_382910',
      method: 'Razorpay Credit Card',
      paidAt: '2026-10-26T11:00:00.000Z',
    },
    notes: 'Chauffeured royal wedding arrival.',
    createdAt: '2026-10-26T10:55:00.000Z',
  },
  {
    id: 'booking-3',
    bookingReference: 'RR-619482',
    userId: 'user-customer-1',
    userName: 'Shiva Rama Krishna',
    userEmail: 'shiva@royalride.in',
    userMobile: '+91 98888 77777',
    vehicleId: 'bike-7',
    vehicle: INITIAL_VEHICLES.find((v) => v.id === 'bike-7')!,
    pickupCity: 'Bengaluru',
    pickupDateTime: '2026-10-20T08:00',
    returnDateTime: '2026-10-22T20:00',
    rentalDurationDays: 3,
    priceBreakdown: calculatePriceBreakdown(800, '2026-10-20T08:00', '2026-10-22T20:00', 2500),
    paymentStatus: 'paid',
    bookingStatus: 'completed',
    paymentDetails: {
      paymentId: 'pay_rr_live_109283',
      orderId: 'order_rr_109283',
      method: 'Razorpay UPI',
      paidAt: '2026-10-19T16:00:00.000Z',
    },
    createdAt: '2026-10-19T15:50:00.000Z',
  },
];

export class RentalStore {
  private static getStoredItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return defaultValue;
  }

  private static setStoredItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }

  // Vehicles
  static getVehicles(): Vehicle[] {
    return this.getStoredItem<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
  }

  static saveVehicles(vehicles: Vehicle[]): void {
    this.setStoredItem(STORAGE_KEYS.VEHICLES, vehicles);
  }

  static getVehicleById(id: string): Vehicle | undefined {
    return this.getVehicles().find((v) => v.id === id);
  }

  static addVehicle(vehicle: Omit<Vehicle, 'id'>): Vehicle {
    const list = this.getVehicles();
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `${vehicle.vehicleType}-${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
    };
    list.unshift(newVehicle);
    this.saveVehicles(list);
    return newVehicle;
  }

  static updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | null {
    const list = this.getVehicles();
    const idx = list.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    this.saveVehicles(list);
    return list[idx];
  }

  static deleteVehicle(id: string): boolean {
    const list = this.getVehicles();
    const filtered = list.filter((v) => v.id !== id);
    if (filtered.length !== list.length) {
      this.saveVehicles(filtered);
      return true;
    }
    return false;
  }

  // Users & Auth
  static getUsers(): User[] {
    return this.getStoredItem<User[]>(STORAGE_KEYS.USERS_LIST, DEMO_USERS);
  }

  static getCurrentUser(): User | null {
    return this.getStoredItem<User | null>(STORAGE_KEYS.USER, DEMO_USERS[0]); // Default to Shiva Kumar / Admin or null
  }

  static setCurrentUser(user: User | null): void {
    this.setStoredItem(STORAGE_KEYS.USER, user);
  }

  static registerUser(userData: { name: string; email: string; mobile: string; password: string }): User {
    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      mobile: userData.mobile,
      role: 'customer',
      createdAt: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    };

    users.push(newUser);
    this.setStoredItem(STORAGE_KEYS.USERS_LIST, users);
    this.setCurrentUser(newUser);
    return newUser;
  }

  static loginUser(email: string, password: string):User {
    // Check demo accounts
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanEmail === 'admin@royalride.in' && (cleanPassword === 'admin123' || cleanPassword === 'admin')) {
      const admin = DEMO_USERS[0];
      this.setCurrentUser(admin);
      return admin;
    }

    if (cleanEmail === 'shiva@royalride.in' && (cleanPassword === 'shiva123' || cleanPassword === 'shiva')) {
      const customer = DEMO_USERS[1];
      this.setCurrentUser(customer);
      return customer;
    }

    const users = this.getUsers();
    const match = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!match) {
      throw new Error('Invalid email or password. Please check your credentials or try our demo 1-click login.');
    }

    // For registered users in demo environment
    this.setCurrentUser(match);
    return match;
  }

  static logoutUser(): void {
    this.setCurrentUser(null);
  }

  // Bookings
  static getBookings(): Booking[] {
    return this.getStoredItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }

  static saveBookings(bookings: Booking[]): void {
    this.setStoredItem(STORAGE_KEYS.BOOKINGS, bookings);
  }

  static createBooking(data: {
    userId: string;
    userName: string;
    userEmail: string;
    userMobile: string;
    vehicleId: string;
    pickupCity: string;
    pickupDateTime: string;
    returnDateTime: string;
    options?: { chauffeur?: boolean; extraHelmet?: boolean; couponCode?: string };
    paymentMethod: string;
    notes?: string;
  }): Booking {
    const vehicle = this.getVehicleById(data.vehicleId);
    if (!vehicle) {
      throw new Error('Selected vehicle not found.');
    }

    const allBookings = this.getBookings();

    // Check availability
    const available = isVehicleAvailable(
      vehicle.id,
      data.pickupDateTime,
      data.returnDateTime,
      allBookings
    );

    if (!available) {
      throw new Error('This vehicle is already reserved for the selected dates. Please choose different dates or another vehicle.');
    }

    const breakdown = calculatePriceBreakdown(
      vehicle.dailyPrice,
      data.pickupDateTime,
      data.returnDateTime,
      vehicle.securityDeposit,
      data.options
    );

    const refNumber = `RR-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      bookingReference: refNumber,
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      userMobile: data.userMobile,
      vehicleId: vehicle.id,
      vehicle,
      pickupCity: data.pickupCity,
      pickupDateTime: data.pickupDateTime,
      returnDateTime: data.returnDateTime,
      rentalDurationDays: breakdown.days,
      priceBreakdown: breakdown,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      paymentDetails: {
        paymentId: `pay_rr_${Math.random().toString(36).substring(2, 9)}`,
        orderId: `order_rr_${Math.random().toString(36).substring(2, 9)}`,
        method: data.paymentMethod || 'Razorpay Gateway',
        paidAt: new Date().toISOString(),
      },
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    allBookings.unshift(newBooking);
    this.saveBookings(allBookings);
    return newBooking;
  }

  static updateBookingStatus(
    bookingId: string,
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  ): Booking | null {
    const all = this.getBookings();
    const idx = all.findIndex((b) => b.id === bookingId);
    if (idx === -1) return null;
    all[idx].bookingStatus = status;
    this.saveBookings(all);
    return all[idx];
  }

  // Wishlist
  static getWishlist(): string[] {
    return this.getStoredItem<string[]>(STORAGE_KEYS.WISHLIST, ['car-4', 'bike-7', 'car-12']);
  }

  static toggleWishlist(vehicleId: string): boolean {
    let list = this.getWishlist();
    let isAdded = false;
    if (list.includes(vehicleId)) {
      list = list.filter((id) => id !== vehicleId);
      isAdded = false;
    } else {
      list.push(vehicleId);
      isAdded = true;
    }
    this.setStoredItem(STORAGE_KEYS.WISHLIST, list);
    return isAdded;
  }

  // Reviews
  static getReviews(vehicleId?: string): Review[] {
    const reviews = this.getStoredItem<Review[]>(STORAGE_KEYS.REVIEWS, DEMO_REVIEWS);
    if (vehicleId) {
      return reviews.filter((r) => r.vehicleId === vehicleId);
    }
    return reviews;
  }

  static addReview(data: {
    vehicleId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    bookingReference?: string;
  }): Review {
    const reviews = this.getStoredItem<Review[]>(STORAGE_KEYS.REVIEWS, DEMO_REVIEWS);
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      vehicleId: data.vehicleId,
      userId: data.userId,
      userName: data.userName,
      rating: data.rating,
      comment: data.comment,
      bookingReference: data.bookingReference,
      createdAt: new Date().toISOString(),
    };
    reviews.unshift(newRev);
    this.setStoredItem(STORAGE_KEYS.REVIEWS, reviews);
    return newRev;
  }
}
