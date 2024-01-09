import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const saleApi = createApi({
    reducerPath: 'sale',
    tagTypes: ['Sale'],
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api',
    }),
    endpoints: (builder) => ({
        getSale: builder.query({
            query: () => "/sale",
            providesTags: ["Sale"],
        }),
        updatesale: builder.mutation({
            query: (data: any) => ({
                url: `/sale/updatesaleproduct`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ['Sale'],
        }),
        addSale: builder.mutation({
            query: (sale) => ({
                url: '/sale/add',
                method: "POST",
                body: sale
            }),
            invalidatesTags: ['Sale']
        }),
        saleupdates: builder.mutation({
            query: (sale) => ({
                url: `/sale/${sale.id}/update`,
                method: "PATCH",
                body: sale,
            }),
            invalidatesTags: ["Sale"],
        }),
        getOneSale: builder.query({
            query: (id) => `/sale/${id}`,
            providesTags: ['Sale']
        }),
        updateflashsale: builder.mutation({
            query: (sale) => ({
                url: `/sale/updateFlashSale`,
                method: "PATCH",
                body: sale,
            }),
            invalidatesTags: ["Sale"],
        }),
        addflashsale: builder.mutation({
            query: (sale) => ({
                url: `/sale/addflashsale`,
                method: "POST",
                body: sale,
            }),
            invalidatesTags: ["Sale"],
        }),
        getFlashSale: builder.query({
            query: () => `/flashsale`,
            providesTags: ['Sale']
        }),
        updateflashsaleOK: builder.mutation({
            query: (sale) => ({
                url: `/sale/updateflashsaleok`,
                method: "PATCH",
                body: sale,
            }),
            invalidatesTags: ["Sale"],
        }),
        deleteFlashSale:builder.mutation({
            query:(id:any)=>({
                url:`/sale/${id}/deleteFlashSale`,
                method:"DELETE"
            }),
            invalidatesTags:['Sale']
        })
    })
})

export const { useDeleteFlashSaleMutation,useGetSaleQuery, useUpdateflashsaleMutation,useUpdateflashsaleOKMutation, useGetFlashSaleQuery, useAddflashsaleMutation, useUpdatesaleMutation, useAddSaleMutation, useSaleupdatesMutation, useGetOneSaleQuery } = saleApi;
export default saleApi