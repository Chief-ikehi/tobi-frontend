'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import axios from '@/lib/axios'
import toast from 'react-hot-toast'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const hasRedirected = useRef(false)

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      if (hasRedirected.current) return

      try {
        const res = await axios.get('/auth/profile/')
        const role = res?.data?.user?.role

        if (allowedRoles.includes(role)) {
          setUserRole(role)
        } else {
          if (!hasRedirected.current) {
            toast.error('You are not authorized to access this page', { position: 'top-center' })
            hasRedirected.current = true
            router.replace('/')
          }
        }
      } catch {
        if (!hasRedirected.current) {
          toast.error('You are not logged in', { position: 'top-center' })
          hasRedirected.current = true
          router.replace(`/auth/signin?next=${pathname}`)
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [pathname])

  if (loading || !userRole) return null

  return <>{children}</>
}