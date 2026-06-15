import { apiSlice } from "../apiSlice";

export const giftApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGifts: builder.query<any, { page: number; limit: number }>({
      query: ({ page, limit }) => `admin/gifts?page=${page}&limit=${limit}`,
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
  }),
});

export const { useGetGiftsQuery, useGetGiftDetailsQuery, useDeleteGiftMutation } = giftApi;
