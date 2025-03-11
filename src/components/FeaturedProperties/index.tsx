"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FavoriteButton } from '@/components/properties/FavoriteButton';
import { getProperties, type Property } from "@/lib/services/propertyService";

const FeaturedProperties: React.FC = () => {
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProperties = async () => {
      
        const data = await getProperties();
        // Take only the first 6 properties for featured section
        setProperties(data.slice(0, 6));
        setLoading(false);
      
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-[400px]">{error}</div>;
  }

  return (
    <section className="pb-10 lg:pb-25 xl:pb-5">
      <div className="mx-auto mt-15 max-w-c-1280 px-4 md:px-8 xl:mt-20 xl:px-0">
        <h2 className="mb-10 text-center text-3xl font-bold">Featured Properties</h2>
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
              <div className="relative transform transition-transform duration-300 hover:translate-y-2">
                <div className="relative">
                  <Link href={`/properties/${property.id}`}>
                    <div className="relative aspect-[368/239]">
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="rounded-t-lg object-cover"
                      />
                    </div>
                  </Link>
                  <div className="absolute top-4 right-4 z-10">
                    <FavoriteButton propertyId={property.id} />
                  </div>
                </div>

                <div className="px-4">
                  <Link href={`/properties/${property.id}`}>
                    <h3 className="mb-3.5 mt-7.5 line-clamp-2 text-lg font-semibold text-black duration-300 hover:text-primary dark:text-white xl:text-itemtitle2">
                      {property.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mt-2">{property.location.city}</p>
                  <p className="text-sm text-gray-600 mt-2">₦{property.price.amount}/night</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {property.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="bg-gray-100 text-sm font-medium rounded-full py-1 px-3 text-gray-600 dark:bg-btndark">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <Link href={`/properties/${property.id}`}>
                    <button className="mt-6 w-full bg-black text-white py-2 rounded-md hover:bg-primary duration-300 ease-in-out dark:hover:bg-primary dark:bg-btndark">
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
