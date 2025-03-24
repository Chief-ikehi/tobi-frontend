"use client";

import { Property } from "@/types/property";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const type = property.property_type?.toUpperCase();

  const badgeColor =
    type === "SHORTLET"
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      : type === "INVESTMENT"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";

  const typeLabel =
    type === "SHORTLET"
      ? "Shortlet"
      : type === "INVESTMENT"
      ? "Investment"
      : type === "BOTH"
      ? "Shortlet & Investment"
      : "Unknown";

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const checkFavorite = async () => {
      try {
        const res = await axios.get(`/favorites/${property.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFavorite(res.data?.is_favorite ?? false);
      } catch {
        console.warn("Could not check favorite status");
      }
    };

    checkFavorite();
  }, [property.id]);

  const handleFavoriteClick = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return toast.error("Login required");

    try {
      if (isFavorite) {
        await axios.delete(`/favorites/${property.id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Removed from favorites");
        setIsFavorite(false);
      } else {
        await axios.post(
          `/favorites/`,
          { property: property.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Added to favorites");
        setIsFavorite(true);
      }
    } catch {
      toast.error("Error updating favorite");
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-solid-8 dark:bg-blacksection">
      {/* Property Type Badge */}
      <div className="absolute left-4 top-4 z-10">
        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${badgeColor}`}>
          {typeLabel}
        </span>
      </div>

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-body-color transition-all hover:bg-primary hover:text-white dark:bg-dark-2/70 dark:hover:bg-primary"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <svg
          className={`h-5 w-5 transition-colors ${isFavorite ? "text-red-500 fill-current" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
              2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
              C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
              c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isFavorite ? "fill-current" : ""}
          />
        </svg>
      </button>

      {/* Property Image */}
      <Link href={`/properties/${property.id}`} className="relative block h-[240px] w-full">
        <Image
          src={property.images[0]}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          fill
        />
      </Link>

      {/* Property Details */}
      <div className="p-4">
        <Link href={`/properties/${property.id}`}>
          <h3 className="mb-2 text-xl font-medium text-black hover:text-primary dark:text-white dark:hover:text-primary">
            {property.title}
          </h3>
        </Link>
        <p className="mb-4 text-base font-medium text-body-color">{property.location}</p>

        <div className="mb-5 flex items-center justify-between">
          <div>
            <span className="text-xl font-medium text-black dark:text-white">
              {formatCurrency(property.price)}
            </span>
            {type === "SHORTLET" && <span className="text-sm text-body-color"> /night</span>}
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-stroke pt-4 dark:border-strokedark">
          <span className="text-sm text-body-color">{property.bedrooms} Beds</span>
          <span className="text-sm text-body-color">{property.bathrooms} Baths</span>
          <span className="text-sm text-body-color">{property.squareFeet} sqft</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;