import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: "" });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User", "Bets"], // Define the types of tags you will use

  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/api/users/login",
        method: "POST",
        body: data,
      }),
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/api/users/register",
        method: "POST",
        body: data,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/api/users/logout",
        method: "POST",
      }),
    }),
    deleteBet: builder.mutation({
      query: (betId) => ({
        url: `/api/bets/delete/${betId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bets"], // Invalidate the Bets tag after deleting a bet
    }),
    addBalance: builder.mutation({
      query: (data) => ({
        url: "/api/users/balance",
        method: "POST",
        body: data,
      }),
    }),
    createBet: builder.mutation({
      query: (data) => ({
        url: "/api/bets/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Bets"], // Invalidate the Bets tag after creating a bet
    }),
    getSingleUser: builder.query({
      query: (userId) => `api/users/${userId}`,
      providesTags: (_, __, userId) => [{ type: "User", id: userId }], // Provide a tag with the user ID
    }),
    getEvents: builder.query({
      query: () => "api/events",
      providesTags: ["Bets"], // Provide the Bets tag
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
  useDeleteBetMutation,
  useAddBalanceMutation,
  useCreateBetMutation,
  useGetSingleUserQuery,
  useGetEventsQuery,
} = apiSlice;
