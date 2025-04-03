'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from '@/lib/axios'
import { formatCurrency } from '@/utils/format'

interface InvestmentModalProps {
  propertyId: number
  title: string
  investmentCost: number
  onClose: () => void
}

const InvestmentModal = ({ propertyId, title, investmentCost, onClose }: InvestmentModalProps) => {
  const [investmentType, setInvestmentType] = useState<'INSTALLMENT' | 'OUTRIGHT' | null>(null)
  const [installmentAmount, setInstallmentAmount] = useState('')
  const [planYears, setPlanYears] = useState<2 | 3>(2)
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

  const minInstallment = investmentCost * 0.6
  const parsedAmount = parseFloat(installmentAmount)
  const isInstallmentValid = !isNaN(parsedAmount) && parsedAmount >= minInstallment

  const handleInvest = async () => {
    if (!investmentType) return toast.error('Choose an investment option', {position : 'top-center'})
    if (!token) return toast.error('Login required', {position : 'top-center'})

    let amount = 0
    let plan = 2

    if (investmentType === 'OUTRIGHT') {
      amount = investmentCost
      plan = 2
    } else {
      if (!installmentAmount || !isInstallmentValid) {
        return toast.error(`Minimum investment is ₦${minInstallment.toLocaleString()}`, {position : 'top-center'})
      }
      if (parsedAmount > investmentCost) {
        return toast.error("You can't invest more than the property's value", {position : 'top-center'})
      }
      amount = parsedAmount
      plan = planYears
    }

    try {
      const res = await axios.post(
        '/auth/invest/initiate-payment/',
        {
          property: propertyId,
          amount_invested: amount,
          plan_years: plan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const { payment_link, tx_ref } = res.data

      if (!payment_link || !tx_ref) {
        return toast.error('Failed to generate payment link', {position : 'top-center'})
      }

      window.location.href = payment_link
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Investment initiation failed', {position : 'top-center'})
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg relative">
        <h2 className="text-lg font-semibold mb-4">T.O.B.I Investment Options</h2>

        {/* Option Buttons */}
        <div className="grid gap-4 mb-6">
          <button
            onClick={() => setInvestmentType('INSTALLMENT')}
            className={`w-full rounded px-4 py-2 font-medium border transition ${
              investmentType === 'INSTALLMENT'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 hover:bg-yellow-100'
            }`}
          >
            Pay in Installments (60% upfront)
          </button>
          <button
            onClick={() => setInvestmentType('OUTRIGHT')}
            className={`w-full rounded px-4 py-2 font-medium border transition ${
              investmentType === 'OUTRIGHT'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 hover:bg-green-100'
            }`}
          >
            Full Payment – {formatCurrency(investmentCost)}
          </button>
        </div>

        {/* Dynamic Form */}
        {investmentType === 'INSTALLMENT' && (
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Enter Amount (Min: {formatCurrency(minInstallment)})</label>
              <input
                type="number"
                value={installmentAmount}
                onChange={(e) => setInstallmentAmount(e.target.value)}
                placeholder={`e.g. ${minInstallment}`}
                className="w-full border rounded px-3 py-2"
                min={minInstallment}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Choose Plan</label>
              <div className="flex gap-3">
                {[2, 3].map((year) => (
                  <button
                    key={year}
                    onClick={() => setPlanYears(year as 2 | 3)}
                    className={`px-4 py-2 rounded border text-sm ${
                      planYears === year
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-blue-100'
                    }`}
                  >
                    {year} Year{year > 1 && 's'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {investmentType === 'OUTRIGHT' && (
          <div className="mb-4 text-sm text-gray-700">
            <p>You’re investing the full amount: <b>{formatCurrency(investmentCost)}</b></p>
            <p className="mt-1 text-green-600">You’ll earn platinum membership and ₦5M booking credit.</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-black"
          >
            Cancel
          </button>
          <button
            onClick={handleInvest}
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/80"
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvestmentModal