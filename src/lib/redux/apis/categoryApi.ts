/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<any, { page: number; limit: number }>({
      query: ({ page, limit }) => `admin/categories?page=${page}&limit=${limit}`,
      providesTags: ["Category"],
    }),
    getAllCategories: builder.query<any, void>({
      query: () => `admin/categories/all`,
      providesTags: ["Category"],
    }),
    getAllSubCategories: builder.query<any, number>({
      query: (category_id) => `admin/sub-categories/${category_id}`,
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
    updateCategory: builder.mutation<any, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `admin/categories/${id}`,
        method: "PUT",
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
    toggleSubCategoryStatus: builder.mutation<any, number>({
      query: (id) => ({
        url: `admin/sub-categories/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["Category"],
    }),
    updateSubCategory: builder.mutation<any, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `admin/sub-categories/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const { 
  useGetCategoriesQuery,
  useGetAllCategoriesQuery,
  useGetSubCategoriesQuery,
  useGetAllSubCategoriesQuery,
  useCreateCategoryMutation, 
  useCreateSubCategoryMutation,
  useUpdateCategoryMutation,
  useUpdateSubCategoryMutation,
  useToggleCategoryStatusMutation,
  useToggleSubCategoryStatusMutation
} = categoryApi;
