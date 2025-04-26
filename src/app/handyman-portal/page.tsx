'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaTools, FaUserCheck, FaClipboardList, FaArrowRight } from 'react-icons/fa'

export default function HandymanPortalPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userRes = await axios.get('/auth/profile/')
        setUser(userRes.data.user)
        
        // Fetch services
        const servicesRes = await axios.get('/auth/handyman-services/')
        setServices(servicesRes.data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error('Failed to load portal data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleRegisterClick = () => {
    if (!user) {
      router.push('/auth/signup')
    } else if (user.role !== 'handyman') {
      // If user is logged in but not a handyman, prompt to switch role
      toast.error('Please switch to handyman role in your dashboard')
      router.push('/dashboard')
    } else {
      // If already a handyman, go to dashboard
      router.push('/dashboard/handyman')
    }
  }

  return (
    <div className="pt-20 pb-20">
      {/* Hero Section */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-20">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Offer Your Services as a Professional Handyman
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join our platform to connect with customers who need your expertise. 
              Grow your business and manage your service requests all in one place.
            </p>
            <button
              onClick={handleRegisterClick}
              className="bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/80 flex items-center gap-2"
            >
              {user?.role === 'handyman' ? 'Go to Dashboard' : 'Register as a Handyman'}
              <FaArrowRight />
            </button>
          </div>
          <div className="md:w-1/2">
            <img
              src="/images/handyman-hero.jpg"
              alt="Handyman Services"
              className="rounded-lg shadow-lg w-full h-auto"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/600x400?text=Handyman+Services'
              }}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 dark:bg-blacksection py-16 px-4 md:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-black p-8 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserCheck className="text-blue-600 dark:text-blue-400 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Register & Get Verified</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sign up as a handyman and submit your verification documents. Our team will review and approve your profile.
              </p>
            </div>
            <div className="bg-white dark:bg-black p-8 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTools className="text-green-600 dark:text-green-400 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Set Up Your Services</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create your profile, set your rates, and select the services you offer from our comprehensive list.
              </p>
            </div>
            <div className="bg-white dark:bg-black p-8 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClipboardList className="text-purple-600 dark:text-purple-400 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Manage Requests</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive service requests from customers, accept jobs, and grow your business through our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Services You Can Offer</h2>
        
        {loading ? (
          <div className="text-center py-10">Loading services...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <div key={service.id} className="bg-white dark:bg-blacksection p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaTools className="text-primary text-xl" />
                </div>
                <h3 className="font-semibold mb-2">{service.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 dark:bg-blacksection py-16 px-4 md:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits of Joining</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Increased Visibility</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get discovered by customers looking for your specific skills and services.
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Streamlined Booking</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage all your service requests in one place with our easy-to-use dashboard.
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Build Your Reputation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Collect reviews and ratings to showcase your quality work and reliability.
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get paid securely through our platform with transparent transaction history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="bg-primary text-white p-8 md:p-12 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Offering Your Services?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join our growing community of professional handymen and connect with customers who need your expertise.
          </p>
          <button
            onClick={handleRegisterClick}
            className="bg-white text-primary px-8 py-3 rounded-md hover:bg-gray-100 font-semibold"
          >
            {user?.role === 'handyman' ? 'Go to Dashboard' : 'Register as a Handyman'}
          </button>
        </div>
      </section>
    </div>
  )
}
