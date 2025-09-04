import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (replaces cacheTime in v5)
      retry: (failureCount, error) => {
        if (
          error?.message?.includes("401") ||
          error?.message?.includes("authentication")
        ) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    },
    mutations: {
      retry: (failureCount, error) => {
        if (
          error?.message?.includes("400") ||
          error?.message?.includes("422")
        ) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});
