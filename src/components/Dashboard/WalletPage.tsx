'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'
import { formatCurrency } from '@/utils/format'

export default function WalletPage() {
  const [wallet, setWallet] = useState<number | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await axios.get('/auth/dashboard/')
        setWallet(res.data.wallet_balance)
        setRole(res.data.user?.role)
      } catch (err) {
        toast.error('Failed to load wallet info')
      } finally {
        setLoading(false)
      }
    }

    fetchWallet()
  }, [])

  if (loading) return <div className="text-center py-10">Loading wallet...</div>

  const renderMessage = () => {
    switch (role) {
      case 'investor':
        return (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            As an <b>Investor</b>, your wallet contains up to <b>₦5,000,000</b> in booking credit
            for TOBI properties after investing in a property.
            This credit is used for booking and is not withdrawable.
          </p>
        )
      case 'agent':
        return (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            As an <b>Agent</b>, your wallet holds your earned commissions from bookings and
            investments made on your listed properties. This wallet is <b>withdrawable</b>.
          </p>
        )
      case 'customer':
        return (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <b>Customers</b> do not have wallets. Bookings are made directly via card or Flutterwave.
          </p>
        )
      case 'admin':
      case 'superadmin':
        return (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            As an <b>{role}</b>, this wallet balance is viewable but is not used for transactions.
          </p>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-blacksection p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-2">Wallet</h1>

      {renderMessage()}

      {wallet !== null && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-black rounded text-center">
          <p className="text-gray-500 text-sm">Wallet Balance</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-600">
            {formatCurrency(wallet)}
          </p>
        </div>
      )}
    </div>
  )
}