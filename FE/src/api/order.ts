
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { pause } from '../utils/pause'


const orderApi = createApi({
    reducerPath: 'order',
    tagTypes: ['Order'],
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api',
        fetchFn: async (...args) => {
            await pause(1000)
            return fetch(...args)
        }
    }),
    endpoints: (builder) => ({
        addOrder: builder.mutation({
            query: (data) => ({
                url: `/order/add`,
                method: 'POST',
                body: data
            }),

            invalidatesTags: ['Order'],
        }),
        getOneOrder: builder.query({
            query: (id) => ({
                url: `/order/${id}/getone`,

            }),
            providesTags: ['Order'],
        }),
        getOneOrderUser: builder.query({
            query: (id) => ({
                url: `/order/${id}/getorderuser`,

            }),
            providesTags: ['Order'],
        }),
        getAllOrder: builder.query({
            query: () => ({
                url: `/order`,
            }),
            providesTags: ['Order'],
        }),
        updateCancell: builder.mutation({
            query: (id) => ({
                url: `/order/cancell`,
                body: id,
                method: 'PATCH',
            }),
            invalidatesTags: ['Order'],
        }),
        ConfirmOrder: builder.mutation({
            query: (id) => ({
                url: `/order/confirm`,
                body: id,
                method: 'PATCH',
            }),
            invalidatesTags: ['Order'],
        }),
        updateOrderShip: builder.mutation({
            query: (id) => ({
                url: `/order/shiping`,
                body: id,
                method: 'PATCH',
            }),
            invalidatesTags: ['Order'],
        }),
        updateOrder: builder.mutation({
            query: (id) => ({
                url: `/order/sumbomd`,
                body: id,
                method: 'PATCH',
            }),
            invalidatesTags: ['Order'],
        }),
        updateOrderShipDone: builder.mutation({
            query: (id) => ({
                url: `/order/shipdone`,
                body: id,
                method: 'PATCH',
            }),
            invalidatesTags: ['Order'],
        }),
        updateOrderDone: builder.mutation({
            query: (id) => ({
                url: `/order/done`,
                body: id,
                method: 'PATCH',
            }),
            invalidatesTags: ['Order'],
        }),
        updateOrderBomd: builder.mutation({
            query: (id) => ({
                url: `/order/bomd`,
                body: id,
                method: 'PATCH',
            }),
            invalidatesTags: ['Order'],
        }),
        updateOrderComplete: builder.mutation({
            query: (id) => ({
                url: `/order/complate`,
                body: id,
                method: 'PATCH',
            }),
            invalidatesTags: ['Order'],
        }),
        countOrderOnline: builder.query({
            query: () => ({
                url: `/order/countorderonline`,
            }),
            providesTags: ['Order'],
        }),
        countOrderOff: builder.query({
            query: () => ({
                url: `/countPaymentOff`,
            }),
            providesTags: ['Order'],
        }),
        getOrderDay: builder.query({
            query: () => "/product/countproductoday",
            providesTags: ["Order"],
        }),
        getOrderPaceDay: builder.query({
            query: () => "/order/orderplaceday",
            providesTags: ["Order"],
        }),
        getOrderWatingDay: builder.query({
            query: () => "/order/orderawaitingday",
            providesTags: ["Order"],
        }),
        getOrderDoneDay: builder.query({
            query: () => "/order/orderdoneday",
            providesTags: ["Order"],
        }),
        getOrder7Day: builder.query({
            query: () => "/order/orderinweek",
            providesTags: ["Order"],
        }),
        getOrderPlace: builder.query({
            query: () => "/order/orderplace",
            providesTags: ["Order"],
        }),
        getOrderPending: builder.query({
            query: () => "/order/orderpending",
            providesTags: ["Order"],
        }),
        getOrderPendingAll: builder.query({
            query: () => "/order/orderpendingall",
            providesTags: ["Order"],
        }),
        getOrderReceived: builder.query({
            query: () => "/order/orderrevice",
            providesTags: ["Order"],
        }),
        getOrderPendding: builder.query({
            query: () => "/order/confirm",
            providesTags: ["Order"],
        }),
        getOrderShiping: builder.query({
            query: () => "/order/ordershiping",
            providesTags: ["Order"],
        }),
        getOrderConfirm: builder.query({
            query: () => "/order/orderconfirm",
            providesTags: ["Order"],
        }),
        getOrderDelevered: builder.query({
            query: () => "/order/orderDelivered",
            providesTags: ["Order"],
        }),
        getOrderComplete: builder.query({
            query: () => "/order/ordercomplete",
            providesTags: ["Order"],
        }),
        getOrderDoneAndComplete: builder.query({
            query: () => "/order/orderdoneandcomplete",
            providesTags: ["Order"],
        }),
        getOrderBomd: builder.query({
            query: () => "/order/orderbomd",
            providesTags: ["Order"],
        }),
        getOrderCancell: builder.query({
            query: () => "/order/ordercancell",
            providesTags: ["Order"],
        }),
        sendEmailStatusOrder: builder.mutation({
            query: ({ id, text }) => ({
                url: `/order/status`,
                body: { id, text },
                method: 'POST',
            }),
            invalidatesTags: ['Order'],
        }),
        getOrderReceivedDay: builder.query({
            query: () => "/order/orderreviceday",
            providesTags: ["Order"],
        }),
        getSearchOrder: builder.mutation({
            query: (order) => ({
                url: `/order/search`,
                method: "POST",
                body: order,
            }),
            invalidatesTags: ["Order"],
        }),
        getSearchOrderCancell: builder.mutation({
            query: (order) => ({
                url: `/order/searchcancell`,
                method: "POST",
                body: order,
            }),
            invalidatesTags: ["Order"],
        }),
        getSearchOrderCancell1: builder.mutation({
            query: (order) => ({
                url: `/order/searchcancell1`,
                method: "POST",
                body: order,
            }),
            invalidatesTags: ["Order"],
        }),
        getSearchOrderConfirm: builder.mutation({
            query: (order) => ({
                url: `/order/searchconfirm`,
                method: "POST",
                body: order,
            }),
            invalidatesTags: ["Order"],
        }),
        getSearchOrderAwaitShipper: builder.mutation({
            query: (order) => ({
                url: `/order/searchawaitshipper`,
                method: "POST",
                body: order,
            }),
            invalidatesTags: ["Order"],
        }),
        getSearchOrderShipping: builder.mutation({
            query: (order) => ({
                url: `/order/searchshipping`,
                method: "POST",
                body: order,
            }),
            invalidatesTags: ["Order"],
        }),
        getSearchOrderShipDone: builder.mutation({
            query: (order) => ({
                url: `/order/searchshipdone`,
                method: "POST",
                body: order,
            }),
            invalidatesTags: ["Order"],
        }),
        getSearchOrderDone: builder.mutation({
            query: (order) => ({
                url: `/order/searchdone`,
                method: "POST",
                body: order,
            }),
            invalidatesTags: ["Order"],
        }),
        getSearchOrderComplete: builder.mutation({
            query: (order) => ({
                url: `/order/searchcomplete`,
                method: "POST",
                body: order,
            }),
            invalidatesTags: ["Order"],
        }),
    })
})
export const { useGetOneOrderUserQuery, useGetSearchOrderCancell1Mutation, useUpdateOrderMutation, useUpdateOrderBomdMutation, useGetOrderBomdQuery, useGetOrderDoneAndCompleteQuery, useGetOrderReceivedDayQuery, useGetOrderPendingAllQuery, useSendEmailStatusOrderMutation, useUpdateOrderShipDoneMutation, useGetOrderPenddingQuery, useGetOrderShipingQuery, useUpdateOrderShipMutation, useAddOrderMutation, useUpdateOrderDoneMutation, useGetOneOrderQuery, useGetAllOrderQuery, useUpdateCancellMutation, useGetOrderDayQuery, useConfirmOrderMutation, useCountOrderOnlineQuery, useCountOrderOffQuery, useGetOrderPaceDayQuery, useGetOrderWatingDayQuery, useGetOrderDoneDayQuery, useGetOrder7DayQuery, useGetOrderPlaceQuery, useGetOrderPendingQuery, useGetOrderReceivedQuery, useGetOrderConfirmQuery, useGetOrderDeleveredQuery, useGetOrderCompleteQuery, useUpdateOrderCompleteMutation, useGetOrderCancellQuery, useGetSearchOrderMutation, useGetSearchOrderCancellMutation, useGetSearchOrderConfirmMutation, useGetSearchOrderAwaitShipperMutation, useGetSearchOrderShippingMutation, useGetSearchOrderShipDoneMutation, useGetSearchOrderDoneMutation, useGetSearchOrderCompleteMutation } = orderApi
export default orderApi