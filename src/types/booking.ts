export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface Booking {
  id: string;
  userId: string;
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentIntentId?: string;
  transactionId?: string;
  additionalServices?: string[];
  additionalServicesPrice?: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  property: {
    id: string;
    title: string;
    images: string[];
    price: number;
    address: string;
    city: string;
    state: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
} 