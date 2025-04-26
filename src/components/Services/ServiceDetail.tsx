'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { FaStar, FaMapMarkerAlt, FaCalendar, FaClock, FaTools, FaUser } from 'react-icons/fa'
import BookServiceForm from './BookServiceForm'

interface ServiceDetailProps {
  handymanId: string
}

export default function ServiceDetail({ handymanId }: ServiceDetailProps) {
  const [loading, setLoading] = useState(true)
  const [handyman, setHandyman] = useState<any>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchHandyman = async () => {
      try {
        // This is a mock endpoint - in a real app, you'd have an endpoint to get a specific handyman
        const response = await axios.get(`/auth/handymen/?id=${handymanId}`)
        if (response.data && response.data.length > 0) {
          setHandyman(response.data[0])
        } else {
          toast.error('Handyman not found')
          router.push('/services')
        }
      } catch (error) {
        console.error('Failed to fetch handyman details:', error)
        toast.error('Failed to load handyman details')
        router.push('/services')
      } finally {
        setLoading(false)
      }
    }

    fetchHandyman()
  }, [handymanId, router])

  if (loading) {
    return <div className="py-20 text-center">Loading handyman details...</div>
  }

  if (!handyman) {
    return <div className="py-20 text-center text-red-600">Handyman not found</div>
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="bg-white dark:bg-blacksection rounded-lg shadow-sm overflow-hidden border border-stroke dark:border-strokedark">
        {/* Header with image */}
        <div className="relative h-48 md:h-64 bg-gray-200 dark:bg-gray-700">
          {handyman.profile_image ? (
            <img
              src={handyman.profile_image}
              alt={handyman.user_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaTools size={60} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* Handyman details */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{handyman.user_name}</h1>
              
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
            </div>
            
            <div className="flex flex-col items-start md:items-end">
              <div className="text-2xl font-bold text-primary mb-1">
                ₦{handyman.hourly_rate}/hr
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {handyman.experience_years} years of experience
              </div>
              
              <button
                onClick={() => setShowBookingForm(true)}
                className="mt-4 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/80"
              >
                Book Service
              </button>
            </div>
          </div>

          {/* Services offered */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Services Offered</h2>
            <div className="flex flex-wrap gap-2">
              {handyman.services_list.map((service: any) => (
                <span
                  key={service.id}
                  className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                >
                  {service.name}
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">About</h2>
            <p className="text-gray-700 dark:text-gray-300">
              {handyman.bio || 'No bio provided.'}
            </p>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-blacksection rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Book Service</h2>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              
              <BookServiceForm 
                handyman={handyman} 
                onSuccess={() => {
                  setShowBookingForm(false)
                  router.push('/dashboard/bookings')
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
