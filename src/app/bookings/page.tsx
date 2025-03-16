import { Metadata } from "next";
import BookingsList from "@/components/Bookings/BookingsList";

export const metadata: Metadata = {
  title: "My Bookings - TOBI",
  description: "View and manage your property bookings",
};

export default function BookingsPage() {
  return <BookingsList />;
} 