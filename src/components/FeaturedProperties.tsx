"use client";
import React from "react";
import Link  from "next/link"; // Update this to 'next/link' for Next.js routing
import Image from "next/image"; // Use Next.js Image component for optimization
//import PropertyDetails from "@/app/propertyDetails/[id]"

interface Property {
  id: number;
  image: string;
  title: string;
  location: string;
  price: number;
  type: string;
}

const FeaturedProperties: React.FC = () => {
  const properties: Property[] = [
    {
      id: 1,
      image: "https://i.postimg.cc/gkztrPcZ/room10.png",
      title: "Luxury Studio Apartment",
      location: "Ikoyi",
      price: 250,
      type: "1-Bed Apartment",
    },
    {
      id: 2,
      image: "https://i.postimg.cc/jqQksjTT/room11.png",
      title: "Modern Studio Apartment",
      location: "Victoria Island",
      price: 300,
      type: "1-Bed Apartment",
    },
    {
      id: 3,
      image: "https://i.postimg.cc/RVgsHbqb/room8.png",
      title: "Beachfront Studio Apartment",
      location: "Ikoyi",
      price: 350,
      type: "1-Bed Apartment",
    },
    {
      id: 4,
      image: "https://i.postimg.cc/9Qzxtt7X/room9.png",
      title: "Cozy Studio Apartment",
      location: "Victoria Island",
      price: 200,
      type: "1-Bed Apartment",
    },
    {
      id: 5,
      image: "https://i.postimg.cc/rmZvft3k/room7.png",
      title: "Spacious Studio Apartment",
      location: "Ikoyi",
      price: 320,
      type: "1-Bed Apartment",
    },
    {
      id: 6,
      image: "https://i.postimg.cc/sXgkPJnm/room5.png",
      title: "Elegant Studio Apartment",
      location: "Victoria Island",
      price: 340,
      type: "1-Bed Apartment",
    },
  ];

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 py-12 mt-16 mb-16 max-w-7xl mx-auto">
      {properties.map((property) => (
        <div key={property.id} className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:translate-y-2">
          <div className="relative w-full h-56">
            <Image
              src={property.image}
              alt={property.title}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{property.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{property.location}</p>
            <p className="text-sm text-gray-800 mt-1">${property.price}/night</p>
            <p className="text-sm text-gray-600 mt-1">{property.type}</p>
            <Link href={`/propertyDetails/${property.id}`} passHref>
              <button className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500">
                View Details
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProperties;
