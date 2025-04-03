'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { useState } from 'react'

interface Booking {
  id: number
  property: number
  check_in: string
  check_out: string
  payment_method: string
  total_price: string
  status: string
  created_at: string
}

interface Props {
  past: Booking[]
  current: Booking[]
  upcoming: Booking[]
}

function BookingGroup({ title, bookings }: { title: string; bookings: Booking[] }) {
  const filtered = bookings.filter((b) => b.status !== 'cancelled')

  const [page, setPage] = useState(1)
  const perPage = 3
  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  if (filtered.length === 0) return null

  return (
    <div className="mb-10">
      <h3 className="text-lg font-medium mb-3">{title}</h3>
      <div className="space-y-4">
        {paginated.map((b) => (
          <div
            key={b.id}
            className="rounded border px-4 py-3 bg-white dark:bg-blacksection shadow-sm"
          >
            <p className="text-sm">
              Property:{' '}
              <Link href={`/properties/${b.property}`} className="text-primary underline">
                #{b.property}
              </Link>
            </p>
            <p className="text-sm">
              Stay: {format(new Date(b.check_in), 'dd MMM')} –{' '}
              {format(new Date(b.check_out), 'dd MMM yyyy')}
            </p>
            <p className="text-sm">
              Status:{' '}
              <span
                className={`text-xs ${
                  b.status === 'cancelled'
                    ? 'text-red-600'
                    : b.status === 'confirmed'
                    ? 'text-green-600'
                    : 'text-gray-600'
                }`}
              >
                {b.status}
              </span>
            </p>
            <p className="text-sm">Payment: {b.payment_method}</p>
            <p className="text-sm font-medium text-black dark:text-white">
              ₦{parseFloat(b.total_price).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-4 space-x-2 text-sm">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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

export default function BookingHistorySection({ past, current, upcoming }: Props) {
  const filteredPast = past.filter((b) => b.status !== 'cancelled')
  const filteredCurrent = current.filter((b) => b.status !== 'cancelled')
  const filteredUpcoming = upcoming.filter((b) => b.status !== 'cancelled')

  const total = filteredPast.length + filteredCurrent.length + filteredUpcoming.length

  if (total === 0)
    return (
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Bookings</h2>
        <p className="text-gray-500 text-sm">You haven't made any bookings yet.</p>
      </div>
    )

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Booking History</h2>
      <BookingGroup title="Upcoming Bookings" bookings={filteredUpcoming} />
      <BookingGroup title="Current Bookings" bookings={filteredCurrent} />
      <BookingGroup title="Past Bookings" bookings={filteredPast} />
    </div>
  )
}