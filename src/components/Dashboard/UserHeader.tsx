'use client'

import React from 'react'

interface Props {
  user: {
    first_name: string
    last_name: string
    email: string
    role: string
  }
}

const UserHeader = ({ user }: Props) => {
  const getRoleBadge = (role: string) => {
    const base = 'px-2 py-1 rounded text-xs font-medium'
    switch (role) {
      case 'investor':
        return <span className={`${base} bg-green-100 text-green-800`}>Investor</span>
      case 'agent':
        return <span className={`${base} bg-blue-100 text-blue-800`}>Agent</span>
      case 'admin':
        return <span className={`${base} bg-purple-100 text-purple-800`}>Admin</span>
      case 'superadmin':
        return <span className={`${base} bg-red-100 text-red-800`}>Superadmin</span>
      default:
        return <span className={`${base} bg-gray-100 text-gray-800`}>Customer</span>
    }
  }

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-black dark:text-white">
        Welcome back, {user.first_name}!
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
      <div className="mt-2">{getRoleBadge(user.role)}</div>
    </div>
  )
}

export default UserHeader