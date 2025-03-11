'use client';

import React, { useState, useEffect } from 'react';
import { Property } from '@/lib/services/propertyService';
import { getProperties } from '@/lib/services/propertyService';
import Image from 'next/image';
import Link from 'next/link';

interface PortfolioStats {
  totalValue: number;
  totalInvested: number;
  totalReturns: number;
  monthlyIncome: number;
  averageRoi: number;
}

export default function PortfolioPage() {
  const [investments, setInvestments] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PortfolioStats>({
    totalValue: 0,
    totalInvested: 0,
    totalReturns: 0,
    monthlyIncome: 0,
    averageRoi: 0,
  });
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('ALL');

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        setLoading(true);
        setError(null);
        // In a real app, this would fetch the user's investments
        const properties = await getProperties({ investmentOnly: true });
        setInvestments(properties.slice(0, 3));

        // Calculate portfolio stats
        const totalValue = properties.slice(0, 3).reduce(
          (sum, property) => sum + (property.investmentDetails?.investmentAmount || 0),
          0
        );

        const totalInvested = totalValue * 0.8; // Mock data: 80% of current value
        const totalReturns = totalValue - totalInvested;
        const monthlyIncome = properties.slice(0, 3).reduce(
          (sum, property) => sum + (property.investmentDetails?.monthlyIncome || 0),
          0
        );
        const averageRoi = properties.slice(0, 3).reduce(
          (sum, property) => sum + (property.investmentDetails?.roi || 0),
          0
        ) / 3;

        setStats({
          totalValue,
          totalInvested,
          totalReturns,
          monthlyIncome,
          averageRoi,
        });
      } catch (err) {
        setError('Failed to fetch portfolio data. Please try again later.');
        console.error('Error fetching investments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [timeframe]);

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
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-red-500 text-center px-4">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Investment Portfolio</h1>
          <p className="text-sm text-gray-600 mb-4">Track your investments and returns</p>
          
          {/* Time Filter */}
          <div className="flex flex-wrap gap-2">
            {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  timeframe === period
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Portfolio Value</h3>
              <div className="flex items-center text-green-500">
                <span className="text-xs">+2.5%</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {formatPrice(stats.totalValue)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Total Invested</h3>
              <div className="flex items-center text-blue-500">
                <span className="text-xs">Active</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {formatPrice(stats.totalInvested)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Total Returns</h3>
              <div className="flex items-center text-green-500">
                <span className="text-xs">+{stats.averageRoi}%</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {formatPrice(stats.totalReturns)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Monthly Income</h3>
              <div className="flex items-center text-blue-500">
                <span className="text-xs">Passive</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {formatPrice(stats.monthlyIncome)}
            </p>
          </div>
        </div>

        {/* Investment List */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Your Investments</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {investments.map((investment) => (
              <div key={investment.id} className="p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={investment.images[0] || '/images/placeholder.jpg'}
                        alt={investment.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{investment.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {investment.location.address}, {investment.location.city}
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Investment</p>
                          <p className="text-sm font-medium">
                            {formatPrice(investment.investmentDetails?.investmentAmount || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Monthly</p>
                          <p className="text-sm font-medium text-green-600">
                            {formatPrice(investment.investmentDetails?.monthlyIncome || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">ROI</p>
                          <p className="text-sm font-medium text-blue-600">
                            {investment.investmentDetails?.roi}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Link
                      href={`/investors/opportunities/${investment.id}`}
                      className="inline-block w-full md:w-auto px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment History */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Investment History</h2>
          </div>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Property
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {investments.map((investment) => (
                    <tr key={investment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date().toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {investment.title}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        Investment
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {formatPrice(investment.investmentDetails?.investmentAmount || 0)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 