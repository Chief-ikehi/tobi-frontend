'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { formatCurrency } from '@/utils/format'
import { DateRange } from 'react-day-picker'
import { differenceInDays } from 'date-fns'
import axios from '@/lib/axios'
import AvailabilityCalendar from './AvailabilityCalendar'
import { useUserDashboard } from '@/components/hooks/useUserDashboard'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

interface BookingFormProps {
  propertyId: number
  title: string
  pricePerNight: number
}

const BookingForm = ({ propertyId, title, pricePerNight }: BookingFormProps) => {
  const [dateRange, setDateRange] = useState<DateRange>()
  const [guests, setGuests] = useState(1)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'flutterwave'>('flutterwave')

  const { data, loading } = useUserDashboard()
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  const router = useRouter()

  const handleBooking = async () => {
    if (!token) return toast.error('Login required to book.')
    if (!dateRange?.from || !dateRange?.to) return toast.error('Select booking dates.')
    if (!acceptedTerms) return toast.error('Please accept terms.')

    const nights = differenceInDays(dateRange.to, dateRange.from)
    if (nights < 1) return toast.error('Minimum 1 night required.')

    const total = pricePerNight * nights

    // WALLET PAYMENT FLOW
    if (paymentMethod === 'wallet') {
      if (data?.user.role !== 'investor') return toast.error('Only investors can use wallet.')
      if (data?.wallet_balance == null) return toast.error('No wallet found.')
      if (data.wallet_balance < total) return toast.error('Insufficient wallet balance.')

      try {
        const res = await axios.post(
          '/auth/book/',
          {
            property: propertyId,
            check_in: format(dateRange.from, 'yyyy-MM-dd'),
            check_out: format(dateRange.to, 'yyyy-MM-dd'),
            payment_method: 'wallet',
            total_price: total,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (res.status === 201) {
          toast.success('Booking confirmed via wallet!', { position: 'top-center' })
          setTimeout(() => {
            router.push('/dashboard/bookings')
          }, 1500)

        } else {
          toast.error('Booking failed.', { position: 'top-center' })
        }
      } catch (err: any) {
          const message = err.response?.data
            ? JSON.stringify(err.response.data)
            : 'Unknown error'
          toast.error(`Wallet booking failed: ${message}`, { position: 'top-center' })
        }

      return
    }

    // FLUTTERWAVE PAYMENT FLOW
    try {
      const res = await axios.post(
        '/auth/booking/initiate-payment/',
        {
          property_id: propertyId,
          check_in: dateRange.from,
          check_out: dateRange.to,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const { payment_link, tx_ref } = res.data

      if (!payment_link || !tx_ref) {
        return toast.error('Could not generate payment link.')
      }

      window.location.href = payment_link
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to initiate payment.')
    }
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-5">
      {/* Calendar */}
      <div>
        <label className="block mb-1 text-sm font-medium">Select Dates</label>
        <AvailabilityCalendar
          propertyId={propertyId}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </div>

      {/* Guests */}
      <div>
        <label className="block mb-1 text-sm font-medium">Guests</label>
        <input
          type="number"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full rounded-md border px-3 py-2"
          min={1}
          max={10}
        />
      </div>

      {/* Payment method */}
      <div>
        <label className="block mb-1 text-sm font-medium">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as 'wallet' | 'flutterwave')}
          className="w-full rounded-md border px-3 py-2"
        >
          <option value="flutterwave">Card / Transfer</option>
          <option value="wallet">Wallet</option>
        </select>
      </div>

      {/* Terms */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
        />
        <label className="text-sm">I agree to the terms and conditions</label>
      </div>

      <button
        onClick={handleBooking}
        type="submit"
        className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/80"
        disabled={loading}
      >
        Book Now ({formatCurrency(pricePerNight)} per night)
      </button>
    </form>
  )
}

export default BookingForm