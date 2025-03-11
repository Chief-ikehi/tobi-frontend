export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'investor' | 'agent' | 'admin';
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  preferences?: {
    notifications: boolean;
    emailUpdates: boolean;
    currency: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Customer extends User {
  role: 'customer';
  bookings: string[]; // Array of booking IDs
  favorites: string[]; // Array of property IDs
  reviews: string[]; // Array of review IDs
}

export interface Investor extends User {
  role: 'investor';
  investments: string[]; // Array of investment IDs
  portfolio: {
    totalInvested: number;
    currentValue: number;
    roi: number;
  };
  documents: string[]; // Array of document IDs
}

export interface Agent extends User {
  role: 'agent';
  properties: string[]; // Array of property IDs
  clients: string[]; // Array of client IDs
  performance: {
    viewings: number;
    bookings: number;
    conversionRate: number;
  };
}

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/images/avatars/user1.jpg',
    role: 'customer',
    phone: '+2348012345678',
    preferences: {
      notifications: true,
      emailUpdates: true,
      currency: 'NGN'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: '/images/avatars/user2.jpg',
    role: 'investor',
    phone: '+2348012345679',
    preferences: {
      notifications: true,
      emailUpdates: true,
      currency: 'NGN'
    },
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 'user3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: '/images/avatars/user3.jpg',
    role: 'agent',
    phone: '+2348012345680',
    preferences: {
      notifications: true,
      emailUpdates: true,
      currency: 'NGN'
    },
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  }
]; 