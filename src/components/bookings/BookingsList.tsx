'use client';

import { useQuery } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GET_USER_BOOKINGS } from '@/lib/graphql/bookings';
import { BookingStatus, PaymentStatus } from '@/types/booking';

interface Property {
  id: string;
  title: string;
  images: string[];
  location: {
    city: string;
    state: string;
  };
}

interface Booking {
  id: string;
  propertyId: string;
  property: Property;
  checkInDate: string;
  checkOutDate: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
}

interface BookingsListProps {
  bookings: Booking[];
  onCancelBooking?: (bookingId: string) => void;
}

export const BookingsList: React.FC<BookingsListProps> = () => {
  const { data, loading, error } = useQuery<{ bookings: Booking[] }>(GET_USER_BOOKINGS);

  if (loading) return null;
  if (error) return <div>Error loading bookings</div>;
  if (!data?.bookings?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
        <Link href="/properties">
          <Button>Browse Properties</Button>
        </Link>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return format(new Date(date), 'PPP');
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'bg-green-100 text-green-800';
      case BookingStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case BookingStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'bg-green-100 text-green-800';
      case PaymentStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case PaymentStatus.REFUNDED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-4">
      {data.bookings.map((booking: Booking) => (
        <Card key={booking.id} className="p-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative h-[150px] md:col-span-1">
              <Image
                src={booking.property.images[0]}
                alt={booking.property.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-2">
                {booking.property.title}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Check-in: {formatDate(booking.checkInDate)}</p>
                <p>Check-out: {formatDate(booking.checkOutDate)}</p>
                <p className="font-medium text-black">
                  Total: ₦{booking.totalAmount}
                </p>
              </div>
            </div>
            <div className="space-y-2 md:col-span-1">
              <div className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                {booking.status}
              </div>
              <div className={`inline-block px-2 py-1 rounded-full text-sm ${getPaymentStatusColor(booking.paymentStatus)}`}>
                {booking.paymentStatus}
              </div>
              <Link href={`/bookings/${booking.id}`} className="block">
                <Button className="w-full" variant="outline">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}; 