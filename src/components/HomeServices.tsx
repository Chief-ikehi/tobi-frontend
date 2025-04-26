'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { FaTools, FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'

export default function HomeServices() {
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<any[]>([])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/auth/handyman-services/')
        // Only show up to 8 services on the home page
        setServices(response.data.slice(0, 8))
      } catch (error) {
        console.error('Failed to fetch services:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50 dark:bg-blacksection">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Handyman Services</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Professional services for your property needs
            </p>
          </div>
          <Link 
            href="/handyman-portal" 
            className="mt-4 md:mt-0 flex items-center gap-2 text-primary hover:underline"
          >
            View All Services <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading services...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service) => (
              <Link
                key={service.id}
                href="/handyman-portal"
                className="bg-white dark:bg-black p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaTools className="text-primary text-xl" />
                </div>
                <h3 className="font-semibold mb-2">{service.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/handyman-portal"
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/80 inline-flex items-center gap-2"
          >
            Become a Service Provider <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  )
}
