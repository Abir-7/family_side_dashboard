import { apiSlice } from "../apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<any, void>({
        query: () => `admin/dashboard/overview`,
    }),
    getDashboardChartData: builder.query<any, { tab: string; timeframe: string }>({
        query: ({ tab, timeframe }) => `admin/dashboard/chart?tab=${tab}&timeframe=${timeframe}`,
    }),
  }),
});

export const { useGetDashboardOverviewQuery, useGetDashboardChartDataQuery } = dashboardApi;
