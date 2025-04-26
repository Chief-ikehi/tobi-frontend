'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import ServiceRequestCard from './ServiceRequestCard'
import HandymanStats from './HandymanStats'

export default function HandymanDashboard() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [isHandyman, setIsHandyman] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashRes = await axios.get('/auth/dashboard/')
        const userData = dashRes.data
        
        if (userData.user?.role === 'handyman') {
          setIsHandyman(true)
          setDashboardData(userData)
          
          // Check verification status
          try {
            const verifyRes = await axios.get('/auth/handyman/verification-status/')
            setIsVerified(verifyRes.data.status === 'verified')
          } catch {
            setIsVerified(false)
          }
        } else {
          toast.error('You need to switch to handyman role to access this dashboard')
          router.replace('/dashboard')
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return <div className="py-20 text-center">Loading Handyman Dashboard...</div>
  }

  if (!isHandyman) {
    return (
      <div className="py-20 text-center text-red-600 font-medium">
        Only handymen can access this dashboard.
      </div>
    )
  }

  if (!isVerified) {
    return (
      <div className="py-20 text-center">
        <div className="text-yellow-600 font-medium mb-4">
          Your handyman account is not verified yet.
        </div>
        <button
          onClick={() => router.push('/dashboard/handyman/verify')}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80"
        >
          Complete Verification
        </button>
      </div>
    )
  }

  const handymanProfile = dashboardData?.handyman_profile || {}
  const serviceRequests = dashboardData?.service_requests || []

  return (
    <div className="p-4 md:p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Handyman Dashboard</h1>
      
      {/* Stats Section */}
      <HandymanStats 
        profile={handymanProfile}
        requests={serviceRequests}
      />
      
      {/* Service Requests Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Service Requests</h2>
        
        {serviceRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceRequests.slice(0, 6).map((request: any) => (
              <ServiceRequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-blacksection p-6 rounded-lg text-center">
            <p className="text-gray-500 dark:text-gray-400">No service requests yet.</p>
          </div>
        )}
        
        {serviceRequests.length > 6 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/dashboard/handyman/requests')}
              className="text-primary hover:underline"
            >
              View All Requests
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
