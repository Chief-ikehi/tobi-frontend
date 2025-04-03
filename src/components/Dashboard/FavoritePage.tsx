'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'
import PropertyCard from '@/components/Properties/PropertyCard'
import { Property } from '@/types/property'

interface Favorite {
  id: number
  property: number
}


export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, propertiesRes] = await Promise.all([
          axios.get('/auth/dashboard/'),
          axios.get('/api/properties/'),
        ])

        setFavorites(dashboardRes.data.favorites || [])
        setProperties(propertiesRes.data || [])
      } catch {
        toast.error('Failed to load favorites.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const favoriteProperties = properties.filter((p) =>
    favorites.some((fav) => fav.property === p.id)
  )

  if (loading) return <div className="py-20 text-center">Loading favorites...</div>

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Your Favorites</h1>
      {favoriteProperties.length === 0 ? (
        <p className="text-gray-500 text-center">You have no favorited properties yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favoriteProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  )
}