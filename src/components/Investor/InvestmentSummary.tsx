'use client'

import { formatCurrency } from '@/utils/format'

type Props = {
  totalInvested: number
  projectedROI: number
  tier: 'gold' | 'platinum' | null
}

export default function InvestmentSummary({ totalInvested, projectedROI, tier }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Total Invested */}
      <div className="rounded-lg bg-white dark:bg-blacksection border border-stroke dark:border-strokedark p-5 shadow-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Invested</p>
        <h3 className="text-xl font-bold text-black dark:text-white mt-1">{formatCurrency(totalInvested)}</h3>
      </div>

      {/* Projected ROI */}
      <div className="rounded-lg bg-white dark:bg-blacksection border border-stroke dark:border-strokedark p-5 shadow-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400">Projected ROI</p>
        <h3 className="text-xl font-bold text-black dark:text-white mt-1">{formatCurrency(projectedROI)}</h3>
      </div>

      {/* Tier */}
      <div className="rounded-lg bg-white dark:bg-blacksection border border-stroke dark:border-strokedark p-5 shadow-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400">Investor Tier</p>
        <h3 className="text-xl font-bold text-black dark:text-white mt-1">
          {tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : 'Not Assigned'}
        </h3>
      </div>
    </div>
  )
}