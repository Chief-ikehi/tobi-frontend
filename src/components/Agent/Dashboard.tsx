'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'
import { formatCurrency } from '@/utils/format'
import CommissionHistoryTable from '@/components/Agent/CommissionHistoryTable'
import WithdrawForm from '@/components/Agent/WithdrawForm'
import WithdrawalHistoryTable from '@/components/Agent/WithdrawalHistoryTable'

interface PropertyCommission {
  id: number
  title: string
  total_commission_earned: number
}

export default function AgentPortalPage() {
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'unverified' | 'pending' | 'verified' | null>(null)
  const [isAgent, setIsAgent] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)
  const [totalCommission, setTotalCommission] = useState(0)
  const [totalListings, setTotalListings] = useState(0)
  const [commissions, setCommissions] = useState<PropertyCommission[]>([])
  const [page, setPage] = useState(1)
  const perPage = 4
  const totalPages = Math.ceil(commissions.length / perPage)
  const router = useRouter()

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const dashboardRes = await axios.get('/auth/dashboard/')
        const role = dashboardRes.data.user?.role

        if (role !== 'agent') {
          setIsAgent(false)
          return
        }

        setIsAgent(true)

        const verifyRes = await axios.get('/auth/agent/verification-status/')
        const agentStatus = verifyRes.data.status || 'unverified'
        setStatus(agentStatus)

        if (agentStatus === 'unverified') {
          toast.error('Verify your identity first.', { position: 'top-center' })
          router.replace('/agent/verify')
          return
        }

        if (agentStatus === 'pending') {
          toast.error('Verification in progress. Please wait for approval.', { position: 'top-center' })
          router.replace('/agent/verify')
          return
        }

        const metricsRes = await axios.get('/auth/agent/metrics/')
        setWalletBalance(metricsRes.data.wallet_balance)
        setTotalCommission(metricsRes.data.total_commission_earned)
        setTotalListings(metricsRes.data.listings_count)
        setCommissions(metricsRes.data.properties || [])

      } catch (err) {
        console.error('Error loading agent dashboard:', err)
        toast.error('Error loading dashboard. Please try again.', { position: 'top-center' })
        router.replace('/agent/verify')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [router])

  if (loading || !isAgent || status !== 'verified') {
    return <div className="py-20 text-center">Loading Agent Portal...</div>
  }

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Agent Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-blacksection p-6 rounded-2xl shadow text-center">
          <p className="text-gray-500 mb-1">Wallet Balance</p>
          <h2 className="text-3xl font-bold text-green-600">{formatCurrency(walletBalance)}</h2>
        </div>

        <div className="bg-white dark:bg-blacksection p-6 rounded-2xl shadow text-center">
          <p className="text-gray-500 mb-1">Total Commission Earned</p>
          <h2 className="text-3xl font-bold text-blue-600">{formatCurrency(totalCommission)}</h2>
        </div>

        <div className="bg-white dark:bg-blacksection p-6 rounded-2xl shadow text-center">
          <p className="text-gray-500 mb-1">Listings Created</p>
          <h2 className="text-3xl font-bold text-purple-600">{totalListings}</h2>
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-blacksection rounded-2xl shadow">
        <table className="w-full table-auto text-sm text-left">
          <thead className="dark:bg-gray-500 text-lg bg-black text-white dark:text-black">
            <tr>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Commission Earned</th>
            </tr>
          </thead>
          <tbody>
            {commissions.length > 0 ? (
              commissions.slice((page - 1) * perPage, page * perPage).map((item) => (
                <tr key={item.id} className="border-t dark:border-strokedark">
                  <td className="px-4 py-3">{item.title}</td>
                  <td className="px-4 py-3">{formatCurrency(item.total_commission_earned)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-4 py-6 text-center text-gray-500">
                  No commission records found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

      <div className="pt-10">
        <CommissionHistoryTable />
      </div>
    </section>
  )
}
