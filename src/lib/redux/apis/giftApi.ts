/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../apiSlice";

export const giftApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGifts: builder.query<any, { page: number; limit: number; search?: string }>({
      query: ({ page, limit, search }) =>
        `admin/gifts?page=${page}&limit=${limit}${search ? `&search=${search}` : ""}`,
      providesTags: ["Gift"],
    }),
    getGiftDetails: builder.query<any, number>({
      query: (id) => `admin/gifts/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Gift", id }],
    }),
    deleteGift: builder.mutation<any, number>({
      query: (id) => ({
        url: `admin/gifts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Gift"],
    }),
    getAllGifts: builder.query<any, void>({
      query: () => `admin/gifts/all`,
    }),
    createGift: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `admin/gifts`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Gift"],
    }),
  }),
});

export const {
  useGetGiftsQuery,
  useGetGiftDetailsQuery,
  useGetAllGiftsQuery,
  useLazyGetAllGiftsQuery,
  useDeleteGiftMutation,
  useCreateGiftMutation,
} = giftApi;
