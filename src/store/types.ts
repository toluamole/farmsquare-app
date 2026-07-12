import { Product } from '../data/products';
import { Deal } from '../data/deals';

export interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
}

export interface PaymentMethod {
  id: string;
  bank?: string;
  brand?: string;
  last4: string;
  type: 'card' | 'bank';
}

export interface CartItem {
  key: string;
  productId: string;
  p: Product;
  qty: number;
  gb?: boolean;
  deal?: Deal;
}

export interface Order {
  id: string;
  items: { p: Product; qty: number }[];
  total: number;
  step: number;
  date: string;
  ship?: string;
  hasGb?: boolean;
}

export interface Reservation {
  ref: string;
  dealId: string;
  qty: number;
  total: number;
}

export interface UserProfile {
  state: string;
  lga: string;
  crops: string[];
  types: string[];
  size: string;
}

export interface AuthState {
  signedIn: boolean;
  guest: boolean;
  name?: string;
  phone?: string;
  email?: string;
  uid?: string;
  /** Firebase email-verification status; undefined until the first auth sync. */
  emailVerified?: boolean;
}
