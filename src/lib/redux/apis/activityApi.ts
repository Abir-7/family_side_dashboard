import { apiSlice } from "../apiSlice";

export const activityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActivities: builder.query<any, { page: number; limit: number }>({
      query: ({ page, limit }) => `admin/activities?page=${page}&limit=${limit}`,
      providesTags: ["Activity"],
    }),
    getActivityDetails: builder.query<any, number>({
      query: (id) => `admin/activities/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Activity", id }],
    }),
    deleteActivity: builder.mutation<any, number>({
      query: (id) => ({
        url: `admin/activities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Activity"],
    }),
  }),
});

export const { useGetActivitiesQuery, useGetActivityDetailsQuery, useDeleteActivityMutation } = activityApi;
