import { Booking, BookingWithDetails, mockBookings } from '../mock/bookings';
import { propertyService } from './propertyService';
import { userService } from './userService';

export interface BookingFilters {
  userId?: string;
  propertyId?: string;
  status?: Booking['status'];
  paymentStatus?: Booking['paymentStatus'];
  startDate?: string;
  endDate?: string;
}

export interface BookingSearchParams extends BookingFilters {
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'price';
  sortOrder?: 'asc' | 'desc';
}

export class BookingService {
  private bookings: Booking[] = mockBookings;

  // Get all bookings with optional filtering
  async getBookings(params: BookingSearchParams = {}): Promise<{
    bookings: BookingWithDetails[];
    total: number;
    page: number;
    limit: number;
  }> {
    let filteredBookings = [...this.bookings];

    // Apply filters
    if (params.userId) {
      filteredBookings = filteredBookings.filter(booking => booking.userId === params.userId);
    }

    if (params.propertyId) {
      filteredBookings = filteredBookings.filter(booking => booking.propertyId === params.propertyId);
    }

    if (params.status) {
      filteredBookings = filteredBookings.filter(booking => booking.status === params.status);
    }

    if (params.paymentStatus) {
      filteredBookings = filteredBookings.filter(booking => booking.paymentStatus === params.paymentStatus);
    }

    if (params.startDate) {
      filteredBookings = filteredBookings.filter(booking => booking.checkIn >= params.startDate!);
    }

    if (params.endDate) {
      filteredBookings = filteredBookings.filter(booking => booking.checkOut <= params.endDate!);
    }

    // Apply sorting
    if (params.sortBy) {
      filteredBookings.sort((a, b) => {
        const order = params.sortOrder === 'desc' ? -1 : 1;
        switch (params.sortBy) {
          case 'date':
            return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order;
          case 'price':
            return (a.totalPrice.amount - b.totalPrice.amount) * order;
          default:
            return 0;
        }
      });
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedBookings = filteredBookings.slice(start, end);

    // Fetch related data
    const bookingsWithDetails = await Promise.all(
      paginatedBookings.map(async booking => {
        const property = await propertyService.getPropertyById(booking.propertyId);
        const user = await userService.getUserById(booking.userId);
        return {
          ...booking,
          property: property!,
          user: user!
        };
      })
    );

    return {
      bookings: bookingsWithDetails,
      total: filteredBookings.length,
      page,
      limit
    };
  }

  // Get a single booking by ID
  async getBookingById(id: string): Promise<BookingWithDetails | null> {
    const booking = this.bookings.find(booking => booking.id === id);
    if (!booking) return null;

    const property = await propertyService.getPropertyById(booking.propertyId);
    const user = await userService.getUserById(booking.userId);

    return {
      ...booking,
      property: property!,
      user: user!
    };
  }

  // Create a new booking
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    // Check property availability
    const isAvailable = await propertyService.checkAvailability(
      bookingData.propertyId,
      bookingData.checkIn,
      bookingData.checkOut
    );

    if (!isAvailable) {
      throw new Error('Property is not available for the selected dates');
    }

    const newBooking: Booking = {
      ...bookingData,
      id: `booking${this.bookings.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.bookings.push(newBooking);
    return newBooking;
  }

  // Update booking status
  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking | null> {
    const bookingIndex = this.bookings.findIndex(booking => booking.id === id);
    if (bookingIndex === -1) return null;

    const updatedBooking: Booking = {
      ...this.bookings[bookingIndex],
      status,
      updatedAt: new Date().toISOString()
    };
    this.bookings[bookingIndex] = updatedBooking;
    return updatedBooking;
  }

  // Update payment status
  async updatePaymentStatus(id: string, paymentStatus: Booking['paymentStatus']): Promise<Booking | null> {
    const bookingIndex = this.bookings.findIndex(booking => booking.id === id);
    if (bookingIndex === -1) return null;

    const updatedBooking: Booking = {
      ...this.bookings[bookingIndex],
      paymentStatus,
      updatedAt: new Date().toISOString()
    };
    this.bookings[bookingIndex] = updatedBooking;
    return updatedBooking;
  }

  // Cancel booking
  async cancelBooking(id: string): Promise<Booking | null> {
    return this.updateBookingStatus(id, 'cancelled');
  }

  // Get user's bookings
  async getUserBookings(userId: string): Promise<BookingWithDetails[]> {
    const { bookings } = await this.getBookings({ userId });
    return bookings;
  }

  // Get property's bookings
  async getPropertyBookings(propertyId: string): Promise<BookingWithDetails[]> {
    const { bookings } = await this.getBookings({ propertyId });
    return bookings;
  }
}

// Export a singleton instance
export const bookingService = new BookingService(); 