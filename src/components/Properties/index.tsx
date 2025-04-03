'use client'

import { useEffect, useState } from "react"
import PropertyCard from "./PropertyCard"
import PropertyFilters from "./PropertyFilters"
import { Property, PropertyType } from "@/types/property"
import axios from "@/lib/axios"

const Properties = () => {
  const [filters, setFilters] = useState({
    location: "",
    priceRange: {
      min: 0,
      max: 1000000000,
    },
    amenities: [] as string[],
    propertyType: "all" as PropertyType | "all",
  })

  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [allProperties, setAllProperties] = useState<Property[]>([])

  const applyFilters = (all: Property[], currentFilters = filters) => {
    return all.filter((property) => {
      const {
        location,
        priceRange: { min, max },
        amenities,
        propertyType,
      } = currentFilters

      // Filter by location
      if (location && property.location.toLowerCase() !== location.toLowerCase()) {
        return false
      }

      // Filter by property type
      if (
        propertyType !== "all" &&
        property.property_type.toLowerCase() !== propertyType.toLowerCase()
      ) {
        return false
      }

      // Filter by price
      const price = parseFloat(property.price_per_night.toString())
      if (price < min || price > max) {
        return false
      }

      // Filter by amenities
      if (amenities.length > 0) {
        const propertyAmenities = property.amenities
          ? property.amenities.split(',').map((a) => a.trim().toLowerCase())
          : []

        const allAmenitiesMatch = amenities.every((a) =>
          propertyAmenities.includes(a.toLowerCase())
        )
        if (!allAmenitiesMatch) {
          return false
        }
      }

      return true
    })
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    const filtered = applyFilters(allProperties, newFilters)
    setProperties(filtered)
  }

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/properties/')
      const all = res.data
      setAllProperties(all)
      setProperties(applyFilters(all))
    } catch (err) {
      console.error("Error fetching properties:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  return (
    <section className="pb-12.5 pt-10">
      <div className="container">
        <div className="grid grid-cols-12 gap-7.5">
          <div className="col-span-12 lg:col-span-4 xl:col-span-3">
            <PropertyFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>

          <div className="col-span-12 lg:col-span-8 xl:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="h-[400px] animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"
                  />
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 xl:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="flex h-[400px] items-center justify-center">
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  No properties found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Properties