'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { format } from 'date-fns'
import { formatCurrency } from '@/utils/format'
import { toast } from 'react-hot-toast'

type CommissionEntry = {
  property: {
    id: number
    title: string
  }
  source: 'booking' | 'investment'
  amount: number
  date: string | null
}

export default function CommissionHistoryTable() {
  const [entries, setEntries] = useState<CommissionEntry[]>([])
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const perPage = 5
  const totalPages = Math.ceil(entries.length / perPage)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/auth/agent/metrics/')
        setEntries(res.data.commission_history)
      } catch {
        toast.error('Failed to load commission history')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const paginatedEntries = entries.slice((page - 1) * perPage, page * perPage)

  if (loading) return <div className="py-10 text-center">Loading commission history...</div>

  if (!entries.length) {
    return (
      <div className="py-10 text-center text-gray-600">
        No commission history yet.
      </div>
    )
  }

  return (
    <div className="mt-10 border border-stroke dark:border-strokedark rounded-md overflow-x-auto bg-white dark:bg-blacksection shadow-sm">
      <h1 className="text-xl font-semibold p-4">Commission History</h1>
      <table className="w-full table-auto text-left text-sm">
        <thead className="dark:bg-gray-500 text-lg bg-black text-white dark:text-black">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Property</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Amount</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEntries.map((entry, idx) => (
            <tr key={idx} className="border-t dark:border-strokedark">
              <td className="px-4 py-2">
                {entry.date ? format(new Date(entry.date), 'dd MMM yyyy') : '—'}
              </td>
              <td className="px-4 py-2">{entry.property.title}</td>
              <td className="px-4 py-2 capitalize">{entry.source}</td>
              <td className="px-4 py-2 font-medium">{formatCurrency(entry.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-3 p-4 text-sm">
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