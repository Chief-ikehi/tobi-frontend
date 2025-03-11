import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/lib/services/propertyService';
import { FavoriteButton } from './FavoriteButton';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
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
        {property.status !== 'available' && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
            {property.status === 'booked' ? 'Booked' : 'Under Maintenance'}
          </div>
        )}
        <FavoriteButton propertyId={property.id} className="absolute top-2 left-2" />
      </div>

      {/* Property Details */}
      <div className="p-4">
        <Link href={`/properties/${property.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-primary-600">
            {property.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-2">
          {property.location.address}, {property.location.city}
        </p>

        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(property.price)}
          </span>
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-sm text-gray-600">
              {property.rating} ({property.reviews} reviews)
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>{property.features.bedrooms} beds</span>
          <span>{property.features.bathrooms} baths</span>
          <span>{property.features.area} m²</span>
        </div>

        {property.investmentDetails && (
          <div className="mt-2">
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Investment Opportunity
            </span>
            <div className="mt-1 text-sm text-gray-600">
              <p>ROI: {property.investmentDetails.roi}%</p>
              <p>Monthly Income: {formatPrice({ amount: property.investmentDetails.monthlyIncome, currency: property.price.currency })}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 