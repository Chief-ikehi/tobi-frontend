'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import Image from 'next/image'
import { formatCurrency } from '@/utils/format'
import { FaThLarge, FaList, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa'

type Booking = {
  id: number
  check_in: string
  check_out: string
  payment_method: string
  total_price: string
  status: string
  property: number
}

type Property = {
  id: number
  title: string
  images: string[]
  location: string
}

type BookingMap = {
  past: Booking[]
  current: Booking[]
  upcoming: Booking[]
}

const tabs = ['upcoming', 'current', 'past']

export default function UserBookingsSection() {
  const [bookings, setBookings] = useState<BookingMap>({
    past: [],
    current: [],
    upcoming: [],
  })
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'past' | 'current' | 'upcoming'>('upcoming')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [showCancelled, setShowCancelled] = useState(false)
  const [page, setPage] = useState(1)
  const perPage = 4

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, propertiesRes] = await Promise.all([
          axios.get('/auth/dashboard/'),
          axios.get('/api/properties/'),
        ])
        setBookings(bookingsRes.data.bookings || {})
        setProperties(propertiesRes.data || [])
      } catch {
        toast.error('Failed to load bookings or properties')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getProperty = (id: number) => properties.find((p) => p.id === id)

  const filteredBookings = (bookings[activeTab] || []).filter((b) =>
    showCancelled ? b.status === 'cancelled' : b.status !== 'cancelled'
  )

  const totalPages = Math.ceil(filteredBookings.length / perPage)
  const paginatedBookings = filteredBookings.slice((page - 1) * perPage, page * perPage)

  const cancelBooking = async (bookingId: number) => {
    const confirm = window.confirm('Are you sure you want to cancel this booking?')
    if (!confirm) return

    try {
      const res = await axios.post(`/auth/cancel-booking/${bookingId}/`)
      toast.success(res.data.message || 'Booking cancelled.', { position: 'top-center' })

      setBookings((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((b) => b.id !== bookingId),
      }))
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Cancellation failed.', { position: 'top-center' })
    }
  }

  const StatusTag = ({ status }: { status: string }) => {
    const icon =
      status === 'confirmed' ? (
        <FaCheckCircle className="inline mr-1 text-green-600" />
      ) : status === 'cancelled' ? (
        <FaTimesCircle className="inline mr-1 text-red-600" />
      ) : (
        <FaClock className="inline mr-1 text-yellow-600" />
      )

    const color =
      status === 'confirmed'
        ? 'text-green-600'
        : status === 'cancelled'
        ? 'text-red-600'
        : 'text-yellow-600'

    return (
      <span className={`text-xs mt-1 block font-medium ${color}`}>
        {icon}
        {status.toUpperCase()}
      </span>
    )
  }

  if (loading) return <div className="text-center py-10">Loading bookings...</div>

  return (
    <div>
      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white dark:bg-blacksection rounded shadow p-4">
            <p className="text-sm text-gray-500">Upcoming</p>
            <p className="text-lg font-semibold">
              {bookings.upcoming.filter((b) => b.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white dark:bg-blacksection rounded shadow p-4">
            <p className="text-sm text-gray-500">Current</p>
            <p className="text-lg font-semibold">
              {bookings.current.filter((b) => b.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white dark:bg-blacksection rounded shadow p-4">
            <p className="text-sm text-gray-500">Past</p>
            <p className="text-lg font-semibold">
              {bookings.past.filter((b) => b.status === 'confirmed').length}
            </p>
          </div>
        </div>

      {/* Tabs + View Toggle + Cancel Toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`capitalize px-4 py-2 rounded ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
            }`}
            onClick={() => {
              setActiveTab(tab as 'past' | 'current' | 'upcoming')
              setPage(1)
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Toggle Group (active/cancelled + list/grid) */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowCancelled((prev) => !prev)}
          className="text-sm underline text-primary"
        >
          {showCancelled ? 'Back to Active Bookings' : 'View Cancelled Bookings'}
        </button>
        <button
          onClick={() => setViewMode((v) => (v === 'list' ? 'grid' : 'list'))}
          className="text-sm text-primary p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          title={viewMode === 'list' ? 'Switch to Grid View' : 'Switch to List View'}
        >
          {viewMode === 'list' ? <FaThLarge size={18} /> : <FaList size={18} />}
        </button>
      </div>
    </div>

      {/* Bookings */}
      {paginatedBookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedBookings.map((booking) => {
            const property = getProperty(booking.property)
            return (
              <div key={booking.id} className="bg-white dark:bg-blacksection rounded shadow p-4">
                <div className="relative w-full h-40 rounded overflow-hidden mb-3">
                  <Image
                    src={property?.images?.[0] || '/placeholder.jpg'}
                    alt={property?.title || 'Property'}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-1">{property?.title || 'Untitled'}</h3>
                <p className="text-sm text-gray-500">{property?.location || 'Unknown'}</p>
                <p className="text-sm mt-1">
                  {format(new Date(booking.check_in), 'dd MMM')} –{' '}
                  {format(new Date(booking.check_out), 'dd MMM yyyy')}
                </p>
                <p className="text-sm mt-1">
                  Paid: {formatCurrency(parseFloat(booking.total_price))} via{' '}
                  {booking.payment_method}
                </p>
                <StatusTag status={booking.status} />

                {activeTab === 'upcoming' && booking.status !== 'cancelled' && (
                  <button
                    onClick={() => cancelBooking(booking.id)}
                    className="mt-2 px-3 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedBookings.map((booking) => {
            const property = getProperty(booking.property)
            return (
              <div
                key={booking.id}
                className="bg-white dark:bg-blacksection rounded shadow p-4 flex gap-4"
              >
                <div className="relative w-32 h-24 rounded overflow-hidden">
                  <Image
                    src={property?.images?.[0] || '/placeholder.jpg'}
                    alt={property?.title || 'Property'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{property?.title || 'Untitled Property'}</h3>
                  <p className="text-sm text-gray-500">{property?.location || 'Unknown'}</p>
                  <p className="text-sm mt-1">
                    {format(new Date(booking.check_in), 'dd MMM')} –{' '}
                    {format(new Date(booking.check_out), 'dd MMM yyyy')}
                  </p>
                  <p className="text-sm mt-1">
                    Paid: {formatCurrency(parseFloat(booking.total_price))} via{' '}
                    {booking.payment_method}
                  </p>
                  <StatusTag status={booking.status} />

                  {activeTab === 'upcoming' && booking.status !== 'cancelled' && (
                    <div className="mt-3">
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="px-3 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-6 space-x-3 text-sm">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}