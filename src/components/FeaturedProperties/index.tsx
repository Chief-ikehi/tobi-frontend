"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

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
      <section className="pb-10 lg:pb-25 xl:pb-5">
      <div className="mx-auto mt-15 max-w-c-1280 px-4 md:px-8 xl:mt-20 xl:px-0">
        <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:grid-cols-3 xl:gap-10">
          {properties.map((property) => (
            <motion.div
              key={property.id}
              variants={{
                hidden: {
                  opacity: 0,
                  y: -20,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
              className="animate_top rounded-lg bg-white p-4 pb-9 shadow-solid-8 dark:bg-blacksection"
            >
            <div className= "transform transition-transform duration-300 hover:translate-y-2">
              <Link href={`/propertyDetails/${property.id}`} className="relative block aspect-[368/239]">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="rounded-t-lg object-cover"
                />
              </Link>

              <div className="px-4">
                <Link href={`/propertyDetails/${property.id}`}>
                <h3 className="mb-3.5 mt-7.5 line-clamp-2 text-lg font-small text-black duration-300 dark:text-white xl:text-itemtitle2">
                  {property.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">{property.location}</p>
                <p className="text-sm text-gray-600 mt-2">${property.price}/night</p>
                {/* <p className="text-sm text-gray-500 mt-2">{property.type}</p> */}
                  <button className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-blue-700 duration-300 ease-in-out dark:hover:bg-black dark:bg-btndark">
                    View Details
                  </button>
                </Link>
              </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </section>
  );
};

export default FeaturedProperties;
