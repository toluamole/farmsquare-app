import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product, Category } from '../../data/products';
import {
  API_URL, mapProduct, WCProduct,
  createOrder, getOrder, markOrderPaid, WCOrder,
} from '../../services/woocommerce';

/**
 * RTK Query layer over the WooCommerce REST API, reached via the
 * farmsquare-api Worker (see worker/) which holds the credentials server-side
 * — nothing is injected client-side. The catalog is live-only — no mock
 * fallback — so these endpoints surface real empty/error states (isError)
 * when the API is unavailable.
 */
const baseQuery = fetchBaseQuery({ baseUrl: `${API_URL}/wc` });

type WCCategory = { id: number; name: string; slug: string; count: number };

export type SortKey = 'Popularity' | 'Newest' | 'Price: Low–High' | 'Price: High–Low' | 'Rating';

export interface ProductFilters {
  category?: number;
  search?: string;
  onSale?: boolean;
  inStock?: boolean;
  maxPrice?: number;
  sort?: SortKey;
}

interface ProductsPage {
  items: Product[];
  total: number;
  totalPages: number;
}

const SORT_PARAMS: Record<SortKey, { orderby: string; order?: 'asc' | 'desc' }> = {
  Popularity: { orderby: 'popularity' },
  Newest: { orderby: 'date' },
  'Price: Low–High': { orderby: 'price', order: 'asc' },
  'Price: High–Low': { orderby: 'price', order: 'desc' },
  Rating: { orderby: 'rating' },
};

function filterParams(f: ProductFilters): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {};
  if (f.category) params.category = f.category;
  if (f.search?.trim()) params.search = f.search.trim();
  if (f.onSale) params.on_sale = true;
  if (f.inStock) params.stock_status = 'instock';
  if (f.maxPrice) params.max_price = f.maxPrice;
  const sort = SORT_PARAMS[f.sort || 'Popularity'];
  params.orderby = sort.orderby;
  if (sort.order) params.order = sort.order;
  return params;
}

export const wooApi = createApi({
  reducerPath: 'wooApi',
  baseQuery,
  tagTypes: ['Product', 'Category', 'Order'],
  endpoints: builder => ({
    getProducts: builder.query<Product[], Record<string, string | number | boolean> | void>({
      query: params => ({ url: '/products', params: { per_page: 50, ...(params || {}) } }),
      transformResponse: (res: WCProduct[]) => res.map(mapProduct),
      providesTags: ['Product'],
    }),
    // Paginated catalog browsing/search. Filters are the cache key; the page
    // number is the infinite-query pageParam. Totals come from the WC
    // pagination headers, which the Worker forwards.
    browseProducts: builder.infiniteQuery<ProductsPage, ProductFilters, number>({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage, _allPages, lastPageParam) =>
          lastPageParam < lastPage.totalPages ? lastPageParam + 1 : undefined,
      },
      query: ({ queryArg, pageParam }) => ({
        url: '/products',
        params: { per_page: 20, page: pageParam, ...filterParams(queryArg) },
      }),
      transformResponse: (res: WCProduct[], meta) => ({
        items: res.map(mapProduct),
        total: Number(meta?.response?.headers.get('x-wp-total') ?? res.length),
        totalPages: Number(meta?.response?.headers.get('x-wp-totalpages') ?? 1),
      }),
      providesTags: ['Product'],
    }),
    getProduct: builder.query<Product | undefined, string>({
      query: id => ({ url: `/products/${id}` }),
      transformResponse: (res: WCProduct) => mapProduct(res),
      providesTags: (_r, _e, id) => [{ type: 'Product', id }],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => ({ url: '/products/categories', params: { per_page: 100, hide_empty: true } }),
      transformResponse: (res: WCCategory[]) => res.map(c => ({ id: c.slug, label: c.name, icon: c.slug, wcId: c.id, count: c.count })),
      providesTags: ['Category'],
    }),
    // Orders keep their own service functions (separate mock-fallback work, P0).
    // queryFn endpoints bypass the baseQuery, so mixing with `query` is fine.
    createOrder: builder.mutation<{ id: string; status: string }, WCOrder>({
      queryFn: async order => ({ data: await createOrder(order) }),
      invalidatesTags: ['Order'],
    }),
    markOrderPaid: builder.mutation<
      { id: string; status: string },
      { id: string; transactionRef?: string; status?: string }
    >({
      queryFn: async ({ id, transactionRef, status }) => ({
        data: await markOrderPaid(id, { transactionRef, status }),
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Order', id }, 'Order'],
    }),
    getOrder: builder.query<Awaited<ReturnType<typeof getOrder>>, string>({
      queryFn: async id => ({ data: await getOrder(id) }),
      providesTags: (_r, _e, id) => [{ type: 'Order', id }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useBrowseProductsInfiniteQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useCreateOrderMutation,
  useMarkOrderPaidMutation,
  useGetOrderQuery,
} = wooApi;
