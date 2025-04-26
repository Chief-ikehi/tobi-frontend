'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'

export default function VerifyHandymanForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    bio: '',
    experience_years: 1,
    hourly_rate: 0,
    service_area: '',
  })
  const [files, setFiles] = useState({
    valid_id: null,
    certification: null,
    proof_of_work: null,
  })
  const [services, setServices] = useState<number[]>([])
  const [availableServices, setAvailableServices] = useState([])

  // Fetch available services when component mounts
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/auth/handyman-services/')
        setAvailableServices(response.data)
      } catch (error) {
        console.error('Failed to fetch services:', error)
        toast.error('Failed to load available services')
      }
    }

    fetchServices()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience_years' || name === 'hourly_rate' ? Number(value) : value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selected } = e.target
    if (selected && selected.length > 0) {
      setFiles((prev) => ({
        ...prev,
        [name]: selected[0],
      }))
    }
  }

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value))
    setServices(selectedOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const submitData = new FormData()

    // Add form fields
    submitData.append('bio', formData.bio)
    submitData.append('experience_years', formData.experience_years.toString())
    submitData.append('hourly_rate', formData.hourly_rate.toString())
    submitData.append('service_area', formData.service_area)

    // Add services
    services.forEach(serviceId => {
      submitData.append('services', serviceId.toString())
    })

    // Add files
    Object.entries(files).forEach(([key, value]) => {
      if (value) submitData.append(key, value)
    })

    try {
      await axios.post('/auth/verify-handyman/', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Verification documents submitted!', {position: 'top-center'})
      window.location.reload()
    } catch (err) {
      toast.error('Submission failed. Please check your information.', {position: 'top-center'})
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white dark:bg-blacksection shadow rounded-lg space-y-6"
    >
      <h2 className="text-xl font-semibold text-center mb-4">Verify Your Handyman Profile</h2>

      {/* Bio */}
      <div>
        <label className="block mb-1 font-medium text-sm">Bio/Description</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          required
          placeholder="Describe your services, experience, and expertise..."
          className="w-full border px-3 py-2 rounded-md text-sm min-h-[100px]"
        />
      </div>

      {/* Experience and Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium text-sm">Years of Experience</label>
          <input
            type="number"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleInputChange}
            min="0"
            required
            className="w-full border px-3 py-2 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-sm">Hourly Rate (₦)</label>
          <input
            type="number"
            name="hourly_rate"
            value={formData.hourly_rate}
            onChange={handleInputChange}
            min="0"
            required
            className="w-full border px-3 py-2 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Service Area */}
      <div>
        <label className="block mb-1 font-medium text-sm">Service Area</label>
        <input
          type="text"
          name="service_area"
          value={formData.service_area}
          onChange={handleInputChange}
          required
          placeholder="e.g., Lagos, Ikoyi, Victoria Island"
          className="w-full border px-3 py-2 rounded-md text-sm"
        />
      </div>

      {/* Services */}
      <div>
        <label className="block mb-1 font-medium text-sm">Services Offered</label>
        <select
          multiple
          name="services"
          onChange={handleServiceChange}
          required
          className="w-full border px-3 py-2 rounded-md text-sm min-h-[100px]"
        >
          {availableServices.map((service: any) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple services</p>
      </div>

      {/* Document Uploads */}
      <div className="space-y-4">
        <h3 className="font-medium">Verification Documents</h3>

        {[
          { label: 'Valid ID (National ID, Passport, etc)', name: 'valid_id' },
          { label: 'Certification or Professional License', name: 'certification' },
          { label: 'Proof of Previous Work (Photos, References)', name: 'proof_of_work' },
        ].map((input) => (
          <div key={input.name}>
            <label className="block mb-1 font-medium text-sm">{input.label}</label>
            <input
              type="file"
              name={input.name}
              accept=".jpg,.jpeg,.png,.pdf"
              required
              onChange={handleFileChange}
              className="w-full border px-3 py-2 rounded-md text-sm"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/80"
      >
        {loading ? 'Submitting...' : 'Submit for Verification'}
      </button>
    </form>
  )
}
