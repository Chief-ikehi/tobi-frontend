'use client';

import React, { useState, useEffect } from 'react';
import { Property } from '@/lib/services/propertyService';
import { getProperties } from '@/lib/services/propertyService';
import Link from 'next/link';
import Image from 'next/image';

interface DashboardStats {
  totalInvestments: number;
  totalValue: number;
  monthlyIncome: number;
  averageRoi: number;
}

export default function InvestorDashboard() {
  const [activeInvestments, setActiveInvestments] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalInvestments: 0,
    totalValue: 0,
    monthlyIncome: 0,
    averageRoi: 0,
  });

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        setLoading(true);
        setError(null);
        // In a real app, this would fetch the user's investments
        const properties = await getProperties({ investmentOnly: true });
        // For demo, we'll use the first 3 properties as active investments
        setActiveInvestments(properties.slice(0, 3));

        // Calculate dashboard stats
        const totalValue = properties.slice(0, 3).reduce(
          (sum, property) => sum + (property.investmentDetails?.investmentAmount || 0),
          0
        );

        const monthlyIncome = properties.slice(0, 3).reduce(
          (sum, property) => sum + (property.investmentDetails?.monthlyIncome || 0),
          0
        );

        const averageRoi = properties.slice(0, 3).reduce(
          (sum, property) => sum + (property.investmentDetails?.roi || 0),
          0
        ) / 3;

        setStats({
          totalInvestments: 3,
          totalValue,
          monthlyIncome,
          averageRoi,
        });
      } catch (err) {
        setError('Failed to fetch investment data. Please try again later.');
        console.error('Error fetching investments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  const formatPrice = (amount: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Investor!</h1>
          <p className="text-gray-600 mt-2">Here's an overview of your investment portfolio</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Investments</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalInvestments}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Portfolio Value</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatPrice(stats.totalValue)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Monthly Income</h3>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {formatPrice(stats.monthlyIncome)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Average ROI</h3>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {stats.averageRoi.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Active Investments */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Active Investments</h2>
            <Link
              href="/investors/opportunities"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeInvestments.map((property) => (
              <div
                key={property.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={property.images[0] || '/images/placeholder.jpg'}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{property.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {property.location.address}, {property.location.city}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Investment</p>
                      <p className="font-medium">
                        {formatPrice(property.investmentDetails?.investmentAmount || 0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">ROI</p>
                      <p className="font-medium text-green-600">
                        {property.investmentDetails?.roi}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {/* Mock activity items */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Monthly Income Received</p>
                  <p className="text-sm text-gray-500">Luxury One-Bedroom Apartment</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+{formatPrice(150000)}</p>
                <p className="text-sm text-gray-500">Today</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Investment Application Approved</p>
                  <p className="text-sm text-gray-500">Modern Studio Apartment</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-blue-600">Approved</p>
                <p className="text-sm text-gray-500">2 days ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Property Update</p>
                  <p className="text-sm text-gray-500">Cozy Family Apartment</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-yellow-600">New Features Added</p>
                <p className="text-sm text-gray-500">5 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 