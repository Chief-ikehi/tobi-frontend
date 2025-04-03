'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency } from '@/utils/format'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'
import FavoriteButton from './FavoriteButton'

interface Property {
  id: number
  title: string
  location: string
  property_type: string
  price_per_night: number
  images: string[]
  amenities?: string // now a comma-separated string like "WiFi, AC, Pool"
}

interface PropertyCardProps {
  property: Property
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const type = property.property_type?.toUpperCase()

  const badgeColor =
    type === 'SHORTLET'
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      : type === 'INVESTMENT'
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'

  const typeLabel =
    type === 'SHORTLET'
      ? 'Shortlet'
      : type === 'INVESTMENT'
      ? 'Investment'
      : type === 'HYBRID'
      ? 'Shortlet & Investment'
      : 'Unknown'

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-sm dark:bg-blacksection">
      {/* Type Badge */}
      <div className="absolute left-4 top-4 z-10">
        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${badgeColor}`}>
          {typeLabel}
        </span>
      </div>

      {/* Favorite Button */}
      <div className="absolute right-4 top-4 z-10">
        <FavoriteButton propertyId={property.id} />
      </div>

      {/* Image */}
      <Link href={`/properties/${property.id}`} className="relative block h-[240px] w-full">
        <Image
          src={property.images?.[0] || '/placeholder.jpg'}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          fill
        />
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/properties/${property.id}`}>
          <h3 className="mb-2 text-xl font-medium text-black hover:text-primary dark:text-white dark:hover:text-primary">
            {property.title}
          </h3>
        </Link>
        <p className="mb-4 text-base font-medium text-body-color">{property.location}</p>

        <div className="mb-3 flex items-center justify-between">
          <span className="text-xl font-medium text-black dark:text-white">
            {formatCurrency(property.price_per_night)}
          </span>
          {(type === 'SHORTLET' || type === 'HYBRID') && (
            <span className="text-sm text-body-color"> /night</span>
          )}
        </div>

        {/* Amenities */}
        {property.amenities && (
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
            {property.amenities
              .split(',')
              .map((a) => a.trim())
              .slice(0, 3)
              .map((amenity, index) => (
                <span key={index} className="px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-100">
                  {amenity}
                </span>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertyCard
