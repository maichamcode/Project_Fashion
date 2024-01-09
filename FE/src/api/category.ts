import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiCategory = createApi({
    reducerPath: 'category',
    tagTypes: ['Category'],

    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api',
    }),
    endpoints: (builder) => ({
        getCategory: builder.query({
            query: () => "/category",
            providesTags: ['Category']
        }),
        getAllCat: builder.query({
            query: () => "/category/all",
            providesTags: ['Category']
        }),
        getOneCat: builder.query({
            query: (id) => `/category/${id}/getone`,
            providesTags: ['Category']
        }),
        getAllCatNoPagination: builder.query({
            query: () => "/categoryNoPagination",
            providesTags: ['Category']
        }),
        addCategory: builder.mutation({
            query: (category) => ({
                url: '/category/add',
                method: "POST",
                body: category
            }),
            invalidatesTags: ['Category']
        }),
        updateCategory: builder.mutation({
            query: (category) => ({
                url: `/category/${category.id}/update`,
                method: "PATCH",
                body: category
            }),
            invalidatesTags: ['Category']
        }),
        ProductinCategory: builder.query({
            query: () => "/categoryproducts",
            providesTags: ['Category']
        }),
        ProductCategory: builder.query({
            query: (id) => `/category/${id}`,
            providesTags: ['Category']
        }),
    }),
});

export const { useGetCategoryQuery, useGetAllCatQuery, useGetAllCatNoPaginationQuery, useGetOneCatQuery, useAddCategoryMutation, useUpdateCategoryMutation, useProductinCategoryQuery, useProductCategoryQuery } = apiCategory;
export const CategoryReducer = apiCategory.reducer

export default apiCategory;