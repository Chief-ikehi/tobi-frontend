'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'

type MembershipData = {
  tier: 'silver' | 'gold' | 'platinum' | null
  valid_until: string | null
  perks: string[]
}

export default function MembershipPage() {
  const [membership, setMembership] = useState<MembershipData | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const res = await axios.get('/auth/membership/portal/')
        setMembership(res.data)
      } catch {
        toast.error('Failed to load membership info')
      } finally {
        setLoading(false)
      }
    }

    fetchMembership()
  }, [])

  const subscribeToSilver = async (plan: 'monthly' | 'yearly') => {
    setSubscribing(true)
    try {
      await axios.post('/auth/membership/subscribe/', { plan })
      toast.success('Silver Membership Activated!')
      location.reload()
    } catch {
      toast.error('Failed to activate membership')
    } finally {
      setSubscribing(false)
    }
  }

  if (loading) return <div className="py-10 text-center">Loading membership...</div>

  return (
    <section className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Your Membership</h1>

      <div className="bg-white dark:bg-blacksection shadow rounded p-6 mb-6">
        <p className="text-lg font-semibold">
          Tier:{' '}
          <span className="capitalize">
            {membership?.tier || 'None'}
          </span>
        </p>

        {membership?.valid_until && (
          <p className="text-sm text-gray-500">
            Valid Until: {new Date(membership.valid_until).toDateString()}
          </p>
        )}
      </div>

      {/* Perks */}
      {Array.isArray(membership?.perks) && membership.perks.length > 0 && (
        <div className="bg-white dark:bg-blacksection shadow rounded p-6 mb-6">
          <h2 className="text-lg font-medium mb-2">Perks</h2>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
            {membership.perks.map((perk, i) => (
              <li key={i}>{perk}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Subscribe Option */}
      {!membership?.tier && (
        <div className="text-center mt-6">
          <h2 className="text-lg font-medium mb-2">Become a Silver Member</h2>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => subscribeToSilver('monthly')}
              disabled={subscribing}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            >
              Monthly Plan
            </button>
            <button
              onClick={() => subscribeToSilver('yearly')}
              disabled={subscribing}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Yearly Plan
            </button>
          </div>
        </div>
      )}
    </section>
  )
}