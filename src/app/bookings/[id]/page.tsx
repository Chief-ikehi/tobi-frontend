'use client';

import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { GET_BOOKING } from '@/lib/graphql/bookings';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { downloadReceipt } from '@/lib/generateReceipt';
import { useSession } from 'next-auth/react';

export default function BookingConfirmationPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const { data, loading, error } = useQuery(GET_BOOKING, {
    variables: { id },
  });

  if (loading) {
    return <BookingSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Booking</h1>
          <p className="text-gray-600">{error.message}</p>
          <Link href="/bookings">
            <Button className="mt-4">View All Bookings</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const booking = data.booking;

  const handleDownloadReceipt = () => {
    if (!data?.booking || !session?.user) return;

    const receiptData = {
      booking: {
        ...data.booking,
        checkInDate: new Date(data.booking.checkInDate),
        checkOutDate: new Date(data.booking.checkOutDate),
        createdAt: new Date(data.booking.createdAt),
      },
      user: {
        name: session.user.name || '',
        email: session.user.email || '',
      },
    };

    downloadReceipt(receiptData);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Booking Confirmation</h1>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm ${
              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {booking.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              booking.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
              booking.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              booking.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {booking.paymentStatus}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Property Details</h2>
            <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
              <Image
                src={booking.property.images[0]}
                alt={booking.property.title}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-lg font-medium">{booking.property.title}</h3>
            <p className="text-gray-600">
              {booking.property.address}, {booking.property.city}, {booking.property.state}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in</span>
                <span>{format(new Date(booking.checkInDate), 'PPP')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out</span>
                <span>{format(new Date(booking.checkOutDate), 'PPP')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price per night</span>
                <span>{formatCurrency(booking.property.price)}</span>
              </div>
              {booking.additionalServices?.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Additional Services</span>
                  <span>{formatCurrency(booking.additionalServicesPrice || 0)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total Price</span>
                <span>{formatCurrency(booking.totalPrice)}</span>
              </div>
            </div>

            {booking.specialRequests && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Special Requests</h3>
                <p className="text-gray-600">{booking.specialRequests}</p>
              </div>
            )}

            <div className="mt-6 space-x-4">
              <Link href="/bookings">
                <Button variant="outline">View All Bookings</Button>
              </Link>
              {booking.status === 'CONFIRMED' && (
                <Button onClick={handleDownloadReceipt}>
                  Download Receipt
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function BookingSkeleton() {
  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 