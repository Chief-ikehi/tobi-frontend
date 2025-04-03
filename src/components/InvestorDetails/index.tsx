'use client';

import React from 'react';
import Link from 'next/link';
import { FaWallet, FaChartLine, FaHome, FaCheckCircle, FaClipboardList, FaHandshake } from 'react-icons/fa';

const Details = () => {
  return (
    <div className="min-h-screen dark:bg-black bg-gray-50">

      {/* What We Do Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-blacksection p-6 rounded-lg shadow-md">
              <div className="text-primary-600 text-3xl mb-4"><FaHome /></div>
              <h3 className="text-xl font-semibold mb-2">Curated Property Deals</h3>
              <p className="text-gray-600">
                We handpick high-demand shortlet, hybrid, and investment properties with strong ROI potential.
              </p>
            </div>
            <div className="bg-white p-6 dark:bg-blacksection rounded-lg shadow-md">
              <div className="text-primary-600 text-3xl mb-4"><FaChartLine /></div>
              <h3 className="text-xl font-semibold mb-2">Data-Driven Decisions</h3>
              <p className="text-gray-600">
                Access market insights and ROI projections to make informed investment choices.
              </p>
            </div>
            <div className="bg-white p-6 dark:bg-blacksection rounded-lg shadow-md">
              <div className="text-primary-600 text-3xl mb-4"><FaWallet /></div>
              <h3 className="text-xl font-semibold mb-2">Portfolio & Wallet Management</h3>
              <p className="text-gray-600">
                Track your investments, returns, and wallet balance. Get ₦5M shortlet credit on every investment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-primary-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Invest with TOBI?</h2>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <FaCheckCircle className="text-green-500 text-2xl mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Flexible Investment Plans</h3>
                <p className="text-gray-600">Start from 60% of property cost. Pay balance monthly for up to 3 years.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaCheckCircle className="text-green-500 text-2xl mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Wallet Credit</h3>
                <p className="text-gray-600">Enjoy ₦5M credit to book any shortlet property immediately after investing.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaCheckCircle className="text-green-500 text-2xl mt-1" />
              <div>
                <h3 className="font-semibold text-lg">ROI Payouts</h3>
                <p className="text-gray-600">Track your monthly ROI and access performance history in your dashboard.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaCheckCircle className="text-green-500 text-2xl mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Private Membership</h3>
                <p className="text-gray-600">Gold or Platinum tier membership activated after investment—full of perks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Partner Section */}
      <section className="py-16 bg-white dark:bg-blacksection">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How to Get Started</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-10">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Create Your Investor Account</h3>
                  <p className="text-gray-600">Sign up and complete your KYC documentation.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Explore Properties</h3>
                  <p className="text-gray-600">Review detailed metrics, ROI projections, and choose your preferred plan.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Invest & Access Benefits</h3>
                  <p className="text-gray-600">Make your investment. Get wallet credit, track ROI, and enjoy premium perks.</p>
                </div>
              </div>
              <div className="text-center  mt-10">
                <Link href="/auth/signup" className="inline-block dark:bg-black bg-blue-600 text-white dark:text-white px-6 py-3 rounded-full shadow-md hover:bg-primary-700 transition">
                  Join TOBI Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Details;