import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiDashboard = createApi({
  reducerPath: "dashboard",
  tagTypes: ["Dashboard"],

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
  }),
  endpoints: (builder) => ({
    gettopuser: builder.query({
      query: () => "/topuser",
    }),
    getoneuser: builder.query({
      query: (id) => `/user/${id}/getone`,
      providesTags: ["Dashboard"],
    }),
    getTotalDay: builder.query({
      query: () => ({
        url: `/totalday`,
      }),
      providesTags: ["Dashboard"],
    }),
    topProductDay: builder.query({
      query: () => ({
        url: `/topproduct`
      }),
      providesTags: ['Dashboard']
    }),
    topProductWeek: builder.query({
      query: () => ({
        url: `/topproductweek`
      }),
      providesTags: ['Dashboard']
    }),
    topProductMonth: builder.query({
      query: () => ({
        url: `/topproductmonth`
      }),
      providesTags: ['Dashboard']
    }),
    topProductRenevueDay: builder.query({
      query: () => ({
        url: `/topProductRevenueDay`
      }),
      providesTags: ['Dashboard']
    }),
    topProductRenevueWeek: builder.query({
      query: () => ({
        url: `/topProductRevenueWeek`
      }),
      providesTags: ['Dashboard']
    }),
    topProductRenevueMonth: builder.query({
      query: () => ({
        url: `/topProductRevenueMonth`
      }),
      providesTags: ['Dashboard']
    }),
    getTotalPerMonth: builder.query({
      query: () => ({
        url: `/topproductpermonth`
      }),
      providesTags: ['Dashboard']
    }),
    getTotalPerDay: builder.query({
      query: () => ({
        url: `/topproductperday`
      }),
      providesTags: ['Dashboard']
    }),
    getDailyEarnings: builder.mutation({
      query: (order_date) => ({
          url: '/totaldasboard',
          method: "POST",
          body: order_date
      }),
      invalidatesTags: ['Dashboard']
  }),
  getDaily: builder.mutation({
    query: (data) => ({
        url: '/totaldaily',
        method: "POST",
        body: data
    }),
    invalidatesTags: ['Dashboard']
}),
getActionDaily: builder.mutation({
  query: (data) => ({
      url: '/actiondaily',
      method: "POST",
      body: data
  }),
  invalidatesTags: ['Dashboard']
}),
  }),
});

export const { useGetoneuserQuery, useGettopuserQuery, useGetTotalDayQuery, useTopProductDayQuery, useTopProductWeekQuery, useTopProductMonthQuery, useTopProductRenevueDayQuery, useTopProductRenevueWeekQuery, useTopProductRenevueMonthQuery , useGetTotalPerMonthQuery, useGetTotalPerDayQuery,useGetDailyEarningsMutation, useGetDailyMutation, useGetActionDailyMutation} =
  apiDashboard;
export const CategoryReducer = apiDashboard.reducer;

export default apiDashboard;
