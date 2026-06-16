/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<
      any,
      { page: number; limit: number; subscription?: string; user_type?: string }
    >({
      query: ({ page, limit, subscription, user_type }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (subscription) params.append("subscription", subscription);
        if (user_type && user_type !== "all")
          params.append("user_type", user_type);
        return `admin/users?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.data?.users
          ? [
              ...result.data.users.map(({ id }: { id: number }) => ({
                type: "User" as const,
                id,
              })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
    getUserDetails: builder.query<any, number>({
      query: (id) => `admin/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
    blockUser: builder.mutation<any, { id: number; action: string }>({
      query: ({ id, action }) => ({
        url: `admin/users/${id}/action`,
        method: "PATCH",
        body: { action },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
    getProfile: builder.query<any, void>({
      query: () => `admin/settings/profile`,
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<
      any,
      { name: string; phone_number: string }
    >({
      query: (data) => ({
        url: `admin/settings/profile`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation<any, any>({
      query: (data) => ({
        url: `admin/settings/security`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserDetailsQuery,
  useBlockUserMutation,
  useUpdateProfileMutation,
  useGetProfileQuery,
  useChangePasswordMutation,
} = userApi;
