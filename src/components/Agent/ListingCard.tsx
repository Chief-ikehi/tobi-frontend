'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency } from '@/utils/format'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'


interface ListingCardProps {
  property: {
    id: number
    title: string
    location: string
    property_type: string
    price_per_night: number
    is_approved: boolean
    images: string[]
  }
}

export default function ListingCard({ property }: ListingCardProps) {
  const typeLabel =
    property.property_type === 'shortlet'
      ? 'Shortlet'
      : property.property_type === 'investment'
      ? 'Investment'
      : 'Hybrid'

  const badgeColor =
    property.property_type === 'shortlet'
      ? 'bg-blue-100 text-blue-800'
      : property.property_type === 'investment'
      ? 'bg-green-100 text-green-800'
      : 'bg-purple-100 text-purple-800'

  const router = useRouter()

  return (
    <div className="rounded-lg bg-white dark:bg-blacksection shadow-sm overflow-hidden">
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image
          src={property.images?.[0] || '/placeholder.jpg'}
          alt={property.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Type & Approval */}
        <div className="flex justify-between items-center mb-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeColor}`}>
            {typeLabel}
          </span>
          <span
            className={`text-xs font-semibold ${
              property.is_approved ? 'text-green-600' : 'text-yellow-600'
            }`}
          >
            {property.is_approved ? 'Approved' : 'Pending Approval'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-1">{property.title}</h3>
        <p className="text-sm text-gray-500">{property.location}</p>

        {/* Price */}
        <p className="mt-2 text-base text-black dark:text-white font-medium">
          {formatCurrency(property.price_per_night)}{' '}
          {(property.property_type === 'shortlet' || property.property_type === 'hybrid') && (
            <span className="text-sm text-gray-500">/ night</span>
          )}
        </p>

        {/* View and Edit Buttons */}
        <div className="mt-4 flex gap-3">
          {property.is_approved && (
            <button
              onClick={() => router.push(`/properties/${property.id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600 font-medium px-4 py-2 rounded-lg transition-colors"
            >
              View Listing
            </button>
          )}
          <button
            onClick={() => router.push(`/agent/properties/${property.id}/edit`)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-500 font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() =>
              toast.error('Contact Admin to delete property', {
                position: 'top-center',
              })
            }
            className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-500 font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}