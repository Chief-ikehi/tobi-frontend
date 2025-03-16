'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Details = () => {

  return (
    <div className="min-h-screen dark:bg-black bg-gray-50">
      {/* What We Do Section */}
      <section className="py-5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">List & Manage Properties</h3>
              <p className="text-gray-600">
                Agents can list, edit, and manage multiple properties easily with TOBI's streamlined platform.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Earn Commissions</h3>
              <p className="text-gray-600">
                Earn commissions for every successful booking or sale made through your listings.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Verified Agent Benefits</h3>
              <p className="text-gray-600">
                Get a **Verified Agent** badge to build trust and attract more clients to your listings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Partner as an Agent */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How to Get Started as an Agent</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Create Your Agent Account</h3>
                  <p className="text-gray-600">
                    Sign up and submit verification documents to become a registered TOBI agent.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">List Your Properties</h3>
                  <p className="text-gray-600">
                    Upload property details, set pricing, and manage availability through your dashboard.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Get Verified & Start Earning</h3>
                  <p className="text-gray-600">
                    Once verified, receive priority listings, a verified badge, and start earning commissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/dashboard">
              <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Register as an Agent
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Details;
