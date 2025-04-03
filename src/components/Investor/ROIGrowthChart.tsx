'use client'

import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js'
import { addMonths, format } from 'date-fns'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

type Investment = {
  id: number
  amount_invested: number
  roi_percentage: number
  plan_years: number
  investment_date: string
}

type Props = {
  investments: Investment[]
}

export default function ROIGrowthChart({ investments }: Props) {
  const [labels, setLabels] = useState<string[]>([])
  const [dataPoints, setDataPoints] = useState<number[]>([])

  useEffect(() => {
    const timeline: { [key: string]: number } = {}

    investments.forEach((inv) => {
      const monthlyROI =
        (inv.amount_invested * inv.roi_percentage) / 100 / (inv.plan_years * 12)
      const start = new Date(inv.investment_date)

      for (let i = 0; i < inv.plan_years * 12; i++) {
        const month = format(addMonths(start, i), 'MMM yyyy')
        timeline[month] = (timeline[month] || 0) + monthlyROI
      }
    })

    // Convert to sorted arrays
    const months = Object.keys(timeline).sort((a, b) =>
      new Date(a).getTime() - new Date(b).getTime()
    )

    let cumulative = 0
    const roiPoints = months.map((m) => {
      cumulative += timeline[m]
      return Math.round(cumulative)
    })

    setLabels(months)
    setDataPoints(roiPoints)
  }, [investments])

  if (!labels.length) return null

  return (
    <div className="rounded-lg border border-stroke dark:border-strokedark bg-white dark:bg-blacksection p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">ROI Growth Over Time</h2>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: 'Cumulative ROI (₦)',
              data: dataPoints,
              fill: false,
              borderColor: '#10B981',
              backgroundColor: '#10B981',
              tension: 0.3
            }
          ]
        }}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return `₦${value.toLocaleString()}`
                }
              }
            }
          },
          plugins: {
            legend: {
              display: true
            },
            tooltip: {
              callbacks: {
                label: function (ctx) {
                  return `₦${Number(ctx.raw).toLocaleString()}`
                }
              }
            }
          }
        }}
      />
    </div>
  )
}