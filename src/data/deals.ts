export interface Deal {
  id: string;
  status: 'active' | 'upcoming' | 'closed';
  title: string;
  product: string;
  short: string;
  price: number;
  retail: number;
  unit: string;
  total: number;
  reserved: number;
  farmers: number;
  min: number;
  max: number;
  closeOffset?: number;
  closeLabel?: string;
  openOffset?: number;
  closedLabel?: string;
  imgLabel: string;
  img: string | null;
  deliveryWindow: string;
  states: string;
  details: string;
}

// Deals are served live via src/services/groupbuy.ts (no local mock data).
// `t0` (set when the app starts) is used with a deal's offsets for countdowns.
