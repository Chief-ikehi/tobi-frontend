import { mockProperties } from '../mock/properties';

export interface Property {
  id: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  price: {
    amount: number;
    currency: string;
  };
  images: string[];
  amenities: string[];
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    furnished: true;
  };
  rating: number;
  reviews: number;
  host: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  availability: {
    startDate: string;
    endDate: string;
  };
  investmentDetails?: {
    roi: number;
    occupancyRate: number;
    monthlyIncome: number;
    investmentAmount: number;
  };
  status: 'available' | 'booked' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  rating?: number;
  amenities?: string[];
  investmentOnly?: boolean;
}

export const getProperties = async (filters: PropertyFilters = {}): Promise<Property[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredProperties = [...mockProperties];

  // Apply filters
  if (filters.location) {
    filteredProperties = filteredProperties.filter(property =>
      property.location.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
      property.location.state.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }

  if (filters.minPrice !== undefined) {
    filteredProperties = filteredProperties.filter(property =>
      property.price.amount >= filters.minPrice!
    );
  }

  if (filters.maxPrice !== undefined) {
    filteredProperties = filteredProperties.filter(property =>
      property.price.amount <= filters.maxPrice!
    );
  }

  if (filters.bedrooms !== undefined) {
    filteredProperties = filteredProperties.filter(property =>
      property.features.bedrooms >= filters.bedrooms!
    );
  }

  if (filters.rating !== undefined) {
    filteredProperties = filteredProperties.filter(property =>
      property.rating >= filters.rating!
    );
  }

  if (filters.amenities?.length) {
    filteredProperties = filteredProperties.filter(property =>
      filters.amenities!.every(amenity =>
        property.amenities.includes(amenity)
      )
    );
  }

  if (filters.investmentOnly) {
    filteredProperties = filteredProperties.filter(property =>
      property.investmentDetails !== undefined
    );
  }

  return filteredProperties;
};

export interface SearchParams extends PropertyFilters {
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'rating' | 'date';
  sortOrder?: 'asc' | 'desc';
}

export class PropertyService {
  private properties: Property[] = mockProperties;

  // Get all properties with optional filtering
  async getProperties(params: SearchParams = {}): Promise<{
    properties: Property[];
    total: number;
    page: number;
    limit: number;
  }> {
    let filteredProperties = [...this.properties];

    // Apply filters
    if (params.location) {
      filteredProperties = filteredProperties.filter(property =>
        property.location.city.toLowerCase().includes(params.location!.toLowerCase()) ||
        property.location.state.toLowerCase().includes(params.location!.toLowerCase())
      );
    }

    if (params.minPrice) {
      filteredProperties = filteredProperties.filter(property =>
        property.price.amount >= params.minPrice!
      );
    }

    if (params.maxPrice) {
      filteredProperties = filteredProperties.filter(property =>
        property.price.amount <= params.maxPrice!
      );
    }

    if (params.amenities?.length) {
      filteredProperties = filteredProperties.filter(property =>
        params.amenities!.every(amenity => property.amenities.includes(amenity))
      );
    }

    if (params.bedrooms) {
      filteredProperties = filteredProperties.filter(property =>
        property.features.bedrooms === params.bedrooms
      );
    }

    if (params.rating) {
      filteredProperties = filteredProperties.filter(property =>
        property.rating >= params.rating!
      );
    }

    if (params.investmentOnly) {
      filteredProperties = filteredProperties.filter(property =>
        property.investmentDetails !== undefined
      );
    }

    // Apply sorting
    if (params.sortBy) {
      filteredProperties.sort((a, b) => {
        const order = params.sortOrder === 'desc' ? -1 : 1;
        switch (params.sortBy) {
          case 'price':
            return (a.price.amount - b.price.amount) * order;
          case 'rating':
            return (a.rating - b.rating) * order;
          case 'date':
            return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order;
          default:
            return 0;
        }
      });
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProperties = filteredProperties.slice(start, end);

    return {
      properties: paginatedProperties,
      total: filteredProperties.length,
      page,
      limit
    };
  }

  // Get a single property by ID
  async getPropertyById(id: string): Promise<Property | null> {
    return this.properties.find(property => property.id === id) || null;
  }

  // Get properties by location
  async getPropertiesByLocation(location: string): Promise<Property[]> {
    return this.properties.filter(property =>
      property.location.city.toLowerCase().includes(location.toLowerCase()) ||
      property.location.state.toLowerCase().includes(location.toLowerCase())
    );
  }

  // Get investment properties
  async getInvestmentProperties(): Promise<Property[]> {
    return this.properties.filter(property => property.investmentDetails !== undefined);
  }

  // Get featured properties (mock implementation)
  async getFeaturedProperties(): Promise<Property[]> {
    return this.properties.slice(0, 3); // Return first 3 properties as featured
  }

  // Check property availability
  async checkAvailability(propertyId: string, startDate: string, endDate: string): Promise<boolean> {
    const property = await this.getPropertyById(propertyId);
    if (!property) return false;

    // Mock availability check
    const propertyStart = new Date(property.availability.startDate);
    const propertyEnd = new Date(property.availability.endDate);
    const requestedStart = new Date(startDate);
    const requestedEnd = new Date(endDate);

    return requestedStart >= propertyStart && requestedEnd <= propertyEnd;
  }
}

// Export a singleton instance
export const propertyService = new PropertyService(); 