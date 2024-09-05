import { QueryClient } from '@tanstack/react-query';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: false,
      retry: false,
      // Set to infinity for app fucoma / single user purpose
      staleTime: Infinity,
      gcTime: 10*(60*1000), // 10 mins
    },
  },
});

export default queryClient;
