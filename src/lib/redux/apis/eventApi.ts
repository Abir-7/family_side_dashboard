import { apiSlice } from "../apiSlice";

export const eventApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<any, { page: number; limit: number }>({
      query: ({ page, limit }) => `admin/events?page=${page}&limit=${limit}`,
      providesTags: ["Event"],
    }),
    getEventDetails: builder.query<any, number>({
      query: (id) => `admin/events/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Event", id }],
    }),
    deleteEvent: builder.mutation<any, number>({
      query: (id) => ({
        url: `admin/events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Event"],
    }),
  }),
});

export const { useGetEventsQuery, useGetEventDetailsQuery, useDeleteEventMutation } = eventApi;
