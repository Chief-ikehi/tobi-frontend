'use client';

import { useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { GET_USER_BOOKINGS } from '@/lib/graphql/bookings';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';

interface Booking {
  id: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  property: {
    title: string;
    images: string[];
  };
}

export default function BookingsPage() {
  const { data: session } = useSession();
  const { data, loading, error } = useQuery(GET_USER_BOOKINGS);

  if (!session) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Sign in to View Bookings</h1>
          <p className="text-gray-600 mb-4">Please sign in to view your bookings.</p>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <BookingsSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Bookings</h1>
          <p className="text-gray-600">{error.message}</p>
        </Card>
      </div>
    );
  }

  const bookings = data.bookings as Booking[];

  if (bookings.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">No Bookings Found</h1>
          <p className="text-gray-600 mb-4">You haven't made any bookings yet.</p>
          <Link href="/properties">
            <Button>Browse Properties</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Your Bookings</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <Link key={booking.id} href={`/bookings/${booking.id}`}>
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={booking.property.images[0]}
                  alt={booking.property.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    booking.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                    booking.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    booking.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>
              <h3 className="font-medium mb-2">{booking.property.title}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Check-in: {format(new Date(booking.checkInDate), 'PP')}</div>
                <div>Check-out: {format(new Date(booking.checkOutDate), 'PP')}</div>
                <div className="font-medium text-black">
                  Total: {formatCurrency(booking.totalPrice)}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function BookingsSkeleton() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-5 w-2/3 mb-2" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 