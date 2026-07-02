import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Product, Category } from '../../data/products';
import {
  WC_URL, WC_KEY, WC_SECRET, mapProduct, WCProduct,
  createOrder, getOrder, markOrderPaid, WCOrder,
} from '../../services/woocommerce';

/**
 * RTK Query layer over the WooCommerce REST API. The catalog is live-only — no
 * mock fallback — so these endpoints surface real empty/error states (isError)
 * when WooCommerce is unavailable. Auth (consumer key/secret) is injected as
 * query params by the baseQuery wrapper; error handling is centralized there.
 */
const rawBaseQuery = fetchBaseQuery({ baseUrl: `${WC_URL}/wp-json/wc/v3` });

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = (
  args,
  api,
  extraOptions,
) => {
  const fa: FetchArgs = typeof args === 'string' ? { url: args } : args;
  return rawBaseQuery(
    { ...fa, params: { ...fa.params, consumer_key: WC_KEY, consumer_secret: WC_SECRET } },
    api,
    extraOptions,
  );
};

type WCCategory = { id: number; name: string; slug: string };

export const wooApi = createApi({
  reducerPath: 'wooApi',
  baseQuery,
  tagTypes: ['Product', 'Category', 'Order'],
  endpoints: builder => ({
    getProducts: builder.query<Product[], Record<string, string | number> | void>({
      query: params => ({ url: '/products', params: { per_page: 50, ...(params || {}) } }),
      transformResponse: (res: WCProduct[]) => res.map(mapProduct),
      providesTags: ['Product'],
    }),
    getProduct: builder.query<Product | undefined, string>({
      query: id => ({ url: `/products/${id}` }),
      transformResponse: (res: WCProduct) => mapProduct(res),
      providesTags: (_r, _e, id) => [{ type: 'Product', id }],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => ({ url: '/products/categories', params: { per_page: 100, hide_empty: true } }),
      transformResponse: (res: WCCategory[]) => res.map(c => ({ id: c.slug, label: c.name, icon: c.slug })),
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
  useGetProductQuery,
  useGetCategoriesQuery,
  useCreateOrderMutation,
  useMarkOrderPaidMutation,
  useGetOrderQuery,
} = wooApi;
