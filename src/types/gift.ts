export type GiftStatus = 'PENDING' | 'REDEEMED' | 'EXPIRED' | 'CANCELLED';

export interface Gift {
  id: string;
  recipientEmail: string;
  redemptionCode?: string;
  status: GiftStatus;
  message?: string;
  startDate: string;
  endDate: string;
  property: {
    id: string;
    title: string;
    description: string;
    images: string[];
    address: string;
    city: string;
    state: string;
    amenities: string[];
  };
  sender: {
    id: string;
    fullName: string;
    email: string;
  };
  recipient?: {
    id: string;
    fullName: string;
    email: string;
  };
} 