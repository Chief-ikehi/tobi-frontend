'use client'

import { formatCurrency } from '@/utils/format'

type Props = {
  balance: number | null
  tier: 'gold' | 'platinum' | null
}

export default function WalletOverview({ balance, tier }: Props) {
  return (
    <div className="rounded-lg bg-white dark:bg-blacksection shadow-md p-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">Wallet Balance</h2>
        <p className="text-2xl font-bold text-primary">
          {balance != null ? formatCurrency(balance) : 'N/A'}
        </p>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold mb-1">Investment Tier</h2>
        {tier ? (
          <span className={`inline-block px-4 py-1 rounded-full text-white text-sm font-medium
            ${tier === 'platinum' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-yellow-500'}`}>
            {tier.toUpperCase()}
          </span>
        ) : (
          <span className="text-sm text-gray-500">No tier yet</span>
        )}
      </div>
    </div>
  )
}