export enum PropertyType {
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
  CONDO = 'CONDO',
  TOWNHOUSE = 'TOWNHOUSE',
  LAND = 'LAND',
  COMMERCIAL = 'COMMERCIAL'
}

export enum ListingType {
  SALE = 'SALE',
  RENT = 'RENT',
  INVESTMENT = 'INVESTMENT'
}

export enum SafetyRating {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  AVERAGE = 'AVERAGE',
  FAIR = 'FAIR',
  POOR = 'POOR'
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  propertyType: PropertyType;
  listingType: ListingType;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  amenities: string[];
  images: string[];
  isFeatured: boolean;
  isAvailable: boolean;
  latitude?: number;
  longitude?: number;
  safetyRating: SafetyRating;
  virtualTourUrl?: string;
  nearbyAttractions: string[];
  expectedRoi?: number;
  occupancyRate?: number;
  propertyDocuments?: string[];
  monthlyExpenses?: number;
  monthlyRevenue?: number;
  viewCount: number;
  yearBuilt?: number;
  createdAt: string;
  owner: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType;
  listingType?: ListingType;
  city?: string;
  state?: string;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minSquareFootage?: number;
  maxSquareFootage?: number;
  isFeatured?: boolean;
  isAvailable?: boolean;
  safetyRating?: SafetyRating;
  minExpectedRoi?: number;
  minOccupancyRate?: number;
  nearbyAttractions?: string[];
  maxMonthlyExpenses?: number;
  minMonthlyRevenue?: number;
  searchTerm?: string;
  amenities?: string[];
} 