const FS_ZONES: Record<string, string> = {
  'oyo': 'A',
  'edo': 'B', 'ekiti': 'B', 'kwara': 'B', 'lagos': 'B', 'ogun': 'B', 'ondo': 'B', 'osun': 'B',
  'abuja': 'C', 'bayelsa': 'C', 'delta': 'C', 'imo': 'C', 'rivers': 'C',
  'abia': 'D', 'adamawa': 'D', 'akwa ibom': 'D', 'anambra': 'D', 'bauchi': 'D', 'benue': 'D',
  'borno': 'D', 'cross river': 'D', 'ebonyi': 'D', 'enugu': 'D', 'gombe': 'D', 'jigawa': 'D',
  'kaduna': 'D', 'kano': 'D', 'katsina': 'D', 'kebbi': 'D', 'kogi': 'D', 'nasarawa': 'D',
  'niger': 'D', 'plateau': 'D', 'sokoto': 'D', 'taraba': 'D', 'yobe': 'D', 'zamfara': 'D',
};

export interface ShippingMethod {
  id: string;
  name: string;
  desc: string;
  instance: number;
  cost?: number;
}

const FS_METHODS_BY_ZONE: Record<string, ShippingMethod[]> = {
  'A': [
    { id: 'courier', name: 'Courier Delivery', desc: 'Door-to-door, 2–4 days', instance: 31 },
    { id: 'cargo', name: 'Cargo Delivery', desc: 'Bulky/heavy goods, 5–8 days', instance: 32 },
    { id: 'commercial', name: 'Commercial Delivery', desc: 'Budget courier, 4–7 days', instance: 33 },
    { id: 'pickup', name: 'Office Pickup', desc: 'Collect from Farmsquare, Ibadan', instance: 35, cost: 0 },
  ],
  'B': [
    { id: 'courier', name: 'Courier Delivery', desc: 'Door-to-door, 2–4 days', instance: 36 },
    { id: 'cargo', name: 'Cargo Delivery', desc: 'Bulky/heavy goods, 5–8 days', instance: 37 },
    { id: 'commercial', name: 'Commercial Delivery', desc: 'Budget courier, 4–7 days', instance: 38 },
    { id: 'pickup', name: 'Office Pickup', desc: 'Collect from Farmsquare, Ibadan', instance: 40, cost: 0 },
  ],
  'C': [
    { id: 'courier', name: 'Courier Delivery', desc: 'Door-to-door, 2–4 days', instance: 41 },
    { id: 'cargo', name: 'Cargo Delivery', desc: 'Bulky/heavy goods, 5–8 days', instance: 42 },
    { id: 'commercial', name: 'Commercial Delivery', desc: 'Budget courier, 4–7 days', instance: 43 },
    { id: 'pickup', name: 'Office Pickup', desc: 'Collect from Farmsquare, Ibadan', instance: 45, cost: 0 },
  ],
  'D': [
    { id: 'courier', name: 'Courier Delivery', desc: 'Door-to-door, 2–4 days', instance: 46 },
    { id: 'cargo', name: 'Cargo Delivery', desc: 'Bulky/heavy goods, 5–8 days', instance: 47 },
    { id: 'commercial', name: 'Commercial Delivery', desc: 'Budget courier, 4–7 days', instance: 48 },
    { id: 'pickup', name: 'Office Pickup', desc: 'Collect from Farmsquare, Ibadan', instance: 50, cost: 0 },
  ],
};

const FS_RATES: Record<string, Record<string, Record<number, number[] | number>>> = {
  'courier': {
    'A': { 378: [2000, 30], 381: [2000, 30], 598: [2000, 3], 600: [6000, 1], 601: 0.15, 2107: [3500, 2] },
    'B': { 378: [6000, 30], 381: [6000, 100], 598: [6000, 3], 600: [15000, 1], 601: 0.15, 603: [8000, 1], 2107: [7000, 2] },
    'C': { 378: [7000, 30], 381: [7000, 100], 598: [7000, 3], 600: [20000, 1], 601: 0.19, 603: [9000, 1], 2107: [8000, 2] },
    'D': { 378: [8500, 30], 381: [8500, 100], 598: [8500, 3], 600: [20000, 1], 601: 0.19, 603: [10000, 1], 2107: [10000, 2] },
  },
  'cargo': {
    'A': { 600: [2000, 1], 601: 0.15, 603: [2500, 1], 613: [70, 1], 380: [3000, 10], 598: [2000, 5], 2107: [2000, 5] },
    'B': { 600: [5000, 1], 601: 0.15, 603: [5000, 1], 613: [70, 1], 380: [15000, 10], 598: [5000, 5], 2107: [6000, 5] },
    'C': { 600: [7000, 1], 601: 0.15, 603: [7000, 1], 613: [75, 1], 380: [18000, 10], 598: [7500, 10], 2107: [7000, 2] },
    'D': { 600: [9000, 1], 601: 0.19, 603: [9000, 1], 613: [80, 1], 380: [20000, 10], 598: [9000, 3], 2107: [10000, 5] },
  },
  'commercial': {
    'A': { 378: [1500, 30], 381: [1500, 100], 598: [1500, 5], 600: [2000, 1], 601: 0.05, 603: [2000, 1], 613: [45, 1], 380: [2500, 10], 2107: [1500, 10] },
    'B': { 378: [3000, 30], 381: [3000, 100], 598: [3000, 3], 600: [4000, 1], 601: 0.12, 603: [4000, 1], 613: [60, 1], 380: [6000, 10], 2107: [4000, 2] },
    'C': { 378: [4500, 30], 381: [5000, 100], 598: [5000, 5], 600: [5500, 1], 601: 0.17, 603: [5500, 1], 613: [80, 1], 380: [18000, 10], 2107: [6500, 5] },
    'D': { 378: [7000, 30], 381: [7000, 100], 598: [7000, 3], 600: [7000, 1], 601: 0.18, 603: [7000, 1], 613: [80, 1], 380: [20000, 10], 2107: [7000, 2] },
  },
};

export const FS_PRODUCT_CLASSES: Record<string, number> = {
  'p1': 378, 'p2': 600, 'p3': 600, 'p4': 598, 'p5': 598,
  'p6': 603, 'p7': 603, 'p8': 2107, 'p9': 378, 'p10': 601,
  'p11': 600, 'p12': 375,
};

export function fsResolveZone(state: string): string | null {
  return FS_ZONES[state.toLowerCase()] || null;
}

export interface CartItemForShipping {
  id: string;
  qty: number;
  price: number;
  classId?: number;
}

export function fsCalculateShipping(
  items: CartItemForShipping[],
  zone: string,
  methodId: string,
): { success: boolean; cost?: number; error?: string } {
  const methodRates = FS_RATES[methodId] ? FS_RATES[methodId][zone] : null;
  if (!methodRates) return { success: false, error: 'No rates for this method/zone' };

  let total = 0;
  items.forEach(item => {
    const classId = item.classId || FS_PRODUCT_CLASSES[item.id] || 381;
    const rule = methodRates[classId];
    if (!rule) return;

    if (typeof rule === 'number' && rule > 0 && rule < 1) {
      total += item.price * item.qty * rule;
    } else if (Array.isArray(rule)) {
      const [cost, perBlock] = rule;
      const blocks = Math.ceil(item.qty / perBlock);
      total += blocks * cost;
    }
  });

  return { success: true, cost: Math.round(total) };
}

export function fsGetShippingMethods(zone: string): ShippingMethod[] {
  return FS_METHODS_BY_ZONE[zone] || [];
}
