import { apiSlice } from "../apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<any, { page: number; limit: number }>({
      query: ({ page, limit }) => `admin/notifications?page=${page}&limit=${limit}`,
      providesTags: ["Notification"],
    }),
    viewNotification: builder.query<any, number>({
      query: (id) => `admin/notifications/${id}/view`,
      providesTags: (_result, _error, id) => [{ type: "Notification", id }],
    }),
    approveNotification: builder.mutation<any, number>({
      query: (id) => ({
        url: `admin/notifications/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
    rejectNotification: builder.mutation<any, number>({
      query: (id) => ({
        url: `admin/notifications/${id}/reject`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const { 
  useGetNotificationsQuery, 
  useViewNotificationQuery, 
  useApproveNotificationMutation, 
  useRejectNotificationMutation 
} = notificationApi;
