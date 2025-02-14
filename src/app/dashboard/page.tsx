"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Home, Settings, Heart, ChevronRight, Menu, X } from 'lucide-react';
import Navbar from "@/app/dashboard/components/Navbar";

interface Booking {
  propertyImage: string;
  propertyName: string;
  dates: string;
  status: 'active' | 'completed' | 'cancelled';
}

interface Property {
  image: string;
  name: string;
  price: number;
}

export default function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentBooking: Booking = {
    propertyImage: '/placeholder/100/100',
    propertyName: 'Luxury Apartment in Lekki',
    dates: 'March 20 - 27, 2025',
    status: 'active'
  };

  const recommendedProperty: Property = {
    image: '/placeholder/300/200',
    name: 'Premium Villa',
    price: 250000
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-2">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 relative">
        <div className="flex items-center space-x-2">
          <Home className="w-6 text-blue-800 h-6" />
          <span className="text-xl text-blue-800 font-semibold">TOBI</span>
        </div>

        {/* Hamburger Menu Button - Only visible on mobile/tablet */}
        <button
          onClick={toggleMenu}
          className="lg:hidden z-50"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Mobile Navigation Menu */}
        <div className={`
          fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out
          lg:relative lg:inset-auto lg:transform-none lg:transition-none lg:bg-transparent
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <nav className={`
            flex flex-col items-center justify-center h-full space-y-8
            lg:flex-row lg:space-y-0 lg:space-x-6 lg:h-auto
          `}>
            <a href="#" className="text-blue-800 hover:text-blue-700">Dashboard</a>
            <a href="#" className="text-blue-800 hover:text-blue-700">Bookings</a>
            <a href="#" className="text-blue-800 hover:text-blue-700">Favorites</a>
            <a href="#" className="text-blue-800 hover:text-blue-700">Settings</a>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </nav>
        </div>
      </header>

      {/* Current Bookings Section */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Current Bookings</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
            <Image
              src={currentBooking.propertyImage}
              alt={currentBooking.propertyName}
              width={100}
              height={100}
              className="rounded-lg w-full text-blue-800 md:w-auto h-48 md:h-auto object-cover"
            />
            <div className="flex-grow">
              <h3 className="font-medium">{currentBooking.propertyName}</h3>
              <p className="text-blue-800 text-sm">{currentBooking.dates}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="px-4 py-2 text-sm border bg-white border-gray-300 text-blue-900 rounded-md hover:text-white hover:bg-blue-900 transform transition hover:scale-105 duration-300 ease-in-out">
                  Modify
                </button>
                <button className="px-4 py-2 text-sm border border-gray-300 text-blue-900 rounded-md hover:bg-blue-900 hover:text-white transform transition hover:scale-105 duration-300 ease-in-out">
                  Cancel
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                <button className="text-sm text-blue-900 hover:text-blue-700">
                  Contact Agent
                </button>
                <button className="text-sm text-blue-900 hover:text-blue-700">
                  Request Handyman
                </button>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full self-start md:self-auto">
              Active
            </span>
          </div>
        </div>
      </section>

      {/* Recommended Section */}
      <section>
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Recommended for You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Image
              src={recommendedProperty.image}
              alt={recommendedProperty.name}
              width={300}
              height={200}
              className="w-full h-48 text-blue-800 object-cover"
            />
            <div className="p-4">
              <p className="text-sm text-blue-800">Based on your Lagos stays</p>
              <h3 className="font-medium text-blue-800 mt-1">{recommendedProperty.name}</h3>
              <p className="text-sm text-blue-800">₦{recommendedProperty.price.toLocaleString()}/night</p>
              <button className="w-full mt-4 bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transform transition hover:scale-105 duration-300 ease-in-out">
                Explore
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 space-y-4 md:space-y-0">
        <span>24/7 Support: support@tobi.com</span>
        <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 w-full md:w-auto transform transition hover:scale-105 duration-300 ease-in-out">
          👑 Upgrade to Private Membership
        </button>
      </footer>
    </div>
  );
}