'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import ListingCard from './ListingCard'
import { toast } from 'react-hot-toast'

type Property = {
  id: number
  title: string
  location: string
  property_type: string
  price_per_night: number
  is_approved: boolean
  images: string[]
}

export default function MyListings() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get('/api/properties/my_listings/')
        setProperties(res.data)
      } catch (err) {
        toast.error('Failed to load your listings.')
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  if (loading) return <div className="py-20 text-center">Loading your listings...</div>

  if (properties.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        You haven't listed any properties yet.
      </div>
    )
  }

  return (
    <section className="py-10">
      <h2 className="text-xl font-semibold mb-6">My Listings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <ListingCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  )
}