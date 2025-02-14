// Import required dependencies
"use client";
import { useParams } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import Navbar from "@/components/Navbar";

// Define types for property
interface Property {
  id: number;
  image: string;
  title: string;
  location: string;
  price: number;
  type: string;
  amenities: string[];
}

const PropertyDetails = () => {
  // Get the dynamic property id using `useParams` from next/navigation
  const { id } = useParams();

  // Static list of all properties (mock data for now)
  const properties: Property[] = [
    {
      id: 1,
      image: "https://i.ibb.co/N2VRXb4Y/Anaconda-Cut-1-Bedroom-Apartment.png",
      title: "Luxury Studio Apartment",
      location: "Ikoyi",
      price: 250,
      type: "1-Bed Apartment",
      amenities: ["Wi-Fi", "Pool"],
    },
    {
      id: 2,
      image: "https://i.ibb.co/vvXy57h6/room4.png",
      title: "Modern Studio Apartment",
      location: "Victoria Island",
      price: 300,
      type: "1-Bed Apartment",
      amenities: ["Private Beach", "Parking"],
    },
    {
      id: 3,
      image: "https://i.ibb.co/F46z2M9q/room5.png",
      title: "Beachfront Studio Apartment",
      location: "Ikoyi",
      price: 350,
      type: "1-Bed Apartment",
      amenities: ["Wi-Fi", "Gym"],
    },
    {
      id: 4,
      image: "https://i.ibb.co/5XV69Tm6/room3.png",
      title: "Cozy Studio Apartment",
      location: "Victoria Island",
      price: 200,
      type: "1-Bed Apartment",
      amenities: ["Parking", "Pet-Friendly"],
    },
    {
      id: 5,
      image: "https://i.ibb.co/MxdXJRt5/apt2.png",
      title: "Spacious Studio Apartment",
      location: "Ikoyi",
      price: 320,
      type: "1-Bed Apartment",
      amenities: ["Wi-Fi", "Spa"],
    },
    {
      id: 6,
      image: "https://i.ibb.co/8DnZMcWq/apartment1.png",
      title: "Elegant Studio Apartment",
      location: "Victoria Island",
      price: 340,
      type: "1-Bed Apartment",
      amenities: ["Private Pool", "Parking"],
    },
  ];

  // Find the property based on the ID
  const property = properties.find((p) => p.id === Number(id));

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
      <div>
        <Navbar />


    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <header className="flex justify-between items-center py-6 border-b">
        <Link href="/" className="flex items-center">
          <img
            src="https://i.ibb.co/kgb8ngMP/Logo.png"
            alt="TOBI Logo"
            className="w-10 h-10"
          />
        </Link>
        <div className="flex gap-4">
          <button className="text-gray-600 hover:text-black">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button className="text-gray-600 hover:text-black">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </header>

      {/* Property Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Gallery */}
        <div className="lg:w-2/3 space-y-4">
          <img src={property.image} alt={property.title} className="w-full h-96 object-cover rounded-lg"/>
          <div className="grid grid-cols-2 gap-4">
            {Array(4).fill(null).map((_, index) => (
              <button key={`thumbnail-${index}`} className="w-full h-28 bg-gray-200 rounded-lg">
                <img
                  src={`https://via.placeholder.com/200x150?text=Thumbnail+${index + 1}`}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Property Info */}
        <div className="lg:w-1/3 space-y-6">
          <h1 className="text-2xl font-semibold">{property.title}</h1>
          <p className="text-gray-600">{property.location}</p>

          {/* Amenities */}
          <div>
            <h2 className="text-xl font-medium">Key Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity, index) => (
                <span key={index} className="bg-gray-200 px-4 py-2 rounded-full">{amenity}</span>
              ))}
            </div>
          </div>

          {/* Booking Section */}
          <div className="mt-8">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold">${property.price}</span>
              <span className="text-sm text-gray-500">per night</span>
            </div>
            <div className="mt-4">
              <label htmlFor="check-in" className="block text-sm">Check-in:</label>
              <input type="date" id="check-in" className="w-full p-2 border border-gray-300 rounded-md"/>

              <label htmlFor="check-out" className="block mt-4 text-sm">Check-out:</label>
              <input type="date" id="check-out" className="w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <button className="w-full mt-4 py-2 bg-black text-white rounded-md">Book Now</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-gray-500 hover:text-black">FAQs</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-black">Contact</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-black">Privacy Policy</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-black">Terms & Conditions</Link>
          </div>
          <div className="flex gap-4">
            <button className="text-xl text-blue-600"> 𝕏
            </button>
            <button className="text-xl text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#4267b2"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
    </div>
  );
};

export default PropertyDetails;
