'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Property, getProperties } from '@/lib/services/propertyService';
import { FavoriteButton } from '@/components/properties/FavoriteButton';
import { ContactAgentModal } from '@/components/properties/ContactAgentModal';
import { BookingWidget } from '@/components/bookings/BookingWidget';

interface PropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const resolvedParams = React.use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        const properties = await getProperties();
        const foundProperty = properties.find(p => p.id === resolvedParams.id);
        if (foundProperty) {
          setProperty(foundProperty);
        } else {
          setError('Property not found');
        }
      } catch (err) {
        setError('Failed to fetch property details. Please try again later.');
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [resolvedParams.id]);

  const formatPrice = (price: { amount: number; currency: string }) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: price.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price.amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error || 'Property not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
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
                <p className="text-gray-600 mb-2">
                  {property.location.address}, {property.location.city}
                </p>
                <div className="flex items-center gap-4">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                    {property.features.bedrooms} beds
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                    {property.features.bathrooms} baths
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                    {property.features.area}m²
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-600">
                  {formatPrice(property.price)}
                </p>
                <p className="text-gray-600">{property.reviews} reviews</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
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

            {/* Host Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Hosted by</h2>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={property.host.avatar}
                    alt={property.host.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{property.host.name}</h3>
                  <p className="text-gray-600">Host rating: {property.host.rating}/5</p>
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="text-primary-600 hover:text-primary-700 font-medium mt-1"
                  >
                    Contact Host
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Booking Widget */}
        <div className="md:col-span-1">
          <BookingWidget propertyId={property.id} property={property} />
        </div>
      </div>

      {/* Contact Modal */}
      <ContactAgentModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        propertyId={property.id}
        agentId={property.host.id}
        propertyTitle={property.title}
      />
    </div>
  );
}