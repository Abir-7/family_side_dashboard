import { apiSlice } from "../apiSlice";
import type { EventDetailResponse, EventsResponse } from "@/types/event";

export const eventApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<EventsResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => `admin/events?page=${page}&limit=${limit}`,
      providesTags: ["Event"],
    }),
    getEventDetails: builder.query<EventDetailResponse, number>({
      query: (id) => `admin/events/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Event", id }],
    }),
    deleteEvent: builder.mutation<void, number>({
      query: (id) => ({
        url: `admin/events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Event"],
    }),
    createEvent: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `admin/events`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Event"],
    }),
  }),
});

export const { useGetEventsQuery, useGetEventDetailsQuery, useDeleteEventMutation, useCreateEventMutation } = eventApi;
