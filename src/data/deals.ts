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

// t0 is the reference time set when the app starts
export const FS_DEALS: Deal[] = [
  {
    id: 'd1', status: 'active',
    title: 'NPK 15-15-15 Fertilizer — 50kg Truck-load Deal',
    product: 'p2', short: 'NPK 15-15-15 — 50kg bag',
    price: 22500, retail: 28000, unit: 'bag', total: 600, reserved: 420, farmers: 86, min: 5, max: 50,
    closeOffset: (2 * 24 + 14) * 3600e3, closeLabel: 'June 30, 11:59 PM',
    imgLabel: 'NPK 50kg bags stacked on truck', img: null,
    deliveryWindow: '7–10 days after close',
    states: 'Lagos, Ogun, Oyo, Kano, Kaduna + 12 more states',
    details: 'Balanced NPK 15-15-15 granular fertilizer for vegetative growth across maize, tomato, pepper and rice. NAFDAC-certified, factory-sealed 50kg bags direct from the blending plant.',
  },
  {
    id: 'd2', status: 'active',
    title: 'Urea 46% — Half-truck Deal',
    product: 'p3', short: 'Urea 46% — 50kg bag',
    price: 19800, retail: 24500, unit: 'bag', total: 300, reserved: 95, farmers: 27, min: 5, max: 40,
    closeOffset: (6 * 24 + 8) * 3600e3, closeLabel: 'July 4, 11:59 PM',
    imgLabel: 'Urea 50kg bags', img: null,
    deliveryWindow: '7–10 days after close',
    states: 'Kano, Kaduna, Katsina, Bauchi + 8 more states',
    details: 'High-nitrogen urea (46%) for top dressing of maize and rice. Factory-sealed 50kg bags.',
  },
  {
    id: 'd3', status: 'upcoming',
    title: 'SC419 Hybrid Maize Seed — Pallet Deal',
    product: 'p8', short: 'SC419 Maize — 2kg pack',
    price: 6400, retail: 7800, unit: 'pack', total: 800, reserved: 0, farmers: 0, min: 2, max: 60,
    openOffset: (4 * 24) * 3600e3, closeLabel: 'opens June 14',
    imgLabel: 'maize seed packs', img: null,
    deliveryWindow: '5–7 days after close',
    states: 'Nationwide',
    details: 'Drought-tolerant early-maturing hybrid maize seed at wholesale pallet pricing.',
  },
  {
    id: 'd4', status: 'closed',
    title: 'Knapsack Sprayer 16L — Container Deal',
    product: 'p7', short: 'CP3 Sprayer — 16L',
    price: 14500, retail: 18000, unit: 'unit', total: 400, reserved: 400, farmers: 142, min: 1, max: 10,
    closedLabel: 'Closed June 2 · dispatched',
    imgLabel: 'knapsack sprayers', img: null,
    deliveryWindow: 'Delivered',
    states: 'Nationwide',
    details: '',
  },
];
