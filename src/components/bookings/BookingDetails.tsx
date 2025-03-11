"use client";
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GET_BOOKING} from '@/lib/graphql/bookings';
import { BookingStatus, PaymentStatus } from '@/types/booking';

interface BookingDetailsProps {
  bookingId: string;
}

export default function BookingDetails({ bookingId }: BookingDetailsProps) {
  const { data, loading, error } = useQuery(GET_BOOKING, {
    variables: { id: bookingId },
  });

  if (loading) return null;
  if (error) return <div>Error loading booking details</div>;

  const booking = data.booking;
  const isBookingCancellable = 
    booking.status !== BookingStatus.CANCELLED && 
    booking.status !== BookingStatus.COMPLETED;

  const handlePayment = async () => {
    // TODO: Implement Flutterwave payment integration
    console.log('Processing payment...');
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'PPP');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Booking Details</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card className="p-4">
            <div className="relative h-[200px] w-full mb-4">
              <Image
                src={booking.property.images[0]}
                alt={booking.property.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">{booking.property.title}</h2>
            <p className="text-gray-600 mb-2">
              {booking.property.address}, {booking.property.city}, {booking.property.state}
            </p>
            <div className="space-y-2">
              <p>Check-in: {formatDate(booking.checkInDate)}</p>
              <p>Check-out: {formatDate(booking.checkOutDate)}</p>
              <p className="font-semibold">Total Price: ₦{booking.totalPrice}</p>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Booking Status</h3>
            <div className="space-y-2">
              <p>Status: <span className="font-medium">{booking.status}</span></p>
              <p>Payment Status: <span className="font-medium">{booking.paymentStatus}</span></p>
              {booking.specialRequests && (
                <div>
                  <p className="font-medium">Special Requests:</p>
                  <p className="text-gray-600">{booking.specialRequests}</p>
                </div>
              )}
            </div>
          </Card>

          <div className="space-y-2">
            {booking.paymentStatus === PaymentStatus.PENDING && (
              <Button onClick={handlePayment} className="w-full">
                Pay Now
              </Button>
            )}
            {isBookingCancellable && (
              <Button variant="outline" className="w-full">
                Cancel Booking
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 