'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'
import CloudinaryUploader from '@/components/CloudinaryUploader'
import MultipleImageUploader from '@/components/MultipleImageUploader'

interface PropertyFormProps {
  mode: 'create' | 'edit'
  initialData?: any
}

const LOCATIONS = ['ikoyi', 'vi']
const TYPES = ['shortlet', 'investment', 'hybrid']

export default function PropertyForm({ mode, initialData }: PropertyFormProps) {
  const router = useRouter()
  const [proofUrl, setProofUrl] = useState('')
  const [images, setImages] = useState<string[]>([])

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: 'ikoyi',
    property_type: 'shortlet',
    price_per_night: '',
    investment_cost: '',
    roi_percentage: '',
    commission_percentage: '',
    amenities: '',
    virtual_tour_url: ''
  })

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setForm({ ...form, ...initialData })
      if (initialData.proof_of_listing) setProofUrl(initialData.proof_of_listing)
      if (initialData.images) setImages(initialData.images)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!proofUrl) {
      toast.error('Upload proof of listing before submitting.')
      return
    }

    if (images.length === 0) {
      toast.error('Upload at least one property image.')
      return
    }

    const payload = {
      ...form,
      proof_of_listing: proofUrl,
      images,
    }

    try {
      if (mode === 'create') {
        await axios.post('/api/properties/', payload)
        toast.success('Property created! It will be approved by admin.', {position : 'top-center'})
      } else {
        await axios.put(`/api/properties/${initialData.id}/`, payload)
        toast.success('Property updated. It will be re-approved by admin.', {position : 'top-center'});
      }
      router.push('/agent/properties')
    } catch {
      toast.error('Failed to submit property.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" value={form.title} onChange={handleChange} required placeholder="Title" className="w-full border px-3 py-2 rounded" />
      <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Description" className="w-full border px-3 py-2 rounded" />
      <select name="location" value={form.location} onChange={handleChange} className="w-full border px-3 py-2 rounded">
        {LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc.toUpperCase()}</option>)}
      </select>
      <select name="property_type" value={form.property_type} onChange={handleChange} className="w-full border px-3 py-2 rounded">
        {TYPES.map((type) => <option key={type} value={type}>{type.toUpperCase()}</option>)}
      </select>
      <input type="number" name="price_per_night" value={form.price_per_night} onChange={handleChange} placeholder="Price per night (if shortlet)" className="w-full border px-3 py-2 rounded" />
      <input type="number" name="investment_cost" value={form.investment_cost} onChange={handleChange} placeholder="Investment cost (if investment)" className="w-full border px-3 py-2 rounded" />
      <input type="number" name="roi_percentage" value={form.roi_percentage} onChange={handleChange} placeholder="ROI %" className="w-full border px-3 py-2 rounded" />
      <input type="number" name="commission_percentage" value={form.commission_percentage} onChange={handleChange} placeholder="Commission %" className="w-full border px-3 py-2 rounded" />
      <input name="amenities" value={form.amenities} onChange={handleChange} placeholder="Amenities (comma-separated) e.g. Wi-Fi, Pool" className="w-full border px-3 py-2 rounded" />
      <input name="virtual_tour_url" value={form.virtual_tour_url} onChange={handleChange} placeholder="Virtual Tour URL" className="w-full border px-3 py-2 rounded" />

      {/* Proof of Listing */}
      <div>
        <label className="text-sm font-medium mb-1 block">Upload Proof of Listing</label>
        <CloudinaryUploader onUploaded={setProofUrl} />
        {proofUrl && (
          <p className="text-sm text-green-600 break-all mt-1">Uploaded: {proofUrl}</p>
        )}
      </div>

      {/* Property Images Upload */}
      <div>
        <label className="text-sm font-medium mb-1 block">Upload Property Images</label>
        <MultipleImageUploader onUploaded={setImages} />
      </div>

      <button type="submit" className="w-full bg-primary text-white py-2 rounded">
        {mode === 'create' ? 'Create Property' : 'Update Property'}
      </button>
    </form>
  )
}