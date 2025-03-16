"use client";

import { Property } from "@/types/property";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";
import { useState } from "react";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = async () => {
    try {
      // TODO: Implement API call to toggle favorite status
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-solid-8 dark:bg-blacksection">
      {/* Property Type Badge */}
      <div className="absolute left-4 top-4 z-10">
        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium 
          ${property.type === "SHORTLET" 
            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            : property.type === "INVESTMENT"
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
          }`}
        >
          {property.type === "BOTH" ? "Shortlet & Investment" : property.type.toLowerCase()}
        </span>
      </div>

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-body-color transition-all hover:bg-primary hover:text-white dark:bg-dark-2/70 dark:hover:bg-primary"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <svg
          className={`h-5 w-5 transition-colors ${isFavorite ? 'text-red-500 fill-current' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isFavorite ? 'fill-current' : ''}
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

        <p className="mb-4 text-base font-medium text-body-color">
          {property.location}
        </p>

        <div className="mb-5 flex items-center justify-between">
          <div>
            <span className="text-xl font-medium text-black dark:text-white">
              {formatCurrency(property.price)}
            </span>
            {property.type === "SHORTLET" && (
              <span className="text-sm text-body-color">/night</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-[#F7F8FA] text-body-color transition-all hover:bg-primary hover:text-white dark:bg-dark-2 dark:hover:bg-primary"
              aria-label="Add to wishlist"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.05 4.06249C12.7937 3.36077 12.3996 2.72143 11.8934 2.18685C11.3871 1.65127 10.7789 1.22686 10.1125 0.937489C9.42853 0.636659 8.69388 0.481972 7.95 0.481972C7.20612 0.481972 6.47147 0.636659 5.7875 0.937489C5.12111 1.22686 4.51291 1.65127 4.00664 2.18685C3.50037 2.72143 3.10631 3.36077 2.85 4.06249C2.58206 4.78763 2.44721 5.55789 2.45 6.33436C2.45 7.79061 2.9 9.16873 3.7625 10.4312C4.625 11.6937 5.85 12.8406 7.4125 13.8531C7.57392 13.9646 7.75941 14.0243 7.95 14.0243C8.14059 14.0243 8.32608 13.9646 8.4875 13.8531C10.05 12.8406 11.275 11.6937 12.1375 10.4312C13 9.16873 13.45 7.79061 13.45 6.33436C13.4528 5.55789 13.3179 4.78763 13.05 4.06249ZM7.95 12.8499C6.575 11.9374 3.7 9.49998 3.7 6.33436C3.7 5.21561 4.1375 4.16873 4.9125 3.39686C5.6875 2.62498 6.775 2.18748 7.95 2.18748C9.125 2.18748 10.2125 2.62498 10.9875 3.39686C11.7625 4.16873 12.2 5.21561 12.2 6.33436C12.2 9.49998 9.325 11.9374 7.95 12.8499Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-stroke pt-4 dark:border-strokedark">
          <div className="flex items-center gap-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.5 13H1.5C1.23478 13 0.98043 12.8946 0.792893 12.7071C0.605357 12.5196 0.5 12.2652 0.5 12V4C0.5 3.73478 0.605357 3.48043 0.792893 3.29289C0.98043 3.10536 1.23478 3 1.5 3H14.5C14.7652 3 15.0196 3.10536 15.2071 3.29289C15.3946 3.48043 15.5 3.73478 15.5 4V12C15.5 12.2652 15.3946 12.5196 15.2071 12.7071C15.0196 12.8946 14.7652 13 14.5 13ZM1.5 4V12H14.5V4H1.5Z"
                fill="currentColor"
              />
              <path
                d="M8 9C7.60218 9 7.22064 8.84196 6.93934 8.56066C6.65804 8.27936 6.5 7.89782 6.5 7.5C6.5 7.10218 6.65804 6.72064 6.93934 6.43934C7.22064 6.15804 7.60218 6 8 6C8.39782 6 8.77936 6.15804 9.06066 6.43934C9.34196 6.72064 9.5 7.10218 9.5 7.5C9.5 7.89782 9.34196 8.27936 9.06066 8.56066C8.77936 8.84196 8.39782 9 8 9Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-sm font-medium text-body-color">
              {property.bedrooms} Beds
            </span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 8C13.9999 7.61556 13.8829 7.23929 13.6621 6.91309C13.4414 6.58689 13.1256 6.32568 12.75 6.15999V3.99999C12.75 3.27065 12.4603 2.57118 11.9445 2.05546C11.4288 1.53973 10.7293 1.24999 10 1.24999H6C5.27065 1.24999 4.57118 1.53973 4.05546 2.05546C3.53973 2.57118 3.24999 3.27065 3.24999 3.99999V6.15999C2.87434 6.32568 2.55863 6.58689 2.33785 6.91309C2.11706 7.23929 2.00007 7.61556 2 8V11C2.00006 11.1989 2.07906 11.3896 2.21964 11.5303C2.36022 11.6709 2.55093 11.7499 2.74999 11.75H3.24999V12.5C3.25005 12.6989 3.32905 12.8896 3.46963 13.0303C3.61021 13.1709 3.80092 13.2499 3.99999 13.25H5C5.19906 13.2499 5.38977 13.1709 5.53035 13.0303C5.67093 12.8896 5.74993 12.6989 5.74999 12.5V11.75H10.25V12.5C10.2501 12.6989 10.3291 12.8896 10.4696 13.0303C10.6102 13.1709 10.8009 13.2499 11 13.25H12C12.1991 13.2499 12.3898 13.1709 12.5303 13.0303C12.6709 12.8896 12.7499 12.6989 12.75 12.5V11.75H13.25C13.4491 11.7499 13.6398 11.6709 13.7804 11.5303C13.9209 11.3896 13.9999 11.1989 14 11V8ZM4.74999 3.99999C4.74999 3.66847 4.8817 3.35053 5.11612 3.11611C5.35054 2.88169 5.66847 2.74999 6 2.74999H10C10.3315 2.74999 10.6495 2.88169 10.8839 3.11611C11.1183 3.35053 11.25 3.66847 11.25 3.99999V5.75999C10.8519 5.58225 10.4205 5.49587 9.98499 5.49999H6.01499C5.57952 5.49587 5.14806 5.58225 4.74999 5.75999V3.99999ZM4.24999 12.5H3.74999V11.75H4.24999V12.5ZM11.25 12.5H10.75V11.75H11.25V12.5ZM12.5 10.25H3.49999V8C3.50002 7.66859 3.63166 7.35074 3.86594 7.11631C4.10022 6.88187 4.41799 6.75001 4.74999 6.74999H11.25C11.582 6.75001 11.8997 6.88187 12.134 7.11631C12.3683 7.35074 12.5 7.66859 12.5 8V10.25Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-sm font-medium text-body-color">
              {property.bathrooms} Baths
            </span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.25 2.75H11.25V1.75C11.25 1.55109 11.171 1.36032 11.0303 1.21967C10.8897 1.07902 10.6989 1 10.5 1H5.5C5.30109 1 5.11032 1.07902 4.96967 1.21967C4.82902 1.36032 4.75 1.55109 4.75 1.75V2.75H2.75C2.35218 2.75 1.97064 2.90804 1.68934 3.18934C1.40804 3.47064 1.25 3.85218 1.25 4.25V13.25C1.25 13.6478 1.40804 14.0294 1.68934 14.3107C1.97064 14.592 2.35218 14.75 2.75 14.75H13.25C13.6478 14.75 14.0294 14.592 14.3107 14.3107C14.592 14.0294 14.75 13.6478 14.75 13.25V4.25C14.75 3.85218 14.592 3.47064 14.3107 3.18934C14.0294 2.90804 13.6478 2.75 13.25 2.75ZM6.25 2.5H9.75V2.75H6.25V2.5ZM13.25 13.25H2.75V7.75H13.25V13.25ZM13.25 6.25H2.75V4.25H13.25V6.25Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-sm font-medium text-body-color">
              {property.squareFeet} sqft
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard; 