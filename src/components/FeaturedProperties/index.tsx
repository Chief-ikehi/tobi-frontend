'use client'

import { useEffect, useState } from "react"
import PropertyCard from "@/components/Properties/PropertyCard"
import { Property } from "@/types/property"
import axios from "@/lib/axios"
import { motion } from "framer-motion"

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check authentication status
    const verifyAuth = async () => {
      const token = localStorage.getItem('access_token')

      if (!token) {
        setIsAuthenticated(false)
        return
      }

      try {
        // Verify token by making a request to the profile endpoint
        await axios.get('/auth/profile/')
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Authentication failed:", error)
        // Clear localStorage if authentication fails
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        setIsAuthenticated(false)
      }
    }

    verifyAuth()
  }, [])

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
    // Only fetch properties after authentication check is complete
    if (isAuthenticated !== null) {
      fetchProperties()
    }
  }, [isAuthenticated])

  return (
    <section className="py-10 px-4 md:px-8 lg:px-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Featured <span className="text-blue-600">Properties</span>
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Discover our handpicked selection of premium one-bedroom properties
          </motion.p>
        </div>

        <motion.div
          className="w-full"
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
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex h-[400px] items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                No properties found.
              </p>
            </div>
          )}
        </motion.div>

        {properties.length > 0 && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => window.location.href = '/properties'}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300 shadow-md"
            >
              View All Properties
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default FeaturedProperties