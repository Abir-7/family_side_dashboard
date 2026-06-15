/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../apiSlice";

export const tagApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query<any, { page: number; limit: number }>({
      query: ({ page, limit }) => `admin/tags?page=${page}&limit=${limit}`,
      providesTags: ["Tag"],
    }),
    createTag: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `admin/tags`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Tag"],
    }),
    updateTag: builder.mutation<any, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `admin/tags/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Tag"],
    }),
    toggleTagStatus: builder.mutation<any, number>({
      query: (id) => ({
        url: `admin/tags/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["Tag"],
    }),
  }),
});

export const { 
  useGetTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useToggleTagStatusMutation
} = tagApi;
