'use client'

import { useEffect, useState } from 'react'
import { Property } from '@/types/property'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import QuickActions from './QuickActions'
import InvestmentModal from './InvestmentModal'
import GiftModal from './GiftModal'
import BookingForm from './BookingForm'
import { formatCurrency } from '@/utils/format'
import axios from '@/lib/axios'

interface PropertyDetailsProps {
  propertyId: string
}

const PropertyDetails = ({ propertyId }: PropertyDetailsProps) => {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [showInvestmentModal, setShowInvestmentModal] = useState(false)
  const [showGiftModal, setShowGiftModal] = useState(false)
  const [agentInfo, setAgentInfo] = useState<{ name: string; email: string; phone: string } | null>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${propertyId}/`)
        const data = await res.json()
        setProperty(data)
        setSelectedImage(data.images?.[0])

        // Fetch Agent Info
        if (data.agent) {
          const agentId = data.agent
          const agentRes = await axios.get(`/auth/users/${agentId}/`)
          const agentData = agentRes.data

          setAgentInfo({
            name: `${agentData.first_name} ${agentData.last_name}`,
            email: agentData.email,
            phone: agentData.primary_phone || agentData.secondary_phone || 'N/A',
          })
        }
      } catch {
        toast.error('Failed to load property or agent')
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [propertyId])

  if (loading) return <div className="py-20 text-center">Loading...</div>
  if (!property) return <div className="py-20 text-center text-red-500">Property not found.</div>

  const type = property.property_type
  const badgeColor =
    type === 'shortlet'
      ? 'bg-blue-100 text-blue-800'
      : type === 'investment'
      ? 'bg-green-100 text-green-800'
      : 'bg-purple-100 text-purple-800'

  return (
    <section className="container py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div>
          <div className="relative h-[400px] w-full rounded-lg overflow-hidden mb-4">
            <Image src={selectedImage} alt={property.title} fill className="object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {property.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative h-20 rounded border-2 ${
                  selectedImage === img ? 'border-primary' : 'border-transparent'
                }`}
              >
                <Image src={img} alt={`thumb-${idx}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Property Info */}
        <div>
          <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${badgeColor} mb-2`}>
            {type === 'shortlet' ? 'Shortlet' : type === 'investment' ? 'Investment' : 'Hybrid'}
          </span>

          <h1 className="text-3xl font-bold mb-1">{property.title}</h1>
          <p className="text-body-color mb-3">{property.location}</p>
          <p className="text-xl font-semibold text-black dark:text-white mb-4">
            {formatCurrency(property.price_per_night)}{' '}
            {type === 'shortlet' && <span className="text-sm">/ night</span>}
          </p>

          <p className="text-body-color mb-4">{property.description}</p>

          {/* Amenities */}
          {property.amenities && (
            <div className="mb-5">
              <h4 className="text-sm font-medium mb-2">Amenities</h4>
              <ul className="flex flex-wrap gap-2 text-sm">
                {property.amenities.split(',').map((a, i) => (
                  <li key={i} className="rounded-full bg-gray-100 px-3 py-1 dark:bg-dark-3">
                    {a.trim()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Virtual Tour */}
          {property.virtual_tour_url && (
            <a
              href={property.virtual_tour_url}
              target="_blank"
              className="inline-block text-primary underline text-sm mb-4"
            >
              Take a Virtual Tour
            </a>
          )}

          {/* Agent Info */}
          {agentInfo && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Listed By</h4>
              <div className="text-sm text-body-color">
                <p className="font-semibold">{agentInfo.name}</p>
                <p className="text-xs">{agentInfo.email}</p>
                <p className="text-xs">{agentInfo.phone}</p>
              </div>
            </div>
          )}

          {/* Booking Form */}
          {(type === 'shortlet' || type === 'hybrid') && (
            <div id="booking-form" className="mt-10">
              <BookingForm
                propertyId={property.id}
                title={property.title}
                pricePerNight={Number(property.price_per_night)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showInvestmentModal && (
        <InvestmentModal
          propertyId={property.id}
          title={property.title}
          investmentCost={Number(property.investment_cost)}
          onClose={() => setShowInvestmentModal(false)}
        />
      )}

      {showGiftModal && (
        <GiftModal
          propertyId={property.id}
          pricePerNight={Number(property.price_per_night)}
          title={property.title}
          onClose={() => setShowGiftModal(false)}
        />
      )}

      {/* Floating Action Bar */}
      <QuickActions
        property={property}
        onOpenBook={() => {
          document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })
        }}
        onOpenInvest={() => setShowInvestmentModal(true)}
        onOpenGift={() => setShowGiftModal(true)}
      />
    </section>
  )
}

export default PropertyDetails