'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { formatCurrency } from '@/utils/format'

type ROIPayout = {
  id: number
  property_title: string
  amount_paid: number
  payout_date: string
}

export default function ROIPayoutTable() {
  const [payouts, setPayouts] = useState<ROIPayout[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchROI = async () => {
      try {
        const res = await axios.get('/auth/roi/my/')
        setPayouts(res.data)
      } catch (err) {
        console.error('Failed to fetch ROI payouts')
      } finally {
        setLoading(false)
      }
    }

    fetchROI()
  }, [])

  if (loading) return <div className="py-10 text-center">Loading ROI payouts...</div>
  if (!payouts.length) return <div className="py-10 text-center">No ROI payouts yet.</div>

  return (
    <div className="overflow-x-auto border border-stroke dark:border-strokedark rounded-lg bg-white dark:bg-blacksection shadow-sm">
      <h2 className="text-lg font-semibold p-4">ROI Payout History</h2>
      <table className="w-full table-auto text-left text-sm">
        <thead className="bg-gray-100 dark:bg-gray-600 dark:text-white">
          <tr>
            <th className="px-4 py-3">Property</th>
            <th className="px-4 py-3">Amount Paid</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((payout) => (
            <tr key={payout.id} className="border-t dark:border-strokedark">
              <td className="px-4 py-3">{payout.property_title}</td>
              <td className="px-4 py-3">{formatCurrency(payout.amount_paid)}</td>
              <td className="px-4 py-3">{new Date(payout.payout_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}