import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";


const vnpayApi = createApi({
    reducerPath: 'vnpay',
    tagTypes: ['vnpay'],
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api'
    }),
    endpoints: (builder) => ({
        create_vnpay: builder.mutation({
            query: (paymentData) => ({
                url: '/vnpay',
                method: 'POST',
                body: paymentData,
            }),
            invalidatesTags: ['vnpay'],
        }),
        getOneVnpay: builder.query({
            query: () => `/getonevnpay`,
            providesTags: ["vnpay"],
        }),
    }),
})


export const { useCreate_vnpayMutation, useGetOneVnpayQuery } = vnpayApi
export default vnpayApi