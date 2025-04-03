'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import axios from '@/lib/axios'

type User = {
  name: string
  email: string
  role: string
  dashboard?: string
} | null

interface AuthContextType {
  user: User
  setUser: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null)

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/auth/profile/')
      const data = res.data
      setUser({
        name: data.user.first_name,
        email: data.user.email,
        role: data.user.role,
        dashboard: data.dashboard,
      })
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}