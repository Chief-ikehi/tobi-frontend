import { Metadata } from "next";
import BookingConfirmation from "@/components/Bookings/BookingConfirmation";

export const metadata: Metadata = {
  title: "Booking Confirmation - TOBI",
  description: "View your booking details and confirmation",
};

type ParamsType = {
  params: Promise<{ id: string }>;
};

export default async function BookingConfirmationPage({ params }: ParamsType) {
  const { id } = await params;
  return <BookingConfirmation bookingId={id} />;
} 