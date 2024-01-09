import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { pause } from "../utils/pause";

const apiRecyclebin = createApi({
    reducerPath: "recyclebin",
    tagTypes: ["Recyclebin"],
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080/api",
        fetchFn: async (...args) => {
            await pause(1000);
            return fetch(...args);
        },
    }),
    endpoints: (builder) => ({
        getRecyclebin: builder.query({
            query: () => "/recyclebin",
            providesTags: ["Recyclebin"],
        }),
        restoreProduct: builder.mutation({
            query: (id) => ({
                url: `/recyclebin/${id}/restore`,
                method: "POST",

            }),
            invalidatesTags: ['Recyclebin']
        }),
        deleteProductRecyclebin: builder.mutation({
            query: (id) => ({
                url: `/recyclebin/${id}`,
                method: "DELETE",

            }),
            invalidatesTags: ['Recyclebin']
        })
    }),
});
export const { useGetRecyclebinQuery, useRestoreProductMutation, useDeleteProductRecyclebinMutation } = apiRecyclebin;
export const RecyclebinReducer = apiRecyclebin.reducer;
export default apiRecyclebin;
