'use client';

import React from 'react';
import Link from 'next/link';
import { FaHome, FaMoneyBillWave, FaCheckCircle, FaUserCheck, FaClipboardList, FaRocket } from 'react-icons/fa';

const Details = () => {
  return (
    <div className="min-h-screen dark:bg-black bg-gray-50">

      {/* What We Offer Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer Agents</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 dark:bg-blacksection rounded-lg shadow-md">
              <div className="text-primary-600 text-3xl mb-4"><FaHome /></div>
              <h3 className="text-xl font-semibold mb-2">List & Manage Properties</h3>
              <p className="text-gray-600">
                Easily list multiple properties, update pricing, availability, and manage all listings in one place.
              </p>
            </div>
            <div className="bg-white p-6 dark:bg-blacksection rounded-lg shadow-md">
              <div className="text-primary-600 text-3xl mb-4"><FaMoneyBillWave /></div>
              <h3 className="text-xl font-semibold mb-2">Earn Commission on Every Deal</h3>
              <p className="text-gray-600">
                Get paid a fixed percentage commission from every successful booking and investment on your properties.
              </p>
            </div>
            <div className="bg-white p-6 dark:bg-blacksection rounded-lg shadow-md">
              <div className="text-primary-600 text-3xl mb-4"><FaUserCheck /></div>
              <h3 className="text-xl font-semibold mb-2">Verified Agent Status</h3>
              <p className="text-gray-600">
                Display a trusted badge on all listings. Verified agents enjoy priority placement and higher conversion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-primary-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Agent Perks & Benefits</h2>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <FaCheckCircle className="text-green-500 text-2xl mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Wallet-Based Commission</h3>
                <p className="text-gray-600">Commissions go straight to your agent wallet—track & withdraw anytime.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaCheckCircle className="text-green-500 text-2xl mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Performance Insights</h3>
                <p className="text-gray-600">Track your earnings, commission sources, and property performance.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaCheckCircle className="text-green-500 text-2xl mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Verified Badge & Fast Approval</h3>
                <p className="text-gray-600">Get fast-tracked approval and better listing visibility when verified.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaCheckCircle className="text-green-500 text-2xl mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Full Autonomy</h3>
                <p className="text-gray-600">Edit, update, and manage your properties freely—no micro-management.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Partner Section */}
      <section className="py-16 dark:bg-blacksection bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How to Become an Agent</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-10">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Register as an Agent</h3>
                  <p className="text-gray-600">Create your account and set your role to "Agent" on signup.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Submit Verification Documents</h3>
                  <p className="text-gray-600">Upload CAC certificate, valid ID, business proof, and authorization letter.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Get Verified & Start Listing</h3>
                  <p className="text-gray-600">Once verified, your dashboard unlocks full access to listing tools and earnings.</p>
                </div>
              </div>
              <div className="text-center mt-10">
                <Link href="/auth/signup" className="inline-block dark:bg-black bg-blue-600 text-white dark:text-white px-6 py-3 rounded-full shadow-md hover:bg-primary-700 transition">
                  Register as an Agent
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
