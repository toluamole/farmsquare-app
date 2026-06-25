import axios, { AxiosInstance } from 'axios';
import { FS_PRODUCTS, FS_CATEGORIES, Product, Category } from '../data/products';

const WC_URL = process.env.EXPO_PUBLIC_WC_URL || 'https://farmsquare.ng';
const WC_KEY = process.env.EXPO_PUBLIC_WC_KEY || '';
const WC_SECRET = process.env.EXPO_PUBLIC_WC_SECRET || '';

let _client: AxiosInstance | null = null;

function getClient(): AxiosInstance {
  if (!_client) {
    _client = axios.create({
      baseURL: `${WC_URL}/wp-json/wc/v3`,
      auth: WC_KEY && WC_SECRET ? {
        username: WC_KEY,
        password: WC_SECRET,
      } : undefined,
      timeout: 10000,
    });
  }
  return _client;
}

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  categories: { id: number; name: string; slug: string }[];
  images: { src: string; alt: string }[];
  attributes: { name: string; options: string[] }[];
  average_rating: string;
  rating_count: number;
}

export interface WCOrder {
  id?: number;
  status?: string;
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    state: string;
    country: string;
  };
  line_items: { product_id: number; quantity: number }[];
  shipping_lines?: { method_id: string; method_title: string; total: string }[];
  payment_method?: string;
  payment_method_title?: string;
}

async function tryApi<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!WC_KEY || !WC_SECRET) return fallback;
  try {
    return await fn();
  } catch (error) {
    console.warn('WooCommerce API unavailable, using mock data', error);
    return fallback;
  }
}

export async function getProducts(params?: Record<string, string | number>): Promise<Product[]> {
  return tryApi(async () => {
    const client = getClient();
    const response = await client.get<WCProduct[]>('/products', { params: { per_page: 50, ...params } });
    // Map WC products to our format
    return response.data.map(p => ({
      id: String(p.id),
      cat: p.categories[0]?.slug || 'seeds',
      name: p.name,
      price: Math.round(parseFloat(p.price) || 0),
      was: p.regular_price !== p.sale_price ? Math.round(parseFloat(p.regular_price) || 0) : undefined,
      img: p.images[0]?.src || null,
      imgLabel: p.images[0]?.alt || p.name,
      rating: parseFloat(p.average_rating) || 4.5,
      reviews: p.rating_count || 0,
      stock: p.stock_status === 'instock' ? 'in' : p.stock_status === 'outofstock' ? 'out' : 'low',
      sku: p.slug,
      desc: p.short_description || p.description,
      specs: p.attributes.map(a => [a.name, a.options.join(', ')] as [string, string]),
      related: [],
    } as Product));
  }, FS_PRODUCTS);
}

export async function getProduct(id: string): Promise<Product | undefined> {
  // Try local first for mock IDs
  const local = FS_PRODUCTS.find(p => p.id === id);
  if (!WC_KEY || !WC_SECRET) return local;

  return tryApi(async () => {
    const client = getClient();
    const response = await client.get<WCProduct>(`/products/${id}`);
    const p = response.data;
    return {
      id: String(p.id),
      cat: p.categories[0]?.slug || 'seeds',
      name: p.name,
      price: Math.round(parseFloat(p.price) || 0),
      was: p.regular_price !== p.sale_price ? Math.round(parseFloat(p.regular_price) || 0) : undefined,
      img: p.images[0]?.src || null,
      imgLabel: p.images[0]?.alt || p.name,
      rating: parseFloat(p.average_rating) || 4.5,
      reviews: p.rating_count || 0,
      stock: p.stock_status === 'instock' ? 'in' : p.stock_status === 'outofstock' ? 'out' : 'low',
      sku: p.slug,
      desc: p.short_description || p.description,
      specs: p.attributes.map(a => [a.name, a.options.join(', ')] as [string, string]),
      related: [],
    } as Product;
  }, local);
}

export async function getCategories(): Promise<Category[]> {
  return tryApi(async () => {
    const client = getClient();
    const response = await client.get<{ id: number; name: string; slug: string }[]>('/products/categories', {
      params: { per_page: 100, hide_empty: true },
    });
    return response.data.map(c => ({ id: c.slug, label: c.name, icon: c.slug }));
  }, FS_CATEGORIES);
}

export async function createOrder(order: WCOrder): Promise<{ id: string; status: string }> {
  return tryApi(async () => {
    const client = getClient();
    const response = await client.post<{ id: number; status: string }>('/orders', order);
    return { id: `FS-${String(response.data.id).padStart(5, '0')}`, status: response.data.status };
  }, { id: `FS-${Math.floor(20000 + Math.random() * 9999)}`, status: 'pending' });
}

/**
 * Mark an existing order as paid (used after a successful Paystack charge).
 * NOTE (MVP): payment is confirmed client-side. A hardened version should
 * verify the transaction via Paystack's verify API from a backend before this.
 */
export async function markOrderPaid(
  id: string,
  opts: { transactionRef?: string; status?: string } = {},
): Promise<{ id: string; status: string }> {
  const status = opts.status || 'processing';
  return tryApi(async () => {
    const client = getClient();
    const numericId = String(parseInt(id.replace('FS-', ''), 10));
    const response = await client.put<{ id: number; status: string }>(`/orders/${numericId}`, {
      set_paid: true,
      status,
      ...(opts.transactionRef
        ? {
            transaction_id: opts.transactionRef,
            meta_data: [{ key: '_paystack_reference', value: opts.transactionRef }],
          }
        : {}),
    });
    return { id, status: response.data.status };
  }, { id, status });
}

export async function getOrder(id: string): Promise<WCOrder & { id: string; status: string } | null> {
  return tryApi(async () => {
    const client = getClient();
    const numericId = id.replace('FS-', '');
    const response = await client.get<WCOrder & { id: number; status: string }>(`/orders/${numericId}`);
    return { ...response.data, id } as WCOrder & { id: string; status: string };
  }, null);
}
