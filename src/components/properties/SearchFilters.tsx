import React from 'react';
import { PropertyFilters } from '@/lib/services/propertyService';

interface SearchFiltersProps {
  filters: PropertyFilters;
  setFilters: (filters: PropertyFilters) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, setFilters }) => {
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, location: e.target.value });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters({ ...filters, minPrice: min, maxPrice: max });
  };

  const handleAmenitiesChange = (amenity: string) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    setFilters({ ...filters, amenities: newAmenities });
  };

  const handleBedroomsChange = (bedrooms: number) => {
    setFilters({ ...filters, bedrooms });
  };

  const handleRatingChange = (rating: number) => {
    setFilters({ ...filters, rating });
  };

  const handleInvestmentOnlyChange = (checked: boolean) => {
    setFilters({ ...filters, investmentOnly: checked });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      {/* Location */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          placeholder="Enter city or area"
          value={filters.location || ''}
          onChange={handleLocationChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price Range (NGN)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => handlePriceRangeChange(Number(e.target.value), filters.maxPrice || 0)}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => handlePriceRangeChange(filters.minPrice || 0, Number(e.target.value))}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bedrooms
        </label>
        <select
          value={filters.bedrooms || ''}
          onChange={(e) => handleBedroomsChange(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Minimum Rating
        </label>
        <select
          value={filters.rating || ''}
          onChange={(e) => handleRatingChange(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Any</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
        </select>
      </div>

      {/* Amenities */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amenities
        </label>
        <div className="space-y-2">
          {['WiFi', 'Air Conditioning', 'Swimming Pool', 'Gym', 'Security', 'Parking'].map((amenity) => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.amenities?.includes(amenity) || false}
                onChange={() => handleAmenitiesChange(amenity)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Investment Only */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.investmentOnly || false}
            onChange={(e) => handleInvestmentOnlyChange(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Investment Properties Only</span>
        </label>
      </div>
    </div>
  );
}; 