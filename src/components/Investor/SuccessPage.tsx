'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from '@/lib/axios'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

export default function InvestSuccessPage() {
  const searchParams = useSearchParams()
  const txRef = searchParams.get('tx_ref')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying your investment...')

  useEffect(() => {
    const verifyInvestment = async () => {
      if (!txRef) {
        setStatus('error')
        setMessage('Missing transaction reference.')
        return
      }

      try {
        const res = await axios.get('/auth/invest/verify-payment/', {
          params: { tx_ref: txRef }
        })

        setStatus('success')
        setMessage(res.data.message || 'Investment successful! You’ll find it in your dashboard.')
      } catch (err: any) {
        setStatus('error')
        setMessage(err.response?.data?.error || 'Verification failed. Please contact support.')
      }
    }

    verifyInvestment()
  }, [txRef])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {status === 'loading' && (
        <>
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
          <p className="text-lg font-medium">{message}</p>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle2 className="w-10 h-10 text-green-600 mb-3" />
          <h1 className="text-xl font-semibold text-green-700">{message}</h1>
          <p className="mt-2 text-gray-500">Your wallet has been credited with ₦5M for bookings.</p>
        </>
      )}

      {status === 'error' && (
        <>
          <XCircle className="w-10 h-10 text-red-600 mb-3" />
          <h1 className="text-xl font-semibold text-red-700">Oops!</h1>
          <p className="mt-2 text-gray-500">{message}</p>
        </>
      )}
    </div>
  )
}