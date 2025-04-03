'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'
import UserHeader from './UserHeader'
import BookingHistorySection from './BookingHistorySection'
import FavoritesSection from './FavoritesSection'
import GiftSection from './GiftSection'

const UserDashboard = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('/auth/dashboard/')
        setData(res.data)
      } catch {
        toast.error('Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return <div className="text-center py-20">Loading your dashboard...</div>
  }

  const { bookings, favorites, gifts, user, investment_summary, wallet_balance } = data

  return (
    <section className="container py-10">
      <UserHeader user={user} />

      {/* Investor Wallet Summary */}
      {user.role === 'investor' && (
        <div className="mb-6 p-4 bg-gray-100 dark:bg-dark-2 rounded">
          <p className="font-medium">
            <span className="text-gray-700">Wallet Balance:</span>{' '}
            <span className="text-green-700 font-bold">₦{parseFloat(wallet_balance).toLocaleString()}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            (Your wallet is only usable for bookings)
          </p>
        </div>
      )}

      {/* Bookings */}
      <BookingHistorySection
          past={bookings.past}
          current={bookings.current}
          upcoming={bookings.upcoming}
        />

      {/* Favorites */}
      <FavoritesSection favorites={favorites} />

      {/* Gifts */}
      <GiftSection sent={gifts.sent} received={gifts.received} />
    </section>
  )
}

export default UserDashboard


