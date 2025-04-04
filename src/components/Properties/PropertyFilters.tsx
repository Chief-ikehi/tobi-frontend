'use client'

import { useState } from 'react'

interface PropertyFiltersProps {
  filters: {
    location: string
    priceRange: {
      min: number
      max: number
    }
    amenities: string[]
    propertyType: 'shortlet' | 'investment' | 'hybrid' | 'all'
  }
  onFilterChange: (filters: PropertyFiltersProps['filters']) => void
}

const LOCATIONS = [
  { label: 'Ikoyi', value: 'ikoyi' },
  { label: 'Victoria Island', value: 'vi' },
]

const AMENITIES = [
  'Swimming Pool',
  'Gym',
  'Security',
  'Parking',
  'Air Conditioning',
  'Furnished',
  'Wi-Fi',
  'Generator',
]

export default function PropertyFilters({ filters, onFilterChange }: PropertyFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const update = (updates: Partial<typeof filters>) => {
    const newFilters = { ...localFilters, ...updates }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const num = value === '' ? (type === 'min' ? 0 : 1000000000) : parseInt(value)
    update({
      priceRange: {
        ...localFilters.priceRange,
        [type]: num,
      },
    })
  }

  const handleAmenityToggle = (amenity: string) => {
    const amenities = localFilters.amenities.includes(amenity)
      ? localFilters.amenities.filter((a) => a !== amenity)
      : [...localFilters.amenities, amenity]

    update({ amenities })
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:border dark:border-strokedark dark:bg-blacksection">
      <h3 className="mb-6 text-xl font-medium text-black dark:text-white">Filter Properties</h3>

      {/* Property Type Filter */}
      <div className="mb-6">
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
          Property Type
        </label>
        <div className="flex flex-wrap gap-3">
          {(['all', 'shortlet', 'investment', 'hybrid'] as const).map((type) => (
            <button
              key={type}
              onClick={() => update({ propertyType: type })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                localFilters.propertyType === type
                  ? 'bg-primary text-white'
                  : 'bg-[#F7F8FA] text-body-color hover:bg-primary hover:text-white dark:bg-dark-2'
              }`}
            >
              {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div className="mb-6">
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
          Location
        </label>
        <select
          value={localFilters.location}
          onChange={(e) => update({ location: e.target.value })}
          className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-body-color outline-none focus:border-primary dark:border-strokedark dark:text-white dark:focus:border-primary"
        >
          <option value="">All Locations</option>
          {LOCATIONS.map((loc) => (
            <option key={loc.value} value={loc.value}>
              {loc.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
          Price Range
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={localFilters.priceRange.min || ''}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-body-color outline-none focus:border-primary dark:border-strokedark dark:text-white dark:focus:border-primary"
          />
          <span className="text-body-color">to</span>
          <input
            type="number"
            placeholder="Max"
            value={localFilters.priceRange.max === 1000000000 ? '' : localFilters.priceRange.max}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-body-color outline-none focus:border-primary dark:border-strokedark dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>

      {/* Amenities (frontend-only filtering) */}
      <div>
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
          Amenities
        </label>
        <div className="flex flex-col gap-3">
          {AMENITIES.map((amenity) => (
            <label key={amenity} className="flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={localFilters.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="peer sr-only"
              />
              <span className="border-gray-300 bg-gray-100 text-blue-600 dark:border-gray-600 dark:bg-gray-700 group mr-3 flex h-5 min-w-[20px] items-center justify-center rounded peer-checked:bg-primary">
                <svg
                  className="opacity-0 peer-checked:group-[]:opacity-100"
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.70704 0.792787C9.89451 0.980314 9.99983 1.23462 9.99983 1.49979C9.99983 1.76495 9.89451 2.01926 9.70704 2.20679L4.70704 7.20679C4.51951 7.39426 4.26521 7.49957 4.00004 7.49957C3.73488 7.49957 3.48057 7.39426 3.29304 7.20679L0.293041 4.20679C0.110883 4.01818 0.0100885 3.76558 0.0123669 3.50339C0.0146453 3.24119 0.119814 2.99038 0.305222 2.80497C0.490631 2.61956 0.741443 2.51439 1.00364 2.51211C1.26584 2.50983 1.51844 2.61063 1.70704 2.79279L4.00004 5.08579L8.29304 0.792787C8.48057 0.605316 8.73488 0.5 9.00004 0.5C9.26521 0.5 9.51951 0.605316 9.70704 0.792787Z"
                    fill="white"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium text-body-color dark:text-white">
                {amenity}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}