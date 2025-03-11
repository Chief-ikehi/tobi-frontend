import React from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface Filters {
  location: string;
  minRoi: number;
  maxRoi: number;
  investmentStage: string;
  timeline: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface InvestmentFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export const InvestmentFilters: React.FC<InvestmentFiltersProps> = ({ filters, onFilterChange }) => {
  const locations: FilterOption[] = [
    { label: 'All Locations', value: 'all' },
    { label: 'Lagos', value: 'lagos' },
    { label: 'Abuja', value: 'abuja' },
    { label: 'Port Harcourt', value: 'port-harcourt' },
  ];

  const investmentStages: FilterOption[] = [
    { label: 'All Stages', value: 'all' },
    { label: 'Pre-construction', value: 'pre-construction' },
    { label: 'Under Construction', value: 'under-construction' },
    { label: 'Completed', value: 'completed' },
  ];

  const timelines: FilterOption[] = [
    { label: 'Any Timeline', value: 'all' },
    { label: 'Short Term (1-2 years)', value: 'short' },
    { label: 'Medium Term (3-5 years)', value: 'medium' },
    { label: 'Long Term (5+ years)', value: 'long' },
  ];

  const handleFilterChange = (filterType: keyof Filters, value: string | number) => {
    const newFilters = {
      ...filters,
      [filterType]: value,
    };
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      {/* Location */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <select
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {locations.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Investment Stage */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Investment Stage
        </label>
        <select
          value={filters.investmentStage}
          onChange={(e) => handleFilterChange('investmentStage', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {investmentStages.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Timeline
        </label>
        <select
          value={filters.timeline}
          onChange={(e) => handleFilterChange('timeline', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {timelines.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* ROI Range */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ROI Range (%)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={filters.minRoi}
            onChange={(e) => handleFilterChange('minRoi', Number(e.target.value))}
            placeholder="Min"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="number"
            value={filters.maxRoi}
            onChange={(e) => handleFilterChange('maxRoi', Number(e.target.value))}
            placeholder="Max"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Reset Filters */}
      <button
        onClick={() => {
          const defaultFilters: Filters = {
            location: 'all',
            minRoi: 0,
            maxRoi: 100,
            investmentStage: 'all',
            timeline: 'all',
            sortBy: 'roi',
            sortOrder: 'desc'
          };
          onFilterChange(defaultFilters);
        }}
        className="w-full mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
}; 