


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const blogApi = createApi({
  reducerPath: "blog",
  tagTypes: ["Blog"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
  }),
  endpoints: (builder) => ({
  
    //show all blog
    getAllBlog: builder.query({
      query: () => "/blog",
      providesTags: ["Blog"],
    }),
    //getoneblog
    getOneBlog: builder.query({
        query: (id:any) =>`/blog/${id}`,
        providesTags: ["Blog"],
      }),
    //add
    addBlog: builder.mutation({
      query: (blog: any) => ({
        url: "/blog/add",
        method: "POST",
        body: blog,
      }),
      invalidatesTags: ["Blog"],
    }),
    //update
    updateBlog: builder.mutation({
      query: (blog: any) => ({
        url: `/blog/${blog.id}/update`,
        method: "PATCH",
        body: blog,
      }),
      invalidatesTags: ["Blog"],
    }),
    //delete
    deleteBlog: builder.mutation({
      query: (id:any) => ({
        url:  `/blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const { useGetOneBlogQuery,useGetAllBlogQuery,useAddBlogMutation,useDeleteBlogMutation,useUpdateBlogMutation} = blogApi;
export default blogApi;
