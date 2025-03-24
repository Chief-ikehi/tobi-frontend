"use client";

import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";
import { Property, PropertyType } from "@/types/property";
import axios from "@/lib/axios";

const Properties = () => {
  const [filters, setFilters] = useState({
    location: "",
    priceRange: {
      min: 0,
      max: 1000000000,
    },
    amenities: [] as string[],
    propertyType: "ALL" as PropertyType | "ALL",
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async (filterOverride?: typeof filters) => {
    try {
      setLoading(true);
      const activeFilters = filterOverride || filters;
      const queryParams = new URLSearchParams();

      // ✅ Location
      if (activeFilters.location) {
        queryParams.append("location", activeFilters.location);
      }

      // ✅ Price Range
      if (activeFilters.priceRange.min > 0) {
        queryParams.append("min_price", activeFilters.priceRange.min.toString());
      }
      if (activeFilters.priceRange.max < 1000000000) {
        queryParams.append("max_price", activeFilters.priceRange.max.toString());
      }

      // ✅ Property Type
      if (
        activeFilters.propertyType &&
        activeFilters.propertyType !== "ALL"
      ) {
        queryParams.append("property_type", activeFilters.propertyType);
      }

      // ✅ Amenities
      activeFilters.amenities.forEach((a) =>
        queryParams.append("amenities", a)
      );

      // Final URL
      const res = await axios.get(`/properties/?${queryParams.toString()}`);
      setProperties(res.data);
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    fetchProperties(newFilters);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <section className="pb-12.5 pt-32.5">
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
  );
};

export default Properties;