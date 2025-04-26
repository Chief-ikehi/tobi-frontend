'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function ServiceManagement() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [availableServices, setAvailableServices] = useState<any[]>([])
  const [formData, setFormData] = useState({
    bio: '',
    experience_years: 0,
    hourly_rate: 0,
    service_area: '',
    is_available: true,
    profile_image: '',
  })
  const [selectedServices, setSelectedServices] = useState<number[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch handyman profile
        const profileRes = await axios.get('/auth/handyman/profile/')
        setProfile(profileRes.data)
        
        // Set form data from profile
        setFormData({
          bio: profileRes.data.bio || '',
          experience_years: profileRes.data.experience_years || 0,
          hourly_rate: profileRes.data.hourly_rate || 0,
          service_area: profileRes.data.service_area || '',
          is_available: profileRes.data.is_available,
          profile_image: profileRes.data.profile_image || '',
        })
        
        // Set selected services
        const currentServices = profileRes.data.services_list || []
        setServices(currentServices)
        setSelectedServices(currentServices.map((s: any) => s.id))
        
        // Fetch available services
        const servicesRes = await axios.get('/auth/handyman-services/')
        setAvailableServices(servicesRes.data)
      } catch (error) {
        console.error('Failed to fetch profile data:', error)
        toast.error('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : (name === 'experience_years' || name === 'hourly_rate' ? Number(value) : value)
    }))
  }

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value))
    setSelectedServices(selectedOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Update profile
      await axios.patch('/auth/handyman/profile/', {
        ...formData,
        services: selectedServices,
      })

      toast.success('Profile updated successfully')
      router.refresh()
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !profile) {
    return <div className="py-20 text-center">Loading Service Management...</div>
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Your Services</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white dark:bg-blacksection p-6 rounded-lg shadow-sm">
        <div className="space-y-6">
          {/* Profile Image */}
          <div>
            <label className="block mb-1 font-medium">Profile Image URL</label>
            <input
              type="url"
              name="profile_image"
              value={formData.profile_image}
              onChange={handleInputChange}
              placeholder="https://example.com/your-image.jpg"
              className="w-full border px-3 py-2 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">Enter a URL for your profile image</p>
          </div>

          {/* Bio */}
          <div>
            <label className="block mb-1 font-medium">Bio/Description</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              required
              placeholder="Describe your services, experience, and expertise..."
              className="w-full border px-3 py-2 rounded-md min-h-[100px]"
            />
          </div>

          {/* Experience and Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Years of Experience</label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleInputChange}
                min="0"
                required
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Hourly Rate (₦)</label>
              <input
                type="number"
                name="hourly_rate"
                value={formData.hourly_rate}
                onChange={handleInputChange}
                min="0"
                required
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>
          </div>

          {/* Service Area */}
          <div>
            <label className="block mb-1 font-medium">Service Area</label>
            <input
              type="text"
              name="service_area"
              value={formData.service_area}
              onChange={handleInputChange}
              required
              placeholder="e.g., Lagos, Ikoyi, Victoria Island"
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          {/* Availability */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleInputChange}
              className="mr-2 h-4 w-4"
            />
            <label className="font-medium">Available for new service requests</label>
          </div>

          {/* Services */}
          <div>
            <label className="block mb-1 font-medium">Services Offered</label>
            <select
              multiple
              name="services"
              value={selectedServices.map(String)}
              onChange={handleServiceChange}
              required
              className="w-full border px-3 py-2 rounded-md min-h-[100px]"
            >
              {availableServices.map((service: any) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple services</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/80"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
