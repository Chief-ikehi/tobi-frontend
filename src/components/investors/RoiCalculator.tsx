import React, { useState } from 'react';
import { Property } from '@/lib/services/propertyService';

interface RoiCalculatorProps {
  property: Property;
}

export function RoiCalculator({ property }: RoiCalculatorProps) {
  const [investmentAmount, setInvestmentAmount] = useState<number>(
    property.investmentDetails?.investmentAmount || 0
  );
  const [timeframe, setTimeframe] = useState<number>(12); // months

  const calculateRoi = () => {
    if (!property.investmentDetails) return 0;
    
    const monthlyIncome = property.investmentDetails.monthlyIncome;
    const totalIncome = monthlyIncome * timeframe;
    const roi = ((totalIncome - investmentAmount) / investmentAmount) * 100;
    
    return roi;
  };

  const calculateMonthlyIncome = () => {
    if (!property.investmentDetails) return 0;
    
    const monthlyIncome = property.investmentDetails.monthlyIncome;
    const investmentRatio = investmentAmount / (property.investmentDetails.investmentAmount || 1);
    
    return monthlyIncome * investmentRatio;
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: property.price.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const roi = calculateRoi();
  const monthlyIncome = calculateMonthlyIncome();
  const totalIncome = monthlyIncome * timeframe;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">ROI Calculator</h2>
      
      {/* Investment Amount Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Investment Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {property.price.currency}
          </span>
          <input
            type="number"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
            className="pl-8 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            min="0"
            step="1000"
          />
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Investment Timeframe
        </label>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="12">1 Year</option>
          <option value="24">2 Years</option>
          <option value="36">3 Years</option>
          <option value="48">4 Years</option>
          <option value="60">5 Years</option>
        </select>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Monthly Income</p>
          <p className="text-xl font-semibold text-primary-600">
            {formatPrice(monthlyIncome)}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Income ({timeframe} months)</p>
          <p className="text-xl font-semibold text-green-600">
            {formatPrice(totalIncome)}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Return on Investment</p>
          <p className="text-xl font-semibold text-blue-600">
            {roi.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-sm text-gray-500">
        * This is an estimate based on current market conditions and historical data. Actual returns may vary.
      </p>
    </div>
  );
} 