'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AgentPortalLanding from "@/components/AgentPortalLanding";

const RedirectPage = () => {
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

        if (role === 'agent' || role === 'superadmin' || role === 'admin') {
          router.replace('/agent') // redirect if agent
        }
      } catch (err) {
        console.error('Error checking role:', err)
      }
    }

    checkAgentRole()
  }, [router])

  return (
    <main>
      <AgentPortalLanding />
    </main>
  )
}

export default RedirectPage