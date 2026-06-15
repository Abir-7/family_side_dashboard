/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, any>({
      query: (credentials) => ({
        url: `auth/admin/login`,
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
