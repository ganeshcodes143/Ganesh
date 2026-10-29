import { Booking, BookingPriceBreakdown } from '../types';

export const GST_RATE = 0.18; // 18% standard GST for vehicle rentals in India

/**
 * Calculates billable rental days based on pickup and return datetime strings.
 * Minimum rental period is 1 day. Partial 24-hr blocks round up.
 */
export function calculateRentalDays(pickupDateTime: string, returnDateTime: string): number {
  if (!pickupDateTime || !returnDateTime) return 1;

  const start = new Date(pickupDateTime).getTime();
  const end = new Date(returnDateTime).getTime();

  if (isNaN(start) || isNaN(end) || end <= start) {
    return 1;
  }

  const diffMs = end - start;
  const hours = diffMs / (1000 * 60 * 60);

  // In Indian car & bike rentals, rentals are charged in 24-hour cycles.
  // E.g., 26 hours counts as 2 days.
  const days = Math.ceil(hours / 24);
  return Math.max(1, days);
}

/**
 * Validates rental pickup and return dates.
 */
export function validateRentalDates(
  pickupDateTime: string,
  returnDateTime: string
): { valid: boolean; error?: string } {
  if (!pickupDateTime) {
    return { valid: false, error: 'Please select a pickup date and time.' };
  }
  if (!returnDateTime) {
    return { valid: false, error: 'Please select a return date and time.' };
  }

  const start = new Date(pickupDateTime).getTime();
  const end = new Date(returnDateTime).getTime();
  const now = new Date().getTime();

  if (isNaN(start) || isNaN(end)) {
    return { valid: false, error: 'Invalid date format selected.' };
  }

  // Allow a 5 minute buffer for slight clock discrepancy
  if (start < now - 5 * 60 * 1000) {
    return { valid: false, error: 'Pickup time cannot be in the past.' };
  }

  if (end <= start) {
    return { valid: false, error: 'Return date & time must be after the pickup date & time.' };
  }

  const diffHours = (end - start) / (1000 * 60 * 60);
  if (diffHours < 4) {
    return { valid: false, error: 'Minimum rental period is 4 hours.' };
  }

  return { valid: true };
}

export interface PricingOptions {
  chauffeur?: boolean; // ₹800/day
  extraHelmet?: boolean; // ₹50/day
  insuranceCover?: boolean; // ₹150/day
  couponCode?: string; // 'ROYAL10' for 10% off, 'SHIVA500' for ₹500 off
}

/**
 * Computes full price breakdown according to published rental rules.
 */
export function calculatePriceBreakdown(
  dailyRate: number,
  pickupDateTime: string,
  returnDateTime: string,
  depositRate: number = 2000,
  options: PricingOptions = {}
): BookingPriceBreakdown {
  const days = calculateRentalDays(pickupDateTime, returnDateTime);
  const baseAmount = dailyRate * days;

  let extrasAmount = 0;
  if (options.chauffeur) extrasAmount += 800 * days;
  if (options.extraHelmet) extrasAmount += 50 * days;
  if (options.insuranceCover) extrasAmount += 150 * days;

  const taxableAmount = baseAmount + extrasAmount;
  const gstAmount = Math.round(taxableAmount * GST_RATE);

  let discountAmount = 0;
  if (options.couponCode) {
    const code = options.couponCode.trim().toUpperCase();
    if (code === 'ROYAL10') {
      discountAmount = Math.round(taxableAmount * 0.1);
    } else if (code === 'SHIVA500') {
      discountAmount = Math.min(taxableAmount, 500);
    }
  }

  const securityDeposit = depositRate;
  const finalTotal = taxableAmount + gstAmount + securityDeposit - discountAmount;

  return {
    dailyRate,
    days,
    baseAmount,
    gstAmount,
    securityDeposit,
    extrasAmount,
    discountAmount,
    finalTotal: Math.max(0, finalTotal),
  };
}

/**
 * Checks if a vehicle has conflicting confirmed or pending reservations.
 */
export function isVehicleAvailable(
  vehicleId: string,
  pickupDateTime: string,
  returnDateTime: string,
  bookings: Booking[],
  excludeBookingId?: string
): boolean {
  const reqStart = new Date(pickupDateTime).getTime();
  const reqEnd = new Date(returnDateTime).getTime();

  if (isNaN(reqStart) || isNaN(reqEnd) || reqEnd <= reqStart) {
    return false;
  }

  for (const b of bookings) {
    if (b.vehicleId !== vehicleId) continue;
    if (excludeBookingId && b.id === excludeBookingId) continue;
    if (b.bookingStatus === 'cancelled') continue;

    const bStart = new Date(b.pickupDateTime).getTime();
    const bEnd = new Date(b.returnDateTime).getTime();

    // Overlap condition:
    // (reqStart < bEnd) and (reqEnd > bStart)
    if (reqStart < bEnd && reqEnd > bStart) {
      return false;
    }
  }

  return true;
}

/**
 * Formats amount into Indian Rupees format, e.g. ₹12,000
 */
export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
