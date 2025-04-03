'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'
import InvestmentCard from './InvestmentCard'
import WalletOverview from './WalletOverview'
import ROIGrowthChart from './ROIGrowthChart'
import PayoutHistoryTable from './PayoutHistoryTable'
import InstallmentTable from './InstallmentTable'
import InvestmentSummary from './InvestmentSummary'

const InvestorDashboard = () => {
  const [investments, setInvestments] = useState([])
  const [wallet, setWallet] = useState<number | null>(null)
  const [summary, setSummary] = useState({
    totalInvested: 0,
    projectedROI: 0,
    tier: null as 'gold' | 'platinum' | null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('/auth/dashboard/')
        const data = res.data

        setInvestments(data.investments)
        setWallet(data.wallet_balance)
        setSummary({
          totalInvested: data.investment_summary?.total_invested || 0,
          projectedROI: data.investment_summary?.projected_roi || 0,
          tier: data.investment_summary?.tier || null,
        })
      } catch (err) {
        toast.error('Failed to load investor data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>

  return (
    <section className="container py-10">
      <h1 className="text-2xl font-bold mb-4">Investor Dashboard</h1>

      <WalletOverview balance={wallet} tier={summary.tier} />

      {/* Investments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {investments.map((inv: any) => (
          <InvestmentCard key={inv.id} investment={inv} />
        ))}
      </div>

      {/* ROI Chart */}
      <div className="mt-10">
        <ROIGrowthChart investments={investments} />
      </div>

      {/* Payout Table */}
      <div className="mt-10">
        <PayoutHistoryTable investments={investments} />
      </div>

      {/* Installments */}
      <div className="mt-10">
        <InstallmentTable />
      </div>

      {/* Investment Summary */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Investment Summary</h2>

      <InvestmentSummary
        totalInvested={summary.totalInvested}
        projectedROI={summary.projectedROI}
        tier={summary.tier}
      />
      </div>
    </section>
  )
}

export default InvestorDashboard