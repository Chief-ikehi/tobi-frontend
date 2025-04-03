'use client'

import { useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'

export default function WithdrawForm({ currentBalance }: { currentBalance: number }) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const value = parseFloat(amount)

    if (!value) {
      toast.error('Enter a valid amount.', {position: 'top-center'})
      return
    }

    if (value < 5000) {
      toast.error('Minimum withdrawal amount is 5000.', {position: 'top-center'})
      return
    }

    if (value > currentBalance) {
      toast.error('Requested amount exceeds wallet balance.', {position: 'top-center'})
      return
    }

    try {
      setLoading(true)
      await axios.post('/auth/withdraw-request/', { amount: value })
      toast.success('Withdrawal request submitted.', {position: 'top-center'})
      setAmount('')
    } catch {
      toast.error('Failed to submit request.', {position: 'top-center'})
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-white">Enter Amount</label>
      <input
        type="number"
        className="w-full px-3 py-2 border rounded"
        placeholder="Minimum amount is 5000"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={loading}
      />
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Request Withdrawal'}
      </button>
    </form>
  )
}