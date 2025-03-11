'use client';
import React, { useState, useEffect } from 'react';
import { Property } from '@/lib/services/propertyService';
import { getProperties } from '@/lib/services/propertyService';
import { InvestmentPropertyCard } from '@/components/investors/InvestmentPropertyCard';
import { InvestmentFilters } from '@/components/investors/InvestmentFilters';

interface Filters {
  location: string;
  minRoi: number;
  maxRoi: number;
  investmentStage: string;
  timeline: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function InvestmentOpportunities() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    location: '',
    minRoi: 0,
    maxRoi: 100,
    investmentStage: 'all',
    timeline: 'all',
    sortBy: 'roi',
    sortOrder: 'desc'
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProperties = await getProperties({ investmentOnly: true });
        setProperties(fetchedProperties);
      } catch (err) {
        setError('Failed to fetch investment properties. Please try again later.');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4">
          <InvestmentFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
              Investment Opportunities
            </h1>
            <div className="flex gap-4">
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value, filters.sortOrder)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="roi">ROI</option>
                <option value="price">Price</option>
                <option value="date">Date Added</option>
              </select>
              <button
                onClick={() => handleSortChange(filters.sortBy, filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {/* Property Grid */}
          {properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No investment properties found matching your criteria. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <InvestmentPropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 