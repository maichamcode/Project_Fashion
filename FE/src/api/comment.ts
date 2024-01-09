import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { pause } from "../utils/pause";

const commentApi = createApi({
  reducerPath: "comment",
  tagTypes: ["Comment"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
    fetchFn: async (...args) => {
      await pause(1000);
      return fetch(...args);
    },
  }),
  endpoints: (builder) => ({
    getAllComment: builder.query({
      query: () => "/comment",
      providesTags: ["Comment"],
    }),

    addCmt: builder.mutation({
      query: (data: any) => ({
        url: "/comment/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Comment"],
    }),
    //delete
    deleteComment: builder.mutation({
      query: (id: any) => ({
        url: `/comment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment"],
    }),
    getCommentProduct: builder.query({
      query: (id) => ({
        url: `/comment/${id}/product`,
      }),
      providesTags: ["Comment"],
    }),
    fillterCommentDaily: builder.mutation({
      query: (data) => ({
        url: '/actiondaily',
        method: "POST",
        body: data
      }),
      invalidatesTags: ['Comment']
    }),
  }),
});
export const {
  useDeleteCommentMutation,
  useGetAllCommentQuery,
  useGetCommentProductQuery,
  useAddCmtMutation,
  useFillterCommentDailyMutation
} = commentApi;
export default commentApi;
