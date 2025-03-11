'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/lib/services/propertyService';
import { getProperties } from '@/lib/services/propertyService';
import { RoiCalculator } from '@/components/investors/RoiCalculator';
import { InvestmentApplication } from '@/components/investors/InvestmentApplication';

import { useParams } from 'next/navigation'; // Corrected import for useParams

export default function OpportunityPage() {
  const { id } = useParams(); // Correct usage of useParams to fetch 'id'
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplication, setShowApplication] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        const properties = await getProperties({ investmentOnly: true });
        const foundProperty = properties.find(p => p.id === id);
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
  }, [id]);

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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <p className="text-gray-600">
                {property.location.address}, {property.location.city}
              </p>
            </div>
            <Link href="/investors/opportunities" className="text-primary-600 hover:text-primary-700 font-medium">
              ← Back to Opportunities
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="relative h-[400px]">
                <Image
                  src={property.images[0] || '/images/placeholder.jpg'}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="grid grid-cols-4 gap-2">
                  {property.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="relative h-24">
                      <Image
                        src={image}
                        alt={`${property.title} - Image ${index + 2}`}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="font-medium">{property.features.bedrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="font-medium">{property.features.bathrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Area</p>
                  <p className="font-medium">{property.features.area} m²</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-medium">{formatPrice(property.price)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium capitalize">{property.status}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{property.description}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Investment Metrics</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Expected ROI</p>
                  <p className="text-2xl font-bold text-green-600">{property.investmentDetails?.roi}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Income</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatPrice({ amount: property.investmentDetails?.monthlyIncome || 0, currency: property.price.currency })}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <RoiCalculator property={property} />
            </div>

            {!showApplication ? (
              <button
                onClick={() => setShowApplication(true)}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Apply to Invest
              </button>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <InvestmentApplication property={property} onCancel={() => setShowApplication(false)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
