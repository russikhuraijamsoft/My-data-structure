export type CustomerTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';
export type PromoType = 'PERCENTAGE' | 'FIXED' | 'BOGO' | 'FREE_ITEM';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob?: string;
  loyaltyPoints: number;
  tier: CustomerTier;
  status: CustomerStatus;
  totalVisits: number;
  totalSpent: number;
  lastVisit?: string;
  addresses?: { city?: string; state?: string }[];
  createdAt: string;
}

export interface Promotion {
  id: string;
  code: string;
  name: string;
  description: string;
  type: PromoType;
  value: number;
  minOrderValue?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  timesUsed: number;
}
