'use client'

import { useEffect, useState } from 'react'
import PropertyForm from './PropertyForm'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'

export default function EditPropertyPage() {
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()

  useEffect(() => {
    const fetchProperty = async () => {
      const token = localStorage.getItem('access_token') // 👈 your stored JWT

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${params.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error('Failed to fetch property')

        const data = await res.json()
        setProperty(data)
      } catch (err) {
        toast.error('Error loading property')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [params.id])

  if (loading) return <div className="py-20 text-center">Loading...</div>
  if (!property) return <div className="py-20 text-center text-red-600">Property not found.</div>

  return (
    <section className="py-10 container">
      <h1 className="text-2xl font-bold mb-6">Edit Property</h1>
      <PropertyForm mode="edit" initialData={property} />
    </section>
  )
}
