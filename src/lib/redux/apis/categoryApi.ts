/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<any, { page: number; limit: number }>({
      query: ({ page, limit }) => `admin/categories?page=${page}&limit=${limit}`,
      providesTags: ["Category"],
    }),
    getSubCategories: builder.query<any, { category_id: number; page: number; limit: number }>({
      query: ({ category_id, page, limit }) => 
        `admin/sub-categories?category_id=${category_id}&page=${page}&limit=${limit}`,
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `admin/categories`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),
    createSubCategory: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `admin/sub-categories`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),
    toggleCategoryStatus: builder.mutation<any, number>({
      query: (id) => ({
        url: `admin/categories/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const { 
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
  useCreateCategoryMutation, 
  useCreateSubCategoryMutation,
  useToggleCategoryStatusMutation 
} = categoryApi;
