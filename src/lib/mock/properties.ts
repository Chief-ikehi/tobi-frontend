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

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury One-Bedroom Apartment in Banana Island',
    description: 'Experience unparalleled luxury in this stunning one-bedroom apartment located in the prestigious Banana Island. This property offers breathtaking views of the Lagos Lagoon and features high-end finishes throughout. Perfect for both short stays and long-term investment.',
    location: {
      address: '123 Banana Island Road',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      coordinates: {
        lat: 6.4483,
        lng: 3.4246
      }
    },
    price: {
      amount: 250000,
      currency: 'NGN'
    },
    images: [
      'https://res.cloudinary.com/da2w1sd5v/image/upload/v1741623523/eb4598af-a3e4-450d-a641-06d583e59008_nklrjf.jpg',
      'https://res.cloudinary.com/da2w1sd5v/image/upload/v1741603296/66ff342c-56a6-4456-9e48-0deff52584e7_g4l8gv.jpg',
      'https://res.cloudinary.com/da2w1sd5v/image/upload/v1741603295/1af4ca31-70ce-4a62-b41c-9476469855d8_rs2ez5.jpg'
    ],
    amenities: [
      'WiFi',
      'Air Conditioning',
      'Swimming Pool',
      'Gym',
      'Security',
      'Parking',
      'Elevator',
      'Concierge',
      'Restaurant',
      'Spa'
    ],
    features: {
      bedrooms: 1,
      bathrooms: 2,
      area: 120,
      furnished: true
    },
    rating: 4.9,
    reviews: 156,
    host: {
      id: 'host1',
      name: 'John Doe',
      avatar: '/images/avatars/host1.jpg',
      rating: 4.9
    },
    availability: {
      startDate: '2024-03-15',
      endDate: '2024-12-31'
    },
    investmentDetails: {
      roi: 15.5,
      occupancyRate: 90,
      monthlyIncome: 750000,
      investmentAmount: 45000000
    },
    status: 'available',
    createdAt: '2025-03-01T00:00:00Z',
    updatedAt: '2025-03-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Modern Studio Apartment in Victoria Island',
    description: 'A sleek and modern studio apartment in the heart of Victoria Island. This property combines contemporary design with functionality, offering the perfect space for business travelers and young professionals. Located within walking distance to major offices and entertainment spots.',
    location: {
      address: '456 Adeola Odeku Street',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      coordinates: {
        lat: 6.4283,
        lng: 3.4246
      }
    },
    price: {
      amount: 180000,
      currency: 'NGN'
    },
    images: [
      'https://res.cloudinary.com/da2w1sd5v/image/upload/v1741603297/db7dcff5-2281-4e86-9550-ccabd4ebec04_ienzx1.jpg',
      'https://res.cloudinary.com/da2w1sd5v/image/upload/v1741603297/bab6520f-3712-41bb-94e6-9bade3c71216_a1rmp2.jpg',
      'https://res.cloudinary.com/da2w1sd5v/image/upload/v1741603297/b4eaf715-1fd8-4769-9af9-d7afcb70e50e_g4ctkn.jpg'
    ],
    amenities: [
      'WiFi',
      'Air Conditioning',
      'Kitchen',
      'Security',
      'Parking',
      'Smart TV',
      'Work Desk',
      '24/7 Reception'
    ],
    features: {
      bedrooms: 1,
      bathrooms: 1,
      area: 45,
      furnished: true
    },
    rating: 4.7,
    reviews: 98,
    host: {
      id: 'host2',
      name: 'Jane Smith',
      avatar: '/images/avatars/host2.jpg',
      rating: 4.8
    },
    availability: {
      startDate: '2024-03-20',
      endDate: '2024-12-31'
    },
    investmentDetails: {
      roi: 12.8,
      occupancyRate: 85,
      monthlyIncome: 550000,
      investmentAmount: 35000000
    },
    status: 'available',
    createdAt: '2024-03-02T00:00:00Z',
    updatedAt: '2024-03-02T00:00:00Z'
  },
  {
    id: '3',
    title: 'Cozy Family Apartment in Lekki Phase 1',
    description: 'A spacious and comfortable apartment in the family-friendly Lekki Phase 1. This property offers a perfect blend of comfort and convenience, with easy access to shopping malls, schools, and recreational facilities. Ideal for families and long-term stays.',
    location: {
      address: '789 Admiralty Way',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      coordinates: {
        lat: 6.4683,
        lng: 3.5246
      }
    },
    price: {
      amount: 150000,
      currency: 'NGN'
    },
    images: [
      'https://res.cloudinary.com/da2w1sd5v/image/upload/v1741603296/94db4e1c-eb5e-4ead-8f50-9407eeb0bf9a_a6zdcm.jpg',
      'https://res.cloudinary.com/da2w1sd5v/image/upload/v1741603297/43e6759b-3dab-466e-a544-fb333f10a5dd_ukejr5.jpg',
      'https://res.cloudinary.com/da2w1sd5v/image/upload/v1741603296/675e1026-683b-448f-b176-45a59ed90621_auyute.jpg'
    ],
    amenities: [
      'WiFi',
      'Air Conditioning',
      'Kitchen',
      'Security',
      'Parking',
      'Playground',
      'Swimming Pool',
      'Tennis Court',
      'Supermarket'
    ],
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 85,
      furnished: true
    },
    rating: 4.6,
    reviews: 112,
    host: {
      id: 'host3',
      name: 'Mike Johnson',
      avatar: '/images/avatars/host3.jpg',
      rating: 4.7
    },
    availability: {
      startDate: '2024-03-25',
      endDate: '2024-12-31'
    },
    investmentDetails: {
      roi: 11.5,
      occupancyRate: 80,
      monthlyIncome: 450000,
      investmentAmount: 30000000
    },
    status: 'available',
    createdAt: '2024-03-03T00:00:00Z',
    updatedAt: '2024-03-03T00:00:00Z'
  },
  {
    id: '4',
    title: 'Penthouse Suite in Ikoyi',
    description: 'An exclusive penthouse suite offering panoramic views of Lagos. This luxury property features premium finishes, private terrace, and top-of-the-line amenities. Perfect for those seeking the ultimate in luxury living and investment opportunities.',
    location: {
      address: '321 Banana Island Road',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      coordinates: {
        lat: 6.4583,
        lng: 3.4346
      }
    },
    price: {
      amount: 350000,
      currency: 'NGN'
    },
    images: [
      'https://res.cloudinary.com/da2w1sd5v/image/upload/v1741603296/755d3ba6-a691-4e2a-b599-0bbbfbf037c3_rciju0.jpg',
      'https://res.cloudinary.com/da2w1sd5v/image/upload/v1741603295/53c41b21-5ecb-461a-a30e-e48be582837b_mkkcoi.jpg',
      'https://res.cloudinary.com/da2w1sd5v/image/upload/v1741603296/1875e7e9-20e6-48b2-bcbd-10291df11ee9_mbctw7.jpg'
    ],
    amenities: [
      'WiFi',
      'Air Conditioning',
      'Swimming Pool',
      'Gym',
      'Security',
      'Parking',
      'Private Terrace',
      'Wine Cellar',
      'Home Theater',
      'Helipad'
    ],
    features: {
      bedrooms: 3,
      bathrooms: 4,
      area: 250,
      furnished: true
    },
    rating: 4.9,
    reviews: 45,
    host: {
      id: 'host4',
      name: 'Sarah Williams',
      avatar: '/images/avatars/host4.jpg',
      rating: 4.9
    },
    availability: {
      startDate: '2024-04-01',
      endDate: '2024-12-31'
    },
    investmentDetails: {
      roi: 18.5,
      occupancyRate: 95,
      monthlyIncome: 1200000,
      investmentAmount: 75000000
    },
    status: 'available',
    createdAt: '2024-03-04T00:00:00Z',
    updatedAt: '2024-03-04T00:00:00Z'
  },
  {
    id: '5',
    title: 'Smart Home in Victoria Island',
    description: 'A cutting-edge smart home featuring the latest in home automation technology. This property offers seamless integration of smart devices, energy efficiency, and modern design. Located in the heart of Victoria Island, perfect for tech-savvy professionals.',
    location: {
      address: '567 Ahmadu Bello Way',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      coordinates: {
        lat: 6.4383,
        lng: 3.4146
      }
    },
    price: {
      amount: 200000,
      currency: 'NGN'
    },
    images: [
      'https://res.cloudinary.com/da2w1sd5v/image/upload/v1741603295/15890ab2-0409-4864-aecc-06c01af961d6_pxjaet.jpg',
      'https://res.cloudinary.com/da2w1sd5v/image/upload/v1741603296/534153aa-9f65-4226-849b-6332e337c299_qipo9c.jpg',
      'https://res.cloudinary.com/da2w1sd5v/image/upload/v1741603296/b3a32abe-4c28-421e-b95d-0a312b7b570b_hlkhad.jpg'
    ],
    amenities: [
      'WiFi',
      'Air Conditioning',
      'Smart Home System',
      'Security',
      'Parking',
      'Solar Power',
      'Electric Vehicle Charging',
      'Smart Appliances',
      'Home Office'
    ],
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 95,
      furnished: true
    },
    rating: 4.8,
    reviews: 78,
    host: {
      id: 'host5',
      name: 'David Brown',
      avatar: '/images/avatars/host5.jpg',
      rating: 4.8
    },
    availability: {
      startDate: '2024-03-30',
      endDate: '2024-12-31'
    },
    investmentDetails: {
      roi: 13.5,
      occupancyRate: 88,
      monthlyIncome: 650000,
      investmentAmount: 40000000
    },
    status: 'available',
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z'
  }
]; 