'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import VerifyHandymanForm from './VerifyHandymanForm'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function VerifyHandymanPage() {
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'unverified' | 'pending' | 'verified' | null>(null)
  const [isHandyman, setIsHandyman] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashRes = await axios.get('/auth/dashboard/')
        const role = dashRes.data.user?.role

        if (role === 'handyman') {
          setIsHandyman(true)

          try {
            const verifyRes = await axios.get('/auth/handyman/verification-status/')
            setStatus(verifyRes.data.status) // 'unverified' | 'pending' | 'verified'
          } catch {
            setStatus('unverified')
          }
        }
      } catch {
        console.error('Handyman access failed.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  // Toast and redirect when status becomes 'verified'
  useEffect(() => {
    if (status === 'verified') {
      toast.success('You are already verified', { position: 'top-center' })
      router.replace('/dashboard/handyman')
    }
  }, [status, router])

  if (loading) return <div className="py-20 text-center">Loading Handyman Verification Page...</div>

  if (!isHandyman) {
    return <div className="py-20 text-center text-red-600 font-medium">Only handymen can access this portal.</div>
  }

  if (status === 'unverified') {
    return (
      <div className="py-10 px-4">
        <VerifyHandymanForm />
      </div>
    )
  }

  if (status === 'pending') {
    return (
      <div className="py-40 text-center text-yellow-600 font-medium">
        Your documents are under review. Please check back later.
      </div>
    )
  }

  return null // Or a loading skeleton or fallback UI if needed
}
