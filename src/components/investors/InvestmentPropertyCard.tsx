import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/lib/services/propertyService';

interface InvestmentPropertyCardProps {
  property: Property;
}

export const InvestmentPropertyCard: React.FC<InvestmentPropertyCardProps> = ({ property }) => {
  const formatPrice = (price: { amount: number; currency: string }) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: price.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price.amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Property Image */}
      <div className="relative h-48">
        <Image
          src={property.images[0] || '/images/placeholder.jpg'}
          alt={property.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-sm">
          Investment Opportunity
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        <Link href={`/investors/opportunities/${property.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-primary-600">
            {property.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-2">
          {property.location.address}, {property.location.city}
        </p>

        {/* Investment Metrics */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">ROI</span>
            <span className="text-lg font-bold text-green-600">
              {property.investmentDetails?.roi}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Monthly Income</span>
            <span className="text-lg font-bold text-primary-600">
              {formatPrice({ amount: property.investmentDetails?.monthlyIncome || 0, currency: property.price.currency })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Investment Amount</span>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice({ amount: property.investmentDetails?.investmentAmount || 0, currency: property.price.currency })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Occupancy Rate</span>
            <span className="text-lg font-bold text-blue-600">
              {property.investmentDetails?.occupancyRate}%
            </span>
          </div>
        </div>

        {/* Property Features */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span>{property.features.bedrooms} beds</span>
          <span>{property.features.bathrooms} baths</span>
          <span>{property.features.area} m²</span>
        </div>

        {/* Action Button */}
        <Link
          href={`/investors/opportunities/${property.id}`}
          className="block w-full bg-primary-600 text-white text-center py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}; 