'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { FaStar, FaTools, FaMapMarkerAlt } from 'react-icons/fa'

interface ServiceListProps {
  isSection?: boolean;
  title?: string;
}

export default function ServiceList({ isSection = false, title = "Handyman Services" }: ServiceListProps) {
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<any[]>([])
  const [handymen, setHandymen] = useState<any[]>([])
  const [selectedService, setSelectedService] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch available services
        const servicesRes = await axios.get('/auth/handyman-services/')
        setServices(servicesRes.data)

        // Fetch handymen
        const handymenRes = await axios.get('/auth/handymen/')
        setHandymen(handymenRes.data)
      } catch (error) {
        console.error('Failed to fetch services data:', error)
        toast.error('Failed to load services data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter handymen by selected service
  const filteredHandymen = selectedService
    ? handymen.filter((handyman) =>
        handyman.services_list.some((service: any) => service.id === selectedService)
      )
    : handymen

  return (
    <div className={isSection ? "" : "p-4 md:p-6"}>
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      {/* Service Categories */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Service Categories</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedService(null)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedService === null
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-blacksection dark:text-gray-300 dark:hover:bg-blacksection/80'
            }`}
          >
            All Services
          </button>

          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedService === service.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-blacksection dark:text-gray-300 dark:hover:bg-blacksection/80'
              }`}
            >
              {service.name}
            </button>
          ))}
        </div>
      </div>

      {/* Handymen List */}
      {loading ? (
        <div className="text-center py-10">Loading handymen...</div>
      ) : filteredHandymen.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHandymen.map((handyman) => (
            <Link
              key={handyman.id}
              href={`/services/${handyman.id}`}
              className="bg-white dark:bg-blacksection rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-stroke dark:border-strokedark"
            >
              <div className="relative h-40 bg-gray-200 dark:bg-gray-700">
                {handyman.profile_image ? (
                  <img
                    src={handyman.profile_image}
                    alt={handyman.user_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaTools size={40} className="text-gray-400" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{handyman.user_name}</h3>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{handyman.service_area || 'Location not specified'}</span>
                </div>

                <div className="flex items-center mb-3">
                  <span className="text-yellow-500 flex items-center">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar className="text-gray-300 dark:text-gray-600" />
                  </span>
                  <span className="text-sm ml-1">(4.0)</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {handyman.services_list.slice(0, 3).map((service: any) => (
                    <span
                      key={service.id}
                      className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2 py-1 rounded"
                    >
                      {service.name}
                    </span>
                  ))}
                  {handyman.services_list.length > 3 && (
                    <span className="text-xs px-2 py-1">+{handyman.services_list.length - 3} more</span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold">₦{handyman.hourly_rate}/hr</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {handyman.experience_years} years exp.
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-blacksection p-10 rounded-lg text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No handymen found for {selectedService ? 'this service category' : 'any service category'}.
          </p>
        </div>
      )}
    </div>
  )
}
