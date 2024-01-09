import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { pause } from "../utils/pause";
const cartApi = createApi({
  reducerPath: "cart",
  tagTypes: ["Cart"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
    fetchFn: async (...args) => {
      await pause(1000);
      return fetch(...args);
    },
  }),
  endpoints: (builder) => ({

    getCart: builder.query({
      query: (id) => `/cart/${id}`,
      providesTags: ["Cart"],
    }),
    getAllCart: builder.query({
      query: () => `/cart`,
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation({
      query: ({ data, token }) => ({
        url: `/cart/addtocart`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Cart"],
    }),
  
    deleteCart:builder.mutation({
      query:(id)=>({
        url:`/cart/${id}`,
        method:"DELETE"
      }),
     invalidatesTags:["Cart"]
    })
  }),
});

export const { useGetAllCartQuery,useAddToCartMutation, useGetCartQuery,useDeleteCartMutation } = cartApi;
export default cartApi;
