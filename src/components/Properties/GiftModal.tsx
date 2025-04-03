'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { DateRange } from 'react-day-picker'
import { differenceInDays } from 'date-fns'
import AvailabilityCalendar from './AvailabilityCalendar'
import axios from '@/lib/axios'

interface GiftModalProps {
  propertyId: number
  title: string
  pricePerNight: number
  onClose: () => void
}

const GiftModal = ({ propertyId, title, pricePerNight, onClose }: GiftModalProps) => {
  const [recipientEmail, setRecipientEmail] = useState('')
  const [message, setMessage] = useState('')
  const [dateRange, setDateRange] = useState<DateRange>()
  const [userData, setUserData] = useState<{
    fullName: string
    email: string
    phone: string
  } | null>(null)

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/auth/profile/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const user = res.data.user
        setUserData({
          fullName: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.primary_phone || 'N/A'
        })
      } catch (err) {
        toast.error('Failed to load user profile')
      }
    }

    if (token) fetchProfile()
  }, [token])

  const nights = dateRange?.from && dateRange?.to
    ? differenceInDays(dateRange.to, dateRange.from)
    : 0

  const total = pricePerNight * nights

  const handleGift = async () => {
    if (!token) return toast.error('Login required')
    if (!recipientEmail) return toast.error('Recipient email is required')
    if (!dateRange?.from || !dateRange?.to) return toast.error('Select check-in and check-out dates')
    if (nights < 1) return toast.error('Minimum 1 night required')
    if (!userData) return toast.error('User profile not loaded')

    try {
      const res = await axios.post(
        '/auth/gift/initiate-payment/',
        {
          recipient_email: recipientEmail,
          message,
          gifted_property: propertyId,
          check_in: dateRange.from,
          check_out: dateRange.to
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const { payment_link, tx_ref } = res.data

      if (!payment_link || !tx_ref) {
        return toast.error('Invalid payment initiation response.')
      }

      // Redirect to Flutterwave checkout
      window.location.href = payment_link

    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to initiate payment.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-3xl bg-white p-6 rounded-md overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg font-semibold mb-4">Gift This Property</h2>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {/* Email */}
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            required
            placeholder="Recipient email"
            className="w-full rounded border px-3 py-2"
          />

          {/* Message */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message (optional)"
            className="w-full rounded border px-3 py-2"
          />

          {/* Calendar */}
          <div>
            <label className="block text-sm mb-1">Select Booking Dates</label>
            <AvailabilityCalendar
              propertyId={propertyId}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </div>

          {/* Summary */}
          {nights > 0 && pricePerNight != null && total != null && (
            <p className="text-sm font-medium text-black">
              {nights} night(s) × ₦{pricePerNight.toLocaleString()} = <b>₦{total.toLocaleString()}</b>
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleGift}
              className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/80"
            >
              Pay & Gift
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GiftModal