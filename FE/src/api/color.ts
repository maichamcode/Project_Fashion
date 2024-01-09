import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const colorApi = createApi({
    reducerPath: 'color',
    tagTypes: ['Color'],
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api',
    }),
    endpoints: (builder) => ({
        getColor: builder.query({
            query: () => "/color",
            providesTags: ["Color"],
        }),
        getOneColor: builder.query({
            query: (id) => `/color/${id}`,
            providesTags: ["Color"],
        }),
        addColor: builder.mutation({
            query: (color) => ({
                url: '/color/add',
                method: "POST",
                body: color
            }),
            invalidatesTags: ['Color']
        }),
    })
})

export const { useGetColorQuery, useGetOneColorQuery, useAddColorMutation } = colorApi;
export default colorApi