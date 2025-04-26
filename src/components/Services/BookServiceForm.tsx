'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'

interface BookServiceFormProps {
  handyman: any
  onSuccess: () => void
}

export default function BookServiceForm({ handyman, onSuccess }: BookServiceFormProps) {
  const [loading, setLoading] = useState(false)
  const [bookings, setBookings] = useState<any[]>([])
  const [formData, setFormData] = useState({
    service: '',
    description: '',
    requested_date: '',
    requested_time: '',
    estimated_hours: 1,
    property_booking: '',
  })

  useEffect(() => {
    // Set default service if available
    if (handyman.services_list && handyman.services_list.length > 0) {
      setFormData(prev => ({
        ...prev,
        service: handyman.services_list[0].id.toString()
      }))
    }

    // Fetch user's current bookings
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/auth/dashboard/')
        if (response.data.bookings && response.data.bookings.current) {
          setBookings(response.data.bookings.current)
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
      }
    }

    fetchBookings()
  }, [handyman])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimated_hours' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/auth/service-requests/create/', {
        handyman: handyman.user,
        service: formData.service,
        description: formData.description,
        requested_date: formData.requested_date,
        requested_time: formData.requested_time,
        estimated_hours: formData.estimated_hours,
        property_booking: formData.property_booking || null,
      })

      toast.success('Service request submitted successfully')
      onSuccess()
    } catch (error) {
      console.error('Failed to submit service request:', error)
      toast.error('Failed to submit service request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Service Selection */}
      <div>
        <label className="block mb-1 font-medium text-sm">Service Type</label>
        <select
          name="service"
          value={formData.service}
          onChange={handleInputChange}
          required
          className="w-full border px-3 py-2 rounded-md"
        >
          {handyman.services_list.map((service: any) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      {/* Property Booking */}
      <div>
        <label className="block mb-1 font-medium text-sm">Property Booking (Optional)</label>
        <select
          name="property_booking"
          value={formData.property_booking}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value="">None (Service for another location)</option>
          {bookings.map((booking: any) => (
            <option key={booking.id} value={booking.id}>
              {booking.property.title} ({new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium text-sm">Date</label>
          <input
            type="date"
            name="requested_date"
            value={formData.requested_date}
            onChange={handleInputChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-sm">Time</label>
          <input
            type="time"
            name="requested_time"
            value={formData.requested_time}
            onChange={handleInputChange}
            required
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>
      </div>

      {/* Estimated Hours */}
      <div>
        <label className="block mb-1 font-medium text-sm">Estimated Hours</label>
        <input
          type="number"
          name="estimated_hours"
          value={formData.estimated_hours}
          onChange={handleInputChange}
          min="1"
          max="24"
          required
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 font-medium text-sm">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          placeholder="Describe what you need help with..."
          className="w-full border px-3 py-2 rounded-md min-h-[100px]"
        />
      </div>

      {/* Estimated Cost */}
      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
        <div className="flex justify-between items-center">
          <span className="font-medium">Estimated Cost:</span>
          <span className="font-bold text-lg">
            ₦{(handyman.hourly_rate * formData.estimated_hours).toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Based on {formData.estimated_hours} hour{formData.estimated_hours !== 1 ? 's' : ''} at ₦{handyman.hourly_rate}/hr
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/80"
      >
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  )
}
