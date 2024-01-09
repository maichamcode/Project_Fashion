import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const sizeApi = createApi({
    reducerPath: 'size',
    tagTypes: ['Size'],
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api',
    }),
    endpoints: (builder) => ({
        getSize: builder.query({
            query: () => "/size",
            providesTags: ["Size"],
        }),
        getOneSize: builder.query({
            query: (id) => `/size/${id}`,
            providesTags: ["Size"],
        }),
        addSize: builder.mutation({
            query: (size) => ({
                url: '/size/add',
                method: "POST",
                body: size
            }),
            invalidatesTags: ['Size']
        }),

    })
})

export const { useGetSizeQuery, useGetOneSizeQuery, useAddSizeMutation } = sizeApi;
export default sizeApi