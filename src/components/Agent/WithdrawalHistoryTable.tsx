'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { format } from 'date-fns'
import { formatCurrency } from '@/utils/format'
import { toast } from 'react-hot-toast'

type Withdrawal = {
  id: number
  amount: number
  status: 'pending' | 'approved' | 'declined'
  created_at: string
}

export default function WithdrawalHistoryTable() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const perPage = 5
  const totalPages = Math.ceil(withdrawals.length / perPage)

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const res = await axios.get('/auth/agent/withdrawals/')
        setWithdrawals(res.data)
      } catch {
        toast.error('Failed to fetch withdrawals.')
      } finally {
        setLoading(false)
      }
    }

    fetchWithdrawals()
  }, [])

  const paginated = withdrawals.slice((page - 1) * perPage, page * perPage)

  if (loading) return <div className="text-center py-10">Loading withdrawals...</div>
  if (withdrawals.length === 0)
    return <p className="text-sm text-gray-500 py-4">No withdrawal requests found.</p>

  return (
    <div className="mt-10 border rounded shadow-sm overflow-x-auto bg-white dark:bg-blacksection">
      <h2 className="text-xl font-semibold p-4">Withdrawal History</h2>
      <table className="w-full table-auto text-sm">
        <thead className="dark:bg-gray-500 text-lg bg-black text-white dark:text-black">
          <tr>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((w) => (
            <tr key={w.id} className="border-t dark:border-strokedark">
              <td className="px-4 py-2">{formatCurrency(w.amount)}</td>
              <td className="px-4 py-2">
                {w.status === 'pending' && (
                  <span className="text-yellow-600 font-medium">Pending</span>
                )}
                {w.status === 'approved' && (
                  <span className="text-green-600 font-medium">Approved</span>
                )}
                {w.status === 'declined' && (
                  <span className="text-red-600 font-medium">Declined</span>
                )}
              </td>
              <td className="px-4 py-2">
                {format(new Date(w.created_at), 'dd MMM yyyy, hh:mm a')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-3 px-4 py-3 text-sm">
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