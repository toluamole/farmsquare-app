export interface Product {
  id: string;
  cat: string;
  name: string;
  price: number;
  was?: number;
  img?: string | null;
  imgLabel: string;
  rating: number;
  reviews: number;
  stock: 'in' | 'low' | 'out';
  sku: string;
  deal?: string;
  desc: string;
  specs: [string, string][];
  related?: string[];
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  /** Numeric WooCommerce term id — required for server-side `category` filtering. */
  wcId: number;
  /** Product count in this category (used to rank rails on the home screen). */
  count: number;
}

// The catalog is live (WooCommerce). Related/recommended product lookups by id
// need a backend, so this resolver returns undefined until one is wired up.
export function fsProduct(_id: string): Product | undefined {
  return undefined;
}

// Static reference data (not mock content) used by onboarding/profile screens.
export const FS_CROPS: [string, string][] = [
  ['tomato', 'Tomato'], ['maize', 'Maize'], ['pepper', 'Pepper'], ['sesame', 'Sesame'],
  ['cucumber', 'Cucumber'], ['cassava', 'Cassava'], ['yam', 'Yam'], ['rice', 'Rice'],
  ['soybean', 'Soybean'], ['groundnut', 'Groundnut'], ['watermelon', 'Watermelon'],
  ['onion', 'Onion'], ['cabbage', 'Cabbage'],
];

export const FS_STATES = ['Lagos', 'Ogun', 'Oyo', 'Kano', 'Kaduna', 'Katsina', 'Rivers', 'Enugu', 'Plateau', 'Benue', 'Niger', 'FCT Abuja'];
export const FS_LGAS: Record<string, string[]> = {
  Lagos: ['Ikeja', 'Alimosho', 'Epe', 'Ikorodu', 'Badagry', 'Eti-Osa'],
  Kano: ['Nassarawa', 'Fagge', 'Dala', 'Gwale'],
  Ogun: ['Abeokuta South', 'Ijebu Ode', 'Sagamu'],
};
