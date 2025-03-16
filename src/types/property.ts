export type PropertyType = "ALL" | "SHORTLET" | "INVESTMENT" | "BOTH";

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  type: PropertyType;
  amenities: string[];
  images: string[];
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  maxGuests?: number;
  availableDates?: Array<{
    start: string;
    end: string;
  }>;
  agent: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentProperty extends Property {
  roi: number;
  managementFee: number;
  monthlyIncome: number;
  occupancyRate: number;
  propertyValue: number;
  installmentPrice: number;
  outrighPrice: number;
} 