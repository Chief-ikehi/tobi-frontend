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
  FaCalendarAlt
} from 'react-icons/fa'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: <FaHome /> },
  { href: '/dashboard/bookings', label: 'Bookings', icon: <FaCalendarAlt /> },
  { href: '/dashboard/wallet', label: 'Wallet', icon: <FaWallet /> },
  { href: '/dashboard/favorites', label: 'Favorites', icon: <FaHeart /> },
  { href: '/dashboard/gifts', label: 'Gifts', icon: <FaGift /> },
  { href: '/dashboard/membership', label: 'Membership', icon: <FaUserTie /> },
  { href: '/dashboard/investor', label: 'Investments', icon: <FaBriefcase /> },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const toggleSidebar = () => setOpen((prev) => !prev)
  const closeSidebar = () => setOpen(false)

  return (
    <>
      {/* Mobile topbar */}
      <div className="md:hidden flex justify-between items-center bg-white dark:bg-black px-4 py-3 border-b shadow-sm">
        <h2 className="text-lg font-bold">Dashboard</h2>
        <button onClick={toggleSidebar}>
          {open ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-black dark:text-white border-r shadow-sm p-4 w-64 fixed md:static top-0 left-0 h-full transform transition-transform duration-300 z-50 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <h2 className="text-lg font-bold mb-6">User Dashboard</h2>
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
    </>
  )
}