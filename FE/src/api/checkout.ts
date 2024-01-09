import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { pause } from "../utils/pause";

const checkoutApi = createApi({
  reducerPath: "checkout",
  tagTypes: ["Checkout"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
    fetchFn: async (...args) => {
      await pause(1000);
      return fetch(...args);
    },
  }),
  endpoints: (builder) => ({
    addBCheckout: builder.mutation({
      query: (data: any) => ({
        url: "/checkout/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Checkout"],
    }),
    addBCheckoutNow: builder.mutation({
      query: (data: any) => ({
        url: "/checkoutnow/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Checkout"],
    }),
    addCheckoutNoToken: builder.mutation({
      query: (data: any) => ({
        url: "/checkoutoff/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Checkout"],
    }),
    getOneChekout: builder.query({
      query: (id) => ({
        url: `/checkout/${id}`,
      }),
      providesTags: ["Checkout"],
    }),
    getOneChekoutProduct: builder.query({
      query: (id) => ({
        url: `/checkout/${id}/checkoutproduct`,
      }),
      providesTags: ["Checkout"],
    }),
  }),
});
export const {
  useAddBCheckoutMutation,
  useAddBCheckoutNowMutation,
  useGetOneChekoutQuery,
  useAddCheckoutNoTokenMutation,
  useGetOneChekoutProductQuery,
} = checkoutApi;
export default checkoutApi;
