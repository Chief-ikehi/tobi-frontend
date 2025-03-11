'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface NotificationSettings {
  investmentUpdates: boolean;
  monthlyStatements: boolean;
  taxDocuments: boolean;
  propertyAlerts: boolean;
  marketingEmails: boolean;
}

interface InvestmentPreferences {
  minInvestmentAmount: number;
  maxInvestmentAmount: number;
  preferredLocations: string[];
  investmentTypes: string[];
  riskTolerance: 'low' | 'medium' | 'high';
}


export default function SettingsPage() {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    investmentUpdates: true,
    monthlyStatements: true,
    taxDocuments: true,
    propertyAlerts: true,
    marketingEmails: false,
  });

  const [investmentPreferences, setInvestmentPreferences] = useState<InvestmentPreferences>({
    minInvestmentAmount: 1000000,
    maxInvestmentAmount: 5000000,
    preferredLocations: ['Lagos', 'Abuja'],
    investmentTypes: ['Residential', 'Commercial'],
    riskTolerance: 'medium',
  });

  const handleNotificationToggle = (setting: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleInvestmentPreferenceChange = (
    field: keyof InvestmentPreferences,
    value: InvestmentPreferences[keyof InvestmentPreferences]
  ) => {
    setInvestmentPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your account and investment preferences</p>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                <Image
                  src="/images/placeholder-avatar.jpg"
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  Change Profile Picture
                </button>
                <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. Max size of 2MB</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+234 123 456 7890"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Investment Preferences */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Investment Preferences</h2>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investment Range</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="number"
                    value={investmentPreferences.minInvestmentAmount}
                    onChange={(e) => handleInvestmentPreferenceChange('minInvestmentAmount', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Minimum Amount"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    value={investmentPreferences.maxInvestmentAmount}
                    onChange={(e) => handleInvestmentPreferenceChange('maxInvestmentAmount', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Maximum Amount"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Locations</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Lagos, Abuja"
                value={investmentPreferences.preferredLocations.join(', ')}
                onChange={(e) => handleInvestmentPreferenceChange('preferredLocations', e.target.value.split(',').map(loc => loc.trim()))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investment Types</label>
              <div className="flex flex-wrap gap-2">
                {['Residential', 'Commercial', 'Industrial', 'Land'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      const currentTypes = investmentPreferences.investmentTypes;
                      const newTypes = currentTypes.includes(type)
                        ? currentTypes.filter(t => t !== type)
                        : [...currentTypes, type];
                      handleInvestmentPreferenceChange('investmentTypes', newTypes);
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      investmentPreferences.investmentTypes.includes(type)
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Risk Tolerance</label>
              <div className="flex gap-4">
                {(['low', 'medium', 'high'] as const).map((risk) => (
                  <button
                    key={risk}
                    onClick={() => handleInvestmentPreferenceChange('riskTolerance', risk)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium capitalize ${
                      investmentPreferences.riskTolerance === risk
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
          </div>
          <div className="p-4 space-y-4">
            {Object.entries(notificationSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {key === 'investmentUpdates' && 'Get notified about your investment performance'}
                    {key === 'monthlyStatements' && 'Receive monthly investment statements'}
                    {key === 'taxDocuments' && 'Get notified when tax documents are available'}
                    {key === 'propertyAlerts' && 'Receive alerts about property updates'}
                    {key === 'marketingEmails' && 'Receive marketing and promotional emails'}
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationToggle(key as keyof NotificationSettings)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    value ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      value ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 