import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRentalDays,
  calculatePriceBreakdown,
  isVehicleAvailable,
  formatCurrencyINR,
  GST_RATE,
} from './pricing';
import { Booking } from '../types';

test('calculateRentalDays handles standard 24-hour cycles', () => {
  // Exactly 24 hours -> 1 day
  const start = '2026-11-01T10:00:00.000Z';
  const end24 = '2026-11-02T10:00:00.000Z';
  assert.equal(calculateRentalDays(start, end24), 1);

  // 26 hours -> rounds up to 2 days
  const end26 = '2026-11-02T12:00:00.000Z';
  assert.equal(calculateRentalDays(start, end26), 2);

  // 72 hours (3 days)
  const end72 = '2026-11-04T10:00:00.000Z';
  assert.equal(calculateRentalDays(start, end72), 3);
});

test('calculatePriceBreakdown computes Thar example (₹3000 x 3 days)', () => {
  const start = '2026-11-01T10:00:00.000Z';
  const end = '2026-11-04T10:00:00.000Z'; // 3 days
  const dailyPrice = 3000;
  const deposit = 3000;

  const breakdown = calculatePriceBreakdown(dailyPrice, start, end, deposit);
  assert.equal(breakdown.days, 3);
  assert.equal(breakdown.baseAmount, 9000);
  assert.equal(breakdown.gstAmount, Math.round(9000 * GST_RATE));
  assert.equal(breakdown.securityDeposit, 3000);
  assert.equal(breakdown.extrasAmount, 0);
  assert.equal(breakdown.discountAmount, 0);

  const expectedTotal = 9000 + Math.round(9000 * 0.18) + 3000;
  assert.equal(breakdown.finalTotal, expectedTotal);
});

test('calculatePriceBreakdown handles coupons and extras', () => {
  const start = '2026-11-01T10:00:00.000Z';
  const end = '2026-11-02T10:00:00.000Z'; // 1 day
  const dailyPrice = 2000;
  const deposit = 1500;

  const breakdown = calculatePriceBreakdown(dailyPrice, start, end, deposit, {
    chauffeur: true, // ₹800
    couponCode: 'ROYAL10', // 10% of (2000 + 800) = 280
  });

  assert.equal(breakdown.days, 1);
  assert.equal(breakdown.baseAmount, 2000);
  assert.equal(breakdown.extrasAmount, 800);
  assert.equal(breakdown.discountAmount, 280);
  const taxable = 2800;
  const gst = Math.round(taxable * 0.18); // 504
  const expectedTotal = taxable + gst + 1500 - 280;
  assert.equal(breakdown.finalTotal, expectedTotal);
});

test('isVehicleAvailable detects booking overlaps correctly', () => {
  const vehicleId = 'car-thar-04';
  const existingBookings: Booking[] = [
    {
      id: 'b1',
      bookingReference: 'RR-1001',
      userId: 'u1',
      userName: 'Ramesh Kumar',
      userEmail: 'ramesh@example.com',
      userMobile: '9876543210',
      vehicleId,
      vehicle: {} as any,
      pickupCity: 'Hyderabad',
      pickupDateTime: '2026-11-05T10:00:00.000Z',
      returnDateTime: '2026-11-08T10:00:00.000Z',
      rentalDurationDays: 3,
      priceBreakdown: {} as any,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      createdAt: '2026-10-25T10:00:00.000Z',
    },
  ];

  // Overlap 1: starts inside existing
  const overlap1 = isVehicleAvailable(
    vehicleId,
    '2026-11-06T10:00:00.000Z',
    '2026-11-09T10:00:00.000Z',
    existingBookings
  );
  assert.equal(overlap1, false);

  // Overlap 2: encompasses existing
  const overlap2 = isVehicleAvailable(
    vehicleId,
    '2026-11-04T10:00:00.000Z',
    '2026-11-09T10:00:00.000Z',
    existingBookings
  );
  assert.equal(overlap2, false);

  // Free before existing
  const freeBefore = isVehicleAvailable(
    vehicleId,
    '2026-11-01T10:00:00.000Z',
    '2026-11-04T10:00:00.000Z',
    existingBookings
  );
  assert.equal(freeBefore, true);

  // Free after existing
  const freeAfter = isVehicleAvailable(
    vehicleId,
    '2026-11-09T10:00:00.000Z',
    '2026-11-12T10:00:00.000Z',
    existingBookings
  );
  assert.equal(freeAfter, true);
});

test('formatCurrencyINR formats Indian currency properly', () => {
  const formatted = formatCurrencyINR(12000);
  assert.match(formatted, /12,000/);
});
