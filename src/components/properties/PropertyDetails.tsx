'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import Image from 'next/image';
import { PROPERTY_DETAIL } from '@/lib/graphql/properties';
import { formatCurrency } from '@/lib/utils';
import { Property, ListingType } from '@/types/property';
import { FavoriteButton } from '@/components/properties/FavoriteButton';
import { ContactAgentModal } from '@/components/properties/ContactAgentModal';

interface PropertyDetailsProps {
  propertyId: string;
}

export default function PropertyDetails({ propertyId }: PropertyDetailsProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { loading, error, data } = useQuery(PROPERTY_DETAIL, {
    variables: { id: propertyId },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Error loading property details. Please try again later.</p>
      </div>
    );
  }

  const property: Property = data.property;

  const getSafetyRatingColor = (rating: string) => {
    switch (rating) {
      case 'EXCELLENT':
        return 'bg-green-100 text-green-700';
      case 'GOOD':
        return 'bg-blue-100 text-blue-700';
      case 'AVERAGE':
        return 'bg-yellow-100 text-yellow-700';
      case 'FAIR':
        return 'bg-orange-100 text-orange-700';
      case 'POOR':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative h-96 rounded-lg overflow-hidden">
          <Image
            src={property.images[0] || '/images/placeholder.jpg'}
            alt={property.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2">
            <FavoriteButton propertyId={property.id} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {property.images.slice(1, 5).map((image, index) => (
            <div key={index} className="relative h-44 rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={`${property.title} - ${index + 2}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Property Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <p className="text-gray-600 mb-2">{property.address}</p>
            <div className="flex items-center gap-4">
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                {property.propertyType}
              </span>
              <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-sm">
                {property.listingType}
              </span>
              <span className={`px-2 py-1 rounded text-sm ${getSafetyRatingColor(property.safetyRating)}`}>
                {property.safetyRating}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary-600">{formatCurrency(property.price)}</p>
            <p className="text-gray-600">{property.viewCount} views</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Property Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
          </section>

          {/* Property Features */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Property Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Bedrooms</p>
                <p className="text-xl font-semibold">{property.bedrooms}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Bathrooms</p>
                <p className="text-xl font-semibold">{property.bathrooms}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Square Footage</p>
                <p className="text-xl font-semibold">{property.squareFootage}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Year Built</p>
                <p className="text-xl font-semibold">{property.yearBuilt || 'N/A'}</p>
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-primary-600">✓</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Nearby Attractions */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Nearby Attractions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.nearbyAttractions.map((attraction, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  {attraction}
                </div>
              ))}
            </div>
          </section>

          {/* Virtual Tour */}
          {property.virtualTourUrl && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Virtual Tour</h2>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={property.virtualTourUrl}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Contact and Investment Details */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Contact Agent</h3>
            <div className="mb-4">
              <p className="font-medium">{property.owner.fullName}</p>
              <p className="text-gray-600">{property.owner.email}</p>
            </div>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
            >
              Send Message
            </button>
          </div>

          {/* Investment Details */}
          {property.listingType === ListingType.INVESTMENT && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Investment Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Expected ROI</p>
                  <p className="text-xl font-semibold">{property.expectedRoi}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Occupancy Rate</p>
                  <p className="text-xl font-semibold">{property.occupancyRate}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Monthly Revenue</p>
                  <p className="text-xl font-semibold">{formatCurrency(property.monthlyRevenue || 0)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Monthly Expenses</p>
                  <p className="text-xl font-semibold">{formatCurrency(property.monthlyExpenses || 0)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      <ContactAgentModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        propertyId={property.id}
        agentId={property.owner.id}
        propertyTitle={property.title}
      />
    </div>
  );
} 