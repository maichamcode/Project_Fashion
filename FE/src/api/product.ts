import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { pause } from "../utils/pause";

const apiProduct = createApi({
  reducerPath: "product",
  tagTypes: ["Product"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
    fetchFn: async (...args) => {
      await pause(1000);
      return fetch(...args);
    },
  }),
  endpoints: (builder) => ({
    getSearchProduct: builder.mutation({
      query: (product) => ({
        url: `/product/search`,
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    getSearchProductCategory: builder.mutation({
      query: (product) => ({
        url: `/product/category/search`,
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    getOutstan: builder.query({
      query: () => "/product/outstan",
      providesTags: ["Product"],
    }),
    updateOutstan: builder.mutation({
      query: (data: any) => ({
        url: `/product/updateoutstanproduct`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    getProductSeller: builder.query({
      query: () => "/product/sale",
      providesTags: ["Product"],
    }),

    getProducts: builder.query({
      query: () => "/product",
      providesTags: ["Product"],
    }),
    getProductsNoBlock: builder.query({
      query: () => "/product/noblock",
      providesTags: ["Product"],
    }),
    getProductsNoBlock1: builder.query({
      query: () => "/product/noblock1",
      providesTags: ["Product"],
    }),
    getProductsBlock: builder.query({
      query: () => "/product/block",
      providesTags: ["Product"],
    }),
    getAllProductOff: builder.query({
      query: () => "/product/getalloff",
      providesTags: ["Product"],
    }),
    get8NewProducts: builder.query({
      query: () => "/productnew",
      providesTags: ["Product"],
    }),
    getSumProduct: builder.query({
      query: () => "/product/sumproductday",
      providesTags: ["Product"],
    }),
    getOneProduct: builder.query({
      query: (id) => `/product/${id}/getone`,
      providesTags: ["Product"],
    }),
    getOneProductBlock: builder.query({
      query: (id) => `/product/${id}/getoneblock`,
      providesTags: ["Product"],
    }),
    getCountProductOrder: builder.query({
      query: (id) => `/product/${id}/countproductorder`,
      providesTags: ["Product"],
    }),
    getTopProductSale: builder.query({
      query: () => `/product/topproductsale`,
      providesTags: ["Product"],
    }),
    addProduct: builder.mutation({
      query: (product) => ({
        url: `/product/add`,
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: (product) => ({
        url: `/product/${product.id}/update`,
        method: "PATCH",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    updateImageProduct: builder.mutation({
      query: (product) => ({
        url: `/product/${product.id}/updateimage`,
        method: "PATCH",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    hideProduct: builder.mutation({
      query: ({ id, token }) => ({
        url: `/product/${id}/hide`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Product"],
    }),
    cancellHideProduct: builder.mutation({
      query: ({ id, token }) => ({
        url: `/product/${id}/cancellHide`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Product"],
    }),
    fillterProductByCategory: builder.query({
      query: (id) => `/product/${id}/categoryFillter`,
      providesTags: ["Product"],
    }),
    fillterProductByColor: builder.query({
      query: (id) => `/product/${id}/colorFillter`,
      providesTags: ["Product"],
    }),
    fillterProductBySize: builder.query({
      query: (id) => `/product/${id}/sizeFillter`,
      providesTags: ["Product"],
    }),
    fillterProductByPrice: builder.query({
      query: ({ minPrice, maxPrice }) =>
        `/product/priceFillter/${minPrice}/${maxPrice}`,
      providesTags: ["Product"],
    }),
    getOneKho: builder.query({
      query: (id) => `/product/${id}/kho`,
      providesTags: ["Product"],
    }),
    getRelatedProduct: builder.query({
      query: (id) => `/product/${id}/related`,
      providesTags: ["Product"],
    }),
    sortProductAtoZ: builder.query({
      query: () => `/product/sortAtoZ`,
      providesTags: ["Product"]
    }),
    sortProductZtoA: builder.query({
      query: () => `/product/sortZtoA`,
      providesTags: ["Product"]
    }),
    fillterProductMax: builder.query({
      query: () => "/product/filtermax",
      providesTags: ["Product"],
    }),
    fillterProductMin: builder.query({
      query: () => "/product/filtermin",
      providesTags: ["Product"],
    }),
    updateKho: builder.mutation({
      query: (data: any) => ({
        url: `/product/updatekho`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    sumKho: builder.mutation({
      query: (data: any) => ({
        url: `/product/sumkho`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    getAllSale: builder.query({
      query: () => "/product/allsale",
      providesTags: ["Product"],
    }),
    getAllOutstan: builder.query({
      query: () => "/product/alloutstan",
      providesTags: ["Product"],
    }),
    getAllNewProduct3Days: builder.query({
      query: () => "/product/allproduct3days",
      providesTags: ["Product"],
    }),
  }),
});
export const {
  useSumKhoMutation,
  useUpdateKhoMutation,
  useFillterProductMaxQuery,
  useFillterProductMinQuery,
  useGetRelatedProductQuery,
  useGetSearchProductCategoryMutation,
  useGetSearchProductMutation,
  useGetOutstanQuery,
  useGetProductSellerQuery,
  useGetProductsQuery,
  useGet8NewProductsQuery,
  useGetOneProductQuery,
  useGetTopProductSaleQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useGetSumProductQuery,
  useHideProductMutation,
  useCancellHideProductMutation,
  useFillterProductByCategoryQuery,
  useGetAllProductOffQuery,
  useFillterProductByColorQuery,
  useFillterProductBySizeQuery,
  useFillterProductByPriceQuery,
  useUpdateOutstanMutation,
  useGetOneKhoQuery,
  useGetCountProductOrderQuery,
  useGetProductsNoBlockQuery,
  useSortProductAtoZQuery,
  useSortProductZtoAQuery,
  useGetAllSaleQuery,
  useGetAllOutstanQuery,
  useGetAllNewProduct3DaysQuery,
  useGetProductsBlockQuery,
  useGetProductsNoBlock1Query,
  useUpdateImageProductMutation,
  useGetOneProductBlockQuery
} = apiProduct;
export const productReducer = apiProduct.reducer;
export default apiProduct;
