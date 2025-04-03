'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import VerifyAgentForm from './VerifyAgentForm'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AgentPortalPage() {
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'unverified' | 'pending' | 'verified' | null>(null)
  const [isAgent, setIsAgent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashRes = await axios.get('/auth/dashboard/')
        const role = dashRes.data.user?.role

        if (role === 'agent') {
          setIsAgent(true)

          try {
            const verifyRes = await axios.get('/auth/agent/verification-status/')
            setStatus(verifyRes.data.status) // 'unverified' | 'pending' | 'verified'
          } catch {
            setStatus('unverified')
          }
        }
      } catch {
        console.error('Agent access failed.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  // ✅ Toast and redirect only once when status becomes 'verified'
  useEffect(() => {
    if (status === 'verified') {
      toast.success('You are already verified', { position: 'top-center' })
      router.replace('/agent/')
    }
  }, [status, router])

  if (loading) return <div className="py-20 text-center">Loading Agent Verification Page...</div>

  if (!isAgent) {
    return <div className="py-20 text-center text-red-600 font-medium">Only agents can access this portal.</div>
  }

  if (status === 'unverified') {
    return (
      <div className="py-10 px-4">
        <VerifyAgentForm />
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
