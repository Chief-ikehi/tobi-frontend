'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import api from '@/lib/axios'
import { toast } from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login/', { email, password })
      const { access, refresh } = response.data.tokens
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")

      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)

      toast.success('Login successful', { position: 'top-center', duration: 5000 })

      // Force reload so header picks up new auth state
      window.location.href = '/dashboard'
    } catch (err: any) {
      const message = err?.response?.data?.detail || 'Login failed. Check credentials.'
      setError(message)
      toast.error(message, { position: 'top-center' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="pb-12.5 lg:pb-25 lg:pt-20 xl:pb-30 xl:pt-20 bg-gray-100 dark:bg-black min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-c-1016 px-2 w-full">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
          className="rounded-lg bg-white px-7.5 pt-7.5 pb-10 shadow-lg dark:border dark:border-strokedark dark:bg-black max-w-xl mx-auto"
        >
          <h2 className="mb-10 text-center text-3xl font-semibold text-black dark:text-white">
            Login to Your Account
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-7.5 flex flex-col gap-7.5">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-b border-stroke bg-white pb-3.5 dark:border-strokedark dark:bg-black px-1"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-b border-stroke bg-white pb-3.5 dark:border-strokedark dark:bg-black px-1"
              />
            </div>

            <div className="flex items-center justify-between mt-5">
              <Link href="/auth/forgot-password" className="text-sm hover:text-primary">
                Forgot Password?
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-2 font-medium text-white hover:bg-blackho dark:bg-btndark disabled:opacity-70"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Log in
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
            </div>

            <div className="mt-10 border-t border-stroke py-5 text-center dark:border-strokedark">
              <p className="text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="text-primary font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}