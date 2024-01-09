
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { pause } from '../utils/pause'


const billApi = createApi({
    reducerPath: 'bill',
    tagTypes: ['Bill'],
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api',
        fetchFn: async (...args) => {
            await pause(1000)
            return fetch(...args)
        }
    }),
    endpoints: (builder) => ({
        getBill: builder.query({
            query: () => `/bill`,
            providesTags:['Bill']
        }),
        getBillById: builder.query({
            query: (id) => `/bill/${id}`,
            providesTags:['Bill']
        }),
        getOneBill: builder.query({
            query: (id) => `/bill/${id}/getone`,
            providesTags:['Bill']
        }),
        addBill: builder.mutation({
            query: (data) => ({
                url: `/bill/add`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Bill'],
        }),
            updateBill:builder.mutation({
                query:(bill:any)=>({
                    url:`/bill/${bill.id}/update`,
                    method:"PATCH",
                    body:bill
                }),
                invalidatesTags:['Bill']
            }),
        getBillInOrder: builder.query({
            query: (id) => `/bill/${id}/order`,
            providesTags:['Bill']
        }),

    })
})

export const { useUpdateBillMutation,useGetOneBillQuery,useAddBillMutation, useGetBillQuery, useGetBillByIdQuery, useGetBillInOrderQuery } = billApi
export default billApi