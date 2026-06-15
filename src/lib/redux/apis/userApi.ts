import { apiSlice } from "../apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<any, { page: number; limit: number; subscription?: string }>({
      query: ({ page, limit, subscription }) => {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        if (subscription) params.append("subscription", subscription);
        return `admin/users?${params.toString()}`;
      },
      providesTags: ["User"],
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
      invalidatesTags: (_result, _error, { id }) => [{ type: "User", id }],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserDetailsQuery, useBlockUserMutation } = userApi;
