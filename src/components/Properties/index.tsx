"use client";

import { useState } from "react";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";
import { Property, PropertyType } from "@/types/property";

const Properties = () => {
  const [filters, setFilters] = useState({
    location: "",
    priceRange: {
      min: 0,
      max: 1000000000,
    },
    amenities: [] as string[],
    propertyType: "ALL" as PropertyType,
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties when filters change
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.location) {
        queryParams.append("location", filters.location);
      }
      if (filters.priceRange.min > 0) {
        queryParams.append("minPrice", filters.priceRange.min.toString());
      }
      if (filters.priceRange.max < 1000000000) {
        queryParams.append("maxPrice", filters.priceRange.max.toString());
      }
      if (filters.amenities.length > 0) {
        queryParams.append("amenities", filters.amenities.join(","));
      }
      if (filters.propertyType !== "ALL") {
        queryParams.append("type", filters.propertyType);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/properties?${queryParams.toString()}`
      );
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    fetchProperties();
  };

  return (
    <section className="pb-12.5 pt-32.5">
      <div className="container">
        <div className="grid grid-cols-12 gap-7.5">
          {/* Filters Sidebar */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-3">
            <PropertyFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Properties Grid */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-9">
            {loading ? (
              // Loading skeleton
              <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="h-[400px] animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"
                  />
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="flex h-[400px] items-center justify-center">
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  No properties found matching your criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Properties; 