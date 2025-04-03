'use client'

import { formatCurrency } from '@/utils/format'
import ROIPayoutTable from './ROIPayoutTable'

type Investment = {
  id: number
  property_title: string
  amount_invested: number
  roi_percentage: number
  investment_date: string
  plan_years: 2 | 3
}

type Props = {
  investments: Investment[]
}

export default function PayoutHistoryTable({ investments }: Props) {
  if (!investments.length) return null

  return (
    <ROIPayoutTable />
  )
}