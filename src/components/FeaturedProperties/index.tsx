'use client'

import { useEffect, useState } from "react"
import PropertyCard from "@/components/Properties/PropertyCard"
import { Property } from "@/types/property"
import axios from "@/lib/axios"
import { motion } from "framer-motion"

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const res = await axios.get("/api/properties/")
      setProperties(res.data.slice(0, 6))
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
    <section className="pb-10 pt-10 px-4 md:px-8 lg:px-12">
    <div className="mb-5 text-2xl text-center font-semibold text-black dark:text-white md:text-4xl">
    <h2>Featured Properties</h2>
    </div>
      <motion.div
        className="max-w-screen-xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="h-[400px] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-lg text-gray-500 dark:text-gray-400">
              No properties found.
            </p>
          </div>
        )}
      </motion.div>
    </section>
  )
}

export default FeaturedProperties
