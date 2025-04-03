'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  FaHome,
  FaWallet,
  FaHeart,
  FaGift,
  FaUserTie,
  FaBriefcase,
  FaBars,
  FaTimes,
  FaUserCog,
  FaCalendarAlt,
} from 'react-icons/fa'
import ProtectedRoute from '@/components/ProtectedRoute';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: <FaHome /> },
  { href: '/dashboard/bookings', label: 'Bookings', icon: <FaCalendarAlt /> },
  { href: '/dashboard/wallet', label: 'Wallet', icon: <FaWallet /> },
  { href: '/dashboard/favorites', label: 'Favorites', icon: <FaHeart /> },
  { href: '/dashboard/gifts', label: 'Gifts', icon: <FaGift /> },
  { href: '/dashboard/membership', label: 'Membership', icon: <FaUserTie /> },
  { href: '/dashboard/investor', label: 'Investments', icon: <FaBriefcase /> },
  { href: '/dashboard/profile', label: 'Profile Settings', icon: <FaUserCog /> }, // NEW
]

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const toggleSidebar = () => setOpen((prev) => !prev)
  const closeSidebar = () => setOpen(false)

  return (
      <ProtectedRoute allowedRoles={['customer', 'agent', 'investor', 'admin', 'superadmin']}>
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-black dark:text-white border-r shadow-sm w-64 p-4 z-50 md:block fixed md:static top-0 left-0 h-full transform transition-transform duration-300 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <button onClick={toggleSidebar}>
            <FaTimes size={20} />
          </button>
        </div>

        <h2 className="text-lg font-bold mb-6 hidden md:block">User Dashboard</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                pathname === item.href
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden flex justify-between items-center bg-white dark:bg-black px-4 py-3 border-b shadow-sm">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <button onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 pt-10 md:pt-6 bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
        {children}
      </main>

    </div>
    </ProtectedRoute>
  )
}
