import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const authApi = createApi({
    reducerPath: 'auth',
    tagTypes: ['Auth'],
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api',

    }),
    endpoints: (builder) => ({
        signin: builder.mutation({
            query: (user: any) => ({
                url: `signin`,
                method: "POST",
                body: user
            }),
        }),
        signinnotoken: builder.mutation({
            query: (user: any) => ({
                url: `signinnotoken`,
                method: "POST",
                body: user
            }),
        }),
        signup: builder.mutation({
            query: (user: any) => ({
                url: `/signup`,
                method: "POST",
                body: user
            }),
            invalidatesTags: ['Auth'],
        }),
        SendOtp: builder.mutation({
            query: (user_email: any) => ({
                url: `/sendOtp`,
                method: "POST",
                body: user_email
            }),
            invalidatesTags: ['Auth'],
        }),
        getUser: builder.query({
            query: () => `/user`,
            providesTags: ['Auth']
        }),
        getOneUser: builder.query({
            query: (id) => `/user/${id}/getone`,
            providesTags: ['Auth'],
        }),
        updateProfile: builder.mutation({
            query: (users) => ({
                url: `/user/${users.id}/update`,
                method: "PATCH",
                body: users
            }),
            invalidatesTags: ['Auth']
        }),
        updateProfile1: builder.mutation({
            query: (users) => ({
                url: `/user/${users.id}/update1`,
                method: "PATCH",
                body: users
            }),
            invalidatesTags: ['Auth']
        }),
        signinProfile: builder.mutation({
            query: (user: any) => ({
                url: `signinprofile`,
                method: "POST",
                body: user
            }),
        }),
        forgotpassword: builder.mutation({
            query: (user: any) => ({
                url: `/forgotpassword`,
                method: "POST",
                body: user
            }),
            invalidatesTags: ['Auth'],
        }),
        blockUser: builder.mutation({
            query: (data: any) => ({
                url: `/user/blockuser`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Auth"],
        }),
        changePassword: builder.mutation({
            query: (users) => ({
                url: `changepassword`,
                method: "PATCH",
                body: users
            }),
            invalidatesTags: ['Auth']
        }),
    })
})

export const {useSigninnotokenMutation, useUpdateProfile1Mutation,useChangePasswordMutation,useForgotpasswordMutation, useSignupMutation, useSigninProfileMutation, useSigninMutation, useGetUserQuery, useGetOneUserQuery, useSendOtpMutation, useUpdateProfileMutation, useBlockUserMutation } = authApi;
export default authApi