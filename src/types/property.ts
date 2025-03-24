export type PropertyType = "SHORTLET" | "INVESTMENT" | "BOTH";

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  phone_number: string
  property_type: string;
  cost_price: number;
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
    phone_number: string;
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
  outrightPrice: number; // fixed typo
}