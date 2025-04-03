'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import axios from '@/lib/axios'
import {
  FaBars,
  FaTimes,
  FaHome,
  FaPlus,
  FaUserCheck,
  FaWallet,
  FaListAlt,
} from 'react-icons/fa'
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified')
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const dashboardRes = await axios.get('/auth/dashboard/')
        const userRole = dashboardRes.data.user?.role
        if (userRole !== 'agent' && userRole !== 'admin' && userRole !== 'superadmin') {
          toast.error('Only agents can access this portal.', { position: 'top-center' })
          router.push('/')
          return
        }

        const verifyRes = await axios.get('/auth/agent/verification-status/')
        setStatus(verifyRes.data.status || 'unverified')
      } catch {
        setStatus('unverified')
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [router])

  const closeSidebar = () => setSidebarOpen(false)

  const handleProtectedRoute = async (e: React.MouseEvent, href: string) => {
  e.preventDefault()
  try {
    const dashboardRes = await axios.get('/auth/dashboard/')
    const userRole = dashboardRes.data.user?.role

    if (
      status !== 'verified' &&
      href !== '/agent/verify' &&
      userRole !== 'admin' &&
      userRole !== 'superadmin'
    ) {
      toast.error(
        status === 'pending'
          ? 'Verification in progress. Please wait for approval.'
          : 'You need to verify your identity first.',
        { position: 'top-center' }
      )
      return
    }

    router.push(href)
  } catch {
    toast.error('Error checking access.')
  }

  closeSidebar()
}

  const isActive = (path: string) => pathname === path
  const toggleSidebar = () => setSidebarOpen(prev => !prev)

  if (loading) return <div className="py-20 text-center">Loading...</div>

  return (
      <ProtectedRoute allowedRoles={[ 'agent', 'admin', 'superadmin']}>
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white w-64 p-5 z-50 md:block fixed md:static top-0 left-0 h-full transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h2 className="text-xl font-bold">Agent Portal</h2>
          <button onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>

        <h2 className="text-xl font-bold mb-6 hidden md:block">Agent Portal</h2>
        <nav className="flex flex-col gap-4">
          <Link
            href="/agent"
            onClick={(e) => handleProtectedRoute(e, '/agent')}
            className={`flex items-center gap-2 px-2 py-1 rounded hover:text-primary ${
              isActive('/agent') ? 'bg-white text-gray-900 font-semibold' : ''
            }`}
          >
            <FaHome /> Dashboard
          </Link>

          <Link
            href="/agent/verify"
            onClick={() => closeSidebar()}
            className={`flex items-center gap-2 px-2 py-1 rounded hover:text-primary ${
              isActive('/agent/verify') ? 'bg-white text-gray-900 font-semibold' : ''
            }`}
          >
            <FaUserCheck /> Verify Identity
          </Link>

          <Link
            href="/agent/properties"
            onClick={(e) => handleProtectedRoute(e, '/agent/properties')}
            className={`flex items-center gap-2 px-2 py-1 rounded hover:text-primary ${
              isActive('/agent/properties') ? 'bg-white text-gray-900 font-semibold' : ''
            }`}
          >
            <FaListAlt /> My Listings
          </Link>

          <Link
            href="/agent/properties/new"
            onClick={(e) => handleProtectedRoute(e, '/agent/properties/new')}
            className={`flex items-center gap-2 px-2 py-1 rounded hover:text-primary ${
              isActive('/agent/properties/new') ? 'bg-white text-gray-900 font-semibold' : ''
            }`}
          >
            <FaPlus /> Add Property
          </Link>

          <Link
            href="/agent/wallet"
            onClick={(e) => handleProtectedRoute(e, '/agent/wallet')}
            className={`flex items-center gap-2 px-2 py-1 rounded hover:text-primary ${
              isActive('/agent/wallet') ? 'bg-white text-gray-900 font-semibold' : ''
            }`}
          >
            <FaWallet /> Wallet
          </Link>
        </nav>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden flex justify-between items-center bg-gray-900 text-white px-4 py-3">
        <h2 className="text-lg font-semibold">Agent Portal</h2>
        <button onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 pt-5 md:pt-6 bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
        {children}
      </main>
    </div>
    </ProtectedRoute>
  )
}
