'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AgentHero from "@/components/AgentHero";
import Details from "@/components/AgentDetails";

const AgentPortalLanding = () => {
  const router = useRouter()

  useEffect(() => {
    const checkAgentRole = async () => {
      const token = localStorage.getItem('access_token')
      if (!token) return // no user logged in

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) return // not logged in or error

        const data = await res.json()
        const role = data?.user?.role

        if (role === 'agent') {
          router.replace('/agent') // redirect if agent
        }
      } catch (err) {
        console.error('Error checking role:', err)
      }
    }

    checkAgentRole()
  }, [])

  return (
    <main>
    <AgentHero />
    <Details />
    </main>
  )
}

export default AgentPortalLanding