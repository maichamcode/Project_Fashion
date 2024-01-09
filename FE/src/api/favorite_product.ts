

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { pause } from "../utils/pause";

const apiFavoriteProduct = createApi({
  reducerPath: "favoriteProduct",
  tagTypes: ["favoriteProduct"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
    fetchFn: async (...args) => {
      await pause(1000);
      return fetch(...args);
    },
  }),
  endpoints: (builder) => ({
    getAllFavoriteProducts: builder.query({
      query: () => "/favoriteProduct",
      providesTags: ["favoriteProduct"],
    }),
    getFavoriteWithUser:builder.query({
      query:(id)=>`/favoriteProduct/${id}`,
      providesTags:['favoriteProduct']
    }),

    addFavoriteProduct: builder.mutation({
      query: (product) => ({
        url: `/favoriteProduct/add`,
        method: "POST",
        body: product
      }),
      invalidatesTags: ['favoriteProduct']
    }),
   
    deleteFavoriteProduct: builder.mutation({
      query: (id) => ({
        url: `/favoriteProduct/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['favoriteProduct']
    })
  }),
});
export const {
    useGetAllFavoriteProductsQuery,
    useAddFavoriteProductMutation,
    useDeleteFavoriteProductMutation,
    useGetFavoriteWithUserQuery
} = apiFavoriteProduct;
export const FavoriteProductReducer = apiFavoriteProduct.reducer;
export default apiFavoriteProduct;
