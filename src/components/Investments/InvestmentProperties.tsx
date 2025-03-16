"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Property } from "@/types/property";
import InvestmentPropertyCard from "./InvestmentPropertyCard";
import InvestmentFilters from "./InvestmentFilters";

interface InvestmentProperty extends Property {
  roi: number;
  managementFee: number;
  monthlyIncome: number;
  occupancyRate: number;
  propertyValue: number;
  installmentPrice: number;
  outrighPrice: number;
}

interface Filters {
  location: string[];
  priceRange: {
    min: number;
    max: number;
  };
  roi: {
    min: number;
    max: number;
  };
  type: "ALL" | "SHORTLET" | "RESIDENTIAL" | "COMMERCIAL";
}

const defaultFilters: Filters = {
  location: [],
  priceRange: {
    min: 0,
    max: 1000000000, // 1 billion naira
  },
  roi: {
    min: 0,
    max: 100,
  },
  type: "ALL",
};

const InvestmentProperties = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [properties, setProperties] = useState<InvestmentProperty[]>([]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Convert filters to query params
        const params = new URLSearchParams();
        if (filters.location.length > 0) {
          params.append("location", filters.location.join(","));
        }
        params.append("minPrice", filters.priceRange.min.toString());
        params.append("maxPrice", filters.priceRange.max.toString());
        params.append("minRoi", filters.roi.min.toString());
        params.append("maxRoi", filters.roi.max.toString());
        params.append("type", filters.type);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/properties/investment?${params.toString()}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Failed to load investment properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="mb-8 animate-pulse">
          <div className="h-8 w-64 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mt-4 h-4 w-96 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-[400px] animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-32">
      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold text-black dark:text-white">
          Investment Properties
        </h1>
        <p className="text-lg text-body-color">
          Discover premium real estate investment opportunities with guaranteed ROI and
          professional property management.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-12">
        <InvestmentFilters filters={filters} onChange={handleFilterChange} />
      </div>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow-solid-8 dark:bg-blacksection">
          <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
            No Properties Found
          </h2>
          <p className="mb-8 text-body-color">
            We couldn't find any properties matching your criteria. Try adjusting your
            filters or check back later for new opportunities.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <InvestmentPropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InvestmentProperties; 