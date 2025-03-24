"use client";

import { Property } from "@/types/property";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/format";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";

interface Booking {
  id: string;
  propertyId: string;
  property: Property;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  transactionRef: string;
  paymentStatus: "PAID" | "PENDING" | "FAILED";
  createdAt: string;
}

interface BookingConfirmationProps {
  bookingId: string;
}

const BookingConfirmation = ({ bookingId }: BookingConfirmationProps) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}`);
        if (!response.ok) {
          throw new Error("Booking not found");
        }
        const data = await response.json();
        setBooking(data);
      } catch (error) {
        console.error("Error fetching booking:", error);
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="animate-pulse">
          <div className="h-[400px] w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-black dark:text-white">
            Booking Not Found
          </h1>
          <p className="mb-8 text-body-color">
            We couldn't find the booking you're looking for.
          </p>
          <Link
            href="/properties"
            className="inline-flex items-center rounded-lg bg-primary px-8 py-4 text-white transition-all hover:bg-primary/90"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="mx-auto max-w-3xl">
        {/* Success Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-500">
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-black dark:text-white">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-body-color">
            Your booking has been confirmed and the property owner has been notified.
          </p>
        </div>

        {/* Booking Details */}
        <div className="overflow-hidden rounded-lg bg-white shadow-solid-8 dark:bg-blacksection">
          {/* Property Preview */}
          <div className="relative h-[200px] w-full">
            <Image
              src={booking.property.images[0]}
              alt={booking.property.title}
              className="object-cover"
              fill
            />
          </div>

          {/* Details */}
          <div className="p-7.5">
            <div className="mb-6 border-b border-stroke pb-6 dark:border-strokedark">
              <h2 className="mb-2 text-2xl font-semibold text-black dark:text-white">
                {booking.property.title}
              </h2>
              <p className="text-body-color">{booking.property.location}</p>
            </div>

            <div className="mb-6 grid gap-4 border-b border-stroke pb-6 dark:border-strokedark sm:grid-cols-2">
              <div>
                <h3 className="mb-1 text-sm font-medium text-body-color">Check-in</h3>
                <p className="text-base font-medium text-black dark:text-white">
                  {format(new Date(booking.checkIn), "EEE, MMM d, yyyy")}
                </p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium text-body-color">Check-out</h3>
                <p className="text-base font-medium text-black dark:text-white">
                  {format(new Date(booking.checkOut), "EEE, MMM d, yyyy")}
                </p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium text-body-color">Guests</h3>
                <p className="text-base font-medium text-black dark:text-white">
                  {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                </p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium text-body-color">Booking ID</h3>
                <p className="text-base font-medium text-black dark:text-white">
                  {booking.id}
                </p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="mb-6 border-b border-stroke pb-6 dark:border-strokedark">
              <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Payment Details
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-body-color">Total Amount</span>
                <span className="text-lg font-semibold text-black dark:text-white">
                  {formatCurrency(booking.totalAmount)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-body-color">Payment Status</span>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    booking.paymentStatus === "PAID"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : booking.paymentStatus === "PENDING"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {booking.paymentStatus}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-body-color">Transaction Reference</span>
                <span className="font-mono text-sm text-black dark:text-white">
                  {booking.transactionRef}
                </span>
              </div>
            </div>

            {/* Host Details */}
            <div className="mb-6">
              <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Property Host
              </h3>
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={booking.property.agent.avatar}
                    alt={booking.property.agent.name}
                    className="object-cover"
                    fill
                  />
                </div>
                <div>
                  <h4 className="text-base font-medium text-black dark:text-white">
                    {booking.property.agent.name}
                  </h4>
                  <p className="text-sm text-body-color">
                    Contact: {booking.property.agent.phone_number}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/properties/${booking.propertyId}`}
                className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-white transition-all hover:bg-primary/90"
              >
                View Property
              </Link>
              <Link
                href="/bookings"
                className="inline-flex items-center rounded-lg border border-stroke px-6 py-3 text-body-color transition-all hover:border-primary hover:text-primary dark:border-strokedark"
              >
                View All Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 