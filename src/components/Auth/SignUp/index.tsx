'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import api from '@/lib/axios'
import { toast } from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await api.post('/auth/register/', {
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role,
      })

      const res = await api.post('/auth/login/', {
        email: data.email,
        password: data.password,
      })

      const { access, refresh } = res.data.tokens
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)

      toast.success('Registration successful!', { position: 'top-center' })

      window.location.href = '/dashboard'
    } catch (err: any) {
      const msg =
        err?.response?.data?.email?.[0] ||
        err?.response?.data?.password?.[0] ||
        err?.response?.data?.detail ||
        'Registration failed'
      toast.error(msg, { position: 'top-center' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="pb-12.5 lg:pb-25 lg:pt-20 xl:pb-30 xl:pt-20 bg-gray-100 dark:bg-black min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-c-1016 px-2 w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="rounded-lg bg-white px-7.5 pt-7.5 pb-10 shadow-lg dark:border dark:border-strokedark dark:bg-black max-w-xl mx-auto"
        >
          <h2 className="mb-10 text-center text-3xl font-semibold text-black dark:text-white">
            Create an Account
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:gap-14">
              <input
                type="text"
                placeholder="First Name"
                value={data.firstName}
                onChange={(e) => setData({ ...data, firstName: e.target.value })}
                required
                className="w-full border-b border-stroke bg-white pb-3.5 dark:border-strokedark dark:bg-black lg:w-1/2 px-1"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={data.lastName}
                onChange={(e) => setData({ ...data, lastName: e.target.value })}
                required
                className="w-full border-b border-stroke bg-white pb-3.5 dark:border-strokedark dark:bg-black lg:w-1/2 px-1"
              />
            </div>

            <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:gap-14">
              <input
                type="email"
                placeholder="Email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                required
                className="w-full border-b border-stroke bg-white pb-3.5 dark:border-strokedark dark:bg-black lg:w-1/2 px-1"
              />
              <select
                value={data.role}
                onChange={(e) => setData({ ...data, role: e.target.value })}
                className="w-full border-b border-stroke bg-white pb-3.5 dark:border-strokedark dark:bg-black lg:w-1/2 px-1"
              >
                <option value="customer">Customer</option>
                <option value="agent">Agent</option>
                <option value="investor">Investor</option>
                <option value="handyman">Handyman (Service Provider)</option>
              </select>
            </div>

            <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:gap-14">
              <input
                type="password"
                placeholder="Password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
                className="w-full border-b border-stroke bg-white pb-3.5 dark:border-strokedark dark:bg-black lg:w-1/2 px-1"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={data.confirmPassword}
                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                required
                className="w-full border-b border-stroke bg-white pb-3.5 dark:border-strokedark dark:bg-black lg:w-1/2 px-1"
              />
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between mt-8 gap-5">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Create account
                    <svg
                      className="fill-white"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z" />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-black dark:text-white">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}