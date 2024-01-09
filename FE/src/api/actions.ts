import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { pause } from "../utils/pause";

const apiActions = createApi({
    reducerPath: 'actions',
    tagTypes: ['Actions'],

    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api',
        fetchFn: async (...args) => {
            await pause(1000);
            return fetch(...args);
        },
    }),
    endpoints: (builder) => ({
        addAction: builder.mutation({
            query: (data: any) => ({
                url: `/action`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Actions']
        }),
        getActions: builder.query({
            query: () => "/getallaction",
            providesTags: ["Actions"],
        }),

    }),
})


export const { useAddActionMutation,useGetActionsQuery } = apiActions;
export const CategoryReducer = apiActions.reducer

export default apiActions;