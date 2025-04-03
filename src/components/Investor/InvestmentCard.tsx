'use client'

import { formatCurrency } from '@/utils/format'

type Props = {
  investment: {
    id: number
    property_title: string
    amount_invested: number
    roi_percentage: number
    investment_date: string
    tier: 'gold' | 'platinum' | null
  }
}

export default function InvestmentCard({ investment }: Props) {
  return (
    <div className="rounded-lg border border-stroke dark:border-strokedark bg-white dark:bg-blacksection p-5 shadow-sm">
      <h3 className="text-lg font-semibold mb-2">{investment.property_title}</h3>

      <div className="text-sm text-body-color space-y-1">
        <p>
          <strong>Amount:</strong> {formatCurrency(investment.amount_invested)}
        </p>
        <p>
          <strong>ROI:</strong> {investment.roi_percentage}%
        </p>
        <p>
          <strong>Invested on:</strong>{' '}
          {new Date(investment.investment_date).toLocaleDateString()}
        </p>
        {/*
        <p>
          <strong>Tier:</strong>{' '}
          {investment.tier ? investment.tier.toUpperCase() : 'N/A'}
        </p>
        */}
      </div>
    </div>
  )
}