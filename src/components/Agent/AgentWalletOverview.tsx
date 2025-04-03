'use client'

import { formatCurrency } from '@/utils/format'

interface WalletProps {
  total: number
  available: number
}

export default function AgentWalletOverview({ total, available }: WalletProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="rounded-lg bg-white dark:bg-blacksection p-5 shadow-sm border border-stroke dark:border-strokedark">
        <h3 className="text-sm font-medium text-gray-500">Total Commission Earned</h3>
        <p className="text-2xl font-bold mt-1 text-black dark:text-white">{formatCurrency(total)}</p>
      </div>

      <div className="rounded-lg bg-white dark:bg-blacksection p-5 shadow-sm border border-stroke dark:border-strokedark">
        <h3 className="text-sm font-medium text-gray-500">Available for Withdrawal</h3>
        <p className="text-2xl font-bold mt-1 text-black dark:text-white">{formatCurrency(available)}</p>
      </div>
    </div>
  )
}