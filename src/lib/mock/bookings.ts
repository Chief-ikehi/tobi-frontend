import { Property } from './properties';
import { User } from './users';

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: {
    amount: number;
    currency: string;
  };
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingWithDetails extends Booking {
  property: Property;
  user: User;
}

export const mockBookings: Booking[] = [
  {
    id: 'booking1',
    propertyId: '1',
    userId: 'user1',
    checkIn: '2024-03-15',
    checkOut: '2024-03-20',
    guests: 2,
    status: 'confirmed',
    totalPrice: {
      amount: 750000,
      currency: 'NGN'
    },
    paymentStatus: 'paid',
    specialRequests: 'Early check-in requested',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'booking2',
    propertyId: '2',
    userId: 'user1',
    checkIn: '2024-04-01',
    checkOut: '2024-04-05',
    guests: 1,
    status: 'pending',
    totalPrice: {
      amount: 480000,
      currency: 'NGN'
    },
    paymentStatus: 'pending',
    createdAt: '2024-03-02T00:00:00Z',
    updatedAt: '2024-03-02T00:00:00Z'
  }
]; 