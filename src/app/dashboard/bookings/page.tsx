// app/dashboard/bookings/page.tsx
import BookingsPage from '@/components/Dashboard/BookingsPage'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User's Bookings Page - TOBI",

  // other metadata
  description: "Your Full Bookings Page on TOBI",
  icons: "/images/tobi-favicon.png"
};

export default function DashboardPage() {
  return <BookingsPage />
}