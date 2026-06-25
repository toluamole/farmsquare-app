import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product, Category } from '../../data/products';
import {
  getProducts, getProduct, getCategories, createOrder, getOrder, markOrderPaid,
  WCOrder,
} from '../../services/woocommerce';

/**
 * RTK Query layer over the WooCommerce service. The service already falls back
 * to local mock data (FS_PRODUCTS / FS_CATEGORIES) when WC credentials are
 * absent, so these endpoints work offline and gain caching + generated hooks.
 */
export const wooApi = createApi({
  reducerPath: 'wooApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Product', 'Category', 'Order'],
  endpoints: builder => ({
    getProducts: builder.query<Product[], Record<string, string | number> | void>({
      queryFn: async params => ({ data: await getProducts(params || undefined) }),
      providesTags: ['Product'],
    }),
    getProduct: builder.query<Product | undefined, string>({
      queryFn: async id => ({ data: await getProduct(id) }),
      providesTags: (_r, _e, id) => [{ type: 'Product', id }],
    }),
    getCategories: builder.query<Category[], void>({
      queryFn: async () => ({ data: await getCategories() }),
      providesTags: ['Category'],
    }),
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
