import { apiSlice } from "../apiSlice";
import type { ActivityDetailResponse, ActivitiesResponse } from "@/types/activity";

export const activityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActivities: builder.query<ActivitiesResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => `admin/activities?page=${page}&limit=${limit}`,
      providesTags: ["Activity"],
    }),
    getActivityDetails: builder.query<ActivityDetailResponse, number>({
      query: (id) => `admin/activities/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Activity", id }],
    }),
    deleteActivity: builder.mutation<void, number>({
      query: (id) => ({
        url: `admin/activities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Activity"],
    }),
  }),
});

export const { useGetActivitiesQuery, useGetActivityDetailsQuery, useDeleteActivityMutation } = activityApi;
