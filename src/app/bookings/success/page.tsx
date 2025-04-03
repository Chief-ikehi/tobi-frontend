import { Suspense } from 'react'
import BookingSuccessPage from '@/components/Bookings/SuccessPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Booking Verified - TOBI',
  description: 'Confirmation page for verified TOBI bookings',
  icons: '/images/tobi-favicon.png'
}

export default function BookingSuccessRoute() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Verifying your booking...</div>}>
      <BookingSuccessPage />
    </Suspense>
  )
}
