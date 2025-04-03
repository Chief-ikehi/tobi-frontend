'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'
import { formatCurrency } from '@/utils/format'
import WithdrawForm from '@/components/Agent/WithdrawForm'
import WithdrawalHistoryTable from '@/components/Agent/WithdrawalHistoryTable'

export default function AgentWalletPage() {
  const [loading, setLoading] = useState(true)
  const [walletBalance, setWalletBalance] = useState(0)
  const [totalCommission, setTotalCommission] = useState(0)

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await axios.get('/auth/agent/metrics/')
        setWalletBalance(res.data.wallet_balance)
        setTotalCommission(res.data.total_commission_earned)
      } catch (err) {
        toast.error('Failed to load wallet data')
      } finally {
        setLoading(false)
      }
    }

    fetchWallet()
  }, [])

  if (loading) return <div className="text-center py-20">Loading wallet info...</div>

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold mb-6">My Wallet</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white dark:bg-blacksection p-6 rounded-2xl shadow text-center">
          <p className="text-gray-500 mb-1">Wallet Balance</p>
          <h2 className="text-3xl font-bold text-green-600">{formatCurrency(walletBalance)}</h2>
        </div>

        <div className="bg-white dark:bg-blacksection p-6 rounded-2xl shadow text-center">
          <p className="text-gray-500 mb-1">Total Commission Earned</p>
          <h2 className="text-3xl font-bold text-blue-600">{formatCurrency(totalCommission)}</h2>
        </div>
      </div>

      <div className="pt-10">
        <WithdrawForm currentBalance={walletBalance} />
      </div>

      <div className="pt-10">
        <WithdrawalHistoryTable />
      </div>
    </section>
  )
}