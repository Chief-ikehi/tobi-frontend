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

const BookingsList = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`);
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="space-y-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-[200px] w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-black dark:text-white">
            No Bookings Found
          </h1>
          <p className="mb-8 text-body-color">
            You haven't made any bookings yet. Start exploring properties to book your stay!
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
      <div className="mb-12">
        <h1 className="mb-2 text-3xl font-bold text-black dark:text-white">
          My Bookings
        </h1>
        <p className="text-lg text-body-color">
          View and manage your property bookings
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <Link
            key={booking.id}
            href={`/bookings/${booking.id}`}
            className="group overflow-hidden rounded-lg bg-white shadow-solid-8 transition-all hover:shadow-solid-12 dark:bg-blacksection"
          >
            {/* Property Image */}
            <div className="relative h-[200px] w-full">
              <Image
                src={booking.property.images[0]}
                alt={booking.property.title}
                className="object-cover transition-transform group-hover:scale-105"
                fill
              />
              <div className="absolute right-4 top-4">
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
            </div>

            {/* Booking Details */}
            <div className="p-6">
              <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">
                {booking.property.title}
              </h2>
              <p className="mb-4 text-body-color">{booking.property.location}</p>

              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-body-color">Check-in</span>
                  <span className="text-sm font-medium text-black dark:text-white">
                    {format(new Date(booking.checkIn), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-body-color">Check-out</span>
                  <span className="text-sm font-medium text-black dark:text-white">
                    {format(new Date(booking.checkOut), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-body-color">Guests</span>
                  <span className="text-sm font-medium text-black dark:text-white">
                    {booking.guests}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-stroke pt-4 dark:border-strokedark">
                <span className="text-body-color">Total Amount</span>
                <span className="text-lg font-semibold text-black dark:text-white">
                  {formatCurrency(booking.totalAmount)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BookingsList; 