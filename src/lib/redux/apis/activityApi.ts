/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../apiSlice";
import type {
  ActivityDetailResponse,
  ActivitiesResponse,
} from "@/types/activity";

export const activityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActivities: builder.query<
      ActivitiesResponse,
      { page: number; limit: number; search?: string }
    >({
      query: ({ page, limit, search }) =>
        `admin/activities?page=${page}&limit=${limit}${search ? `&search=${search}` : ""}`,
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
    getAllActivities: builder.query<any, void>({
      query: () => `admin/activities/all`,
    }),
    createActivity: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `admin/activities`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Activity"],
    }),
  }),
});

export const {
  useGetActivitiesQuery,
  useGetActivityDetailsQuery,
  useGetAllActivitiesQuery,
  useLazyGetAllActivitiesQuery,
  useDeleteActivityMutation,
  useCreateActivityMutation,
} = activityApi;
