"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface InvestmentFiltersProps {
  filters: Filters;
  onChange: (filters: Partial<Filters>) => void;
}

const LOCATIONS = [
  "Ikoyi",
  "Victoria Island",
  "Lekki Phase 1",
  "Banana Island"
] as const;
const PROPERTY_TYPES = ["ALL", "SHORTLET", "RESIDENTIAL", "COMMERCIAL"] as const;

const InvestmentFilters = ({ filters, onChange }: InvestmentFiltersProps) => {
  const formatPrice = (value: number) =>
    `₦${value.toLocaleString()}${value === 1000000000 ? "+" : ""}`;

  const formatROI = (value: number) => `${value}%`;

  return (
    <div className="rounded-lg bg-white p-6 shadow-solid-8 dark:bg-blacksection">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Location Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Location
          </label>
          <Select
            value={filters.location.length > 0 ? filters.location[0] : "all"}
            onValueChange={(value: string) =>
              onChange({ location: value === "all" ? [] : [value] })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {LOCATIONS.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Property Type Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Property Type
          </label>
          <Select
            value={filters.type}
            onValueChange={(value: "ALL" | "SHORTLET" | "RESIDENTIAL" | "COMMERCIAL") =>
              onChange({ type: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "ALL" ? "All Types" : type.charAt(0) + type.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Price Range
          </label>
          <div className="space-y-4">
            <Slider
              min={0}
              max={1000000000}
              step={1000000}
              value={[filters.priceRange.min, filters.priceRange.max]}
              onValueChange={(values: number[]) =>
                onChange({ priceRange: { min: values[0], max: values[1] } })
              }
              formatLabel={formatPrice}
            />
            <div className="flex items-center justify-between text-xs text-body-color">
              <span>{formatPrice(filters.priceRange.min)}</span>
              <span>{formatPrice(filters.priceRange.max)}</span>
            </div>
          </div>
        </div>

        {/* ROI Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Expected ROI
          </label>
          <div className="space-y-4">
            <Slider
              min={0}
              max={100}
              step={1}
              value={[filters.roi.min, filters.roi.max]}
              onValueChange={(values: number[]) => 
                onChange({ roi: { min: values[0], max: values[1] } })
              }
              formatLabel={formatROI}
            />
            <div className="flex items-center justify-between text-xs text-body-color">
              <span>{formatROI(filters.roi.min)}</span>
              <span>{formatROI(filters.roi.max)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentFilters; 