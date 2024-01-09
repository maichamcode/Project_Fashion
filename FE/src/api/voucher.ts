import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const voucherApi = createApi({
  reducerPath: "voucher",
  tagTypes: ["Voucher"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
  }),
  endpoints: (builder) => ({
    // sử dụng voucher
    useVoucher:builder.mutation({
        query: (voucher: any) => ({
            url: `/voucher`,
            method: "POST",
            body: voucher,
          }),
          invalidatesTags: ["Voucher"],
    }),
    //show all voucher
    getAllVoucher: builder.query({
      query: () => "/allVoucher",
      providesTags: ["Voucher"],
    }),
    //getonevoucher
    getOneVoucher: builder.query({
      query: (id:any) =>`/voucher/${id}/getone`,
      providesTags: ["Voucher"],
    }),
    //add
    addVoucher: builder.mutation({
      query: (voucher: any) => ({
        url: "/voucher/add",
        method: "POST",
        body: voucher,
      }),
      invalidatesTags: ["Voucher"],
    }),
    //update
    updateVoucher: builder.mutation({
      query: (voucher: any) => ({
        url: `/voucher/${voucher.id}/update`,
        method: "PATCH",
        body: voucher,
      }),
      invalidatesTags: ["Voucher"],
    }),
    //delete
    deleteVoucher: builder.mutation({
      query: (id:any) => ({
        url:  `/voucher/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Voucher"],
    }),
    getAllVoucherRule: builder.query({
      query: (params) => {
        const { total, iduser } = params;
        return {
          url: `/getAllVoucherRule`,
          method: "GET",
          params: { total, iduser }, 
        };
      },
      providesTags: ["Voucher"],
    }),
  }),
});

export const { useGetAllVoucherRuleQuery,useGetOneVoucherQuery,useAddVoucherMutation,useDeleteVoucherMutation,useGetAllVoucherQuery,useUseVoucherMutation,useUpdateVoucherMutation} = voucherApi;
export default voucherApi;
