'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ServicesPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to handyman portal
    router.replace('/handyman-portal')
  }, [router])

  return (
    <div className="py-40 text-center">
      <p>Redirecting to Handyman Portal...</p>
    </div>
  )
}
