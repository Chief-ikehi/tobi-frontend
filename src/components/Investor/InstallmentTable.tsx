'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { format } from 'date-fns'
import { formatCurrency } from '@/utils/format'
import { toast } from 'react-hot-toast'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3'

type Installment = {
  id: number
  due_date: string
  amount_due: number
  is_paid: boolean
  date_paid: string | null
}

export default function InstallmentTable() {
  const [installments, setInstallments] = useState<Installment[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 6

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

  const fetchInstallments = async () => {
    try {
      const res = await axios.get('/auth/installments/my/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setInstallments(res.data)
    } catch (err) {
      toast.error('Failed to load installments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInstallments()
  }, [])

  const totalPages = Math.ceil(installments.length / ITEMS_PER_PAGE)
  const paginated = installments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePayment = (installment: Installment) => {
    const config = {
      public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
      tx_ref: `INVESTOR-${installment.id}-${Date.now()}`,
      amount: installment.amount_due,
      currency: 'NGN',
      payment_options: 'card,banktransfer',
      customer: {
        email: localStorage.getItem('user_email') || 'guest@example.com',
        name: localStorage.getItem('user_first_name') || 'Guest',
        phone_number: localStorage.getItem('user_phone_number') || '0000000000',
      },
      customizations: {
        title: 'T.O.B.I Repayment',
        description: `Installment for due ${installment.due_date}`,
        logo: '/images/logo/tobi-logo-dark.svg',
      },
    }

    const triggerPayment = useFlutterwave(config)

    triggerPayment({
      callback: async (response) => {
        if (response.status === 'successful') {
          try {
            await axios.post(
              `/auth/installments/${installment.id}/mark-paid/`,
              {},
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            toast.success('Installment marked as paid!')
            fetchInstallments()
          } catch {
            toast.error('Payment succeeded, but could not confirm installment.')
          }
        } else {
          toast.error('Payment was not successful')
        }

        closePaymentModal()
      },
      onClose: () => toast('Payment cancelled'),
    })
  }

  if (loading) return <div className="text-center py-10">Loading installments...</div>

  return (
    <div className="mt-10 overflow-x-auto rounded border border-stroke dark:border-strokedark bg-white dark:bg-blacksection shadow-sm">
      <h2 className="text-lg font-semibold p-4">Monthly Repayment Plan</h2>
      <table className="w-full table-auto text-sm text-left">
        <thead className="bg-gray-100 dark:bg-gray-600 dark:text-white">
          <tr>
            <th className="px-4 py-2">Due Date</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((inst) => {
            const dueDate = new Date(inst.due_date)
            const isOverdue = !inst.is_paid && dueDate < new Date()

            return (
              <tr key={inst.id} className="border-t dark:border-strokedark">
                <td className="px-4 py-2">{format(dueDate, 'dd MMM yyyy')}</td>
                <td className="px-4 py-2">{formatCurrency(inst.amount_due)}</td>
                <td className="px-4 py-2">
                  {inst.is_paid ? (
                    <span className="text-green-600 font-semibold">Paid</span>
                  ) : isOverdue ? (
                    <span className="text-red-600 font-semibold">Overdue</span>
                  ) : (
                    <span className="text-yellow-600 font-medium">Pending</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {!inst.is_paid ? (
                    <button
                      onClick={() => handlePayment(inst)}
                      className="rounded bg-primary px-3 py-1 text-white text-xs hover:bg-primary/80"
                    >
                      Pay Now
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 py-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 text-sm border rounded ${
                currentPage === i + 1 ? 'bg-primary text-white' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}