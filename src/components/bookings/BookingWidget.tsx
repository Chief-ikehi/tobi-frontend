'use client';

import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { Property } from '@/lib/services/propertyService';

interface BookingWidgetProps {
  propertyId: string;
  property: Property;
}

export function BookingWidget({ propertyId, property }: BookingWidgetProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [date, setDate] = useState<DateRange | undefined>();
  const [specialRequests, setSpecialRequests] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateTotalNights = () => {
    if (!date?.from || !date?.to) return 0;
    const nights = Math.ceil(
      (date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)
    );
    return nights;
  };

  const calculateTotalPrice = () => {
    const nights = calculateTotalNights();
    return property.price.amount * nights;
  };

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '',
    tx_ref: `TOBI-${Date.now()}`,
    amount: calculateTotalPrice(),
    currency: property.price.currency,
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: session?.user?.email || '',
      phone_number: '',
      name: session?.user?.name || '',
    },
    customizations: {
      title: 'TOBI Property Booking',
      description: `Booking payment for ${property.title}`,
      logo: '/images/tobi-logo-dark.svg',
    },
    meta: {
      propertyId,
      checkInDate: date?.from?.toISOString(),
      checkOutDate: date?.to?.toISOString(),
      specialRequests,
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handleBooking = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (!date?.from || !date?.to) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    setIsProcessing(true);

    try {
      handleFlutterPayment({
        callback: async (response) => {
          if (response.status === 'successful') {
            // Here you would typically create the booking in your database
            // For now, we'll just show success and redirect
            toast.success('Booking successful!');
            router.push('/bookings');
          } else {
            toast.error('Payment failed. Please try again.', {
              position: "top-center",
              duration: 4000,
            });
          }
          closePaymentModal();
          setIsProcessing(false);
        },
        onClose: () => {
          setIsProcessing(false);
          toast.error('Payment cancelled', {
            position: "top-center",
            duration: 4000,
          });
        },
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment processing failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleSpecialRequestsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSpecialRequests(e.target.value);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <Label>Select Dates</Label>
          <Calendar
            mode="range"
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            disabled={{ before: new Date() }}
            className="rounded-md border"
          />
        </div>

        {date?.from && date?.to && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{format(date.from, 'MMM d, yyyy')} - {format(date.to, 'MMM d, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span>{property.price.amount.toLocaleString()} {property.price.currency} x {calculateTotalNights()} nights</span>
              <span>{calculateTotalPrice().toLocaleString()} {property.price.currency}</span>
            </div>
            
            <div className="border-t pt-2">
              <Label>Special Requests</Label>
              <Textarea
                value={specialRequests}
                onChange={handleSpecialRequestsChange}
                placeholder="Any special requests?"
                className="mt-1"
              />
            </div>

            <Button
              onClick={handleBooking}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Processing Payment...' : 'Book Now'}
            </Button>

            {!session && (
              <p className="text-sm text-gray-500 text-center">
                Please sign in to book this property
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
} 