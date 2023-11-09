import type {
  TCategory
} from "@/shared/types/api/manager.types";
import type { TApiResponse } from "@/shared/types/api/api-responses.types";
import { useQuery, useMutation, type UseQueryResult, type UseMutationResult } from '@tanstack/react-query';
import apiClient from "@/hooks/UseApiClient"

const API_BASE_URL = "http://localhost:8080/api";

const $apiClient = apiClient(API_BASE_URL);

export const QUERY_CATEGORIES_KEY = 'categories';

/*
A query function / queryFn can be literally any function that returns a promise.
The promise that is returned should either resolve the data or throw an error.
*/

 /*
  The key you provide ('QUERY_CATEGORIES_KEY') is used as the identifier for this cache.
  If useQuery is called again with the same key while the data is still in the cache,
  React Query will return the cached data instead of performing a new fetch.
 */

export const useGetUserQuery = (): UseQueryResult<TApiResponse, unknown> => {
return useQuery({
  queryKey: [QUERY_CATEGORIES_KEY],
  queryFn: async () => {
   const apiResponse = await $apiClient.get<TApiResponse>("/manager/categories");
   return apiResponse.data
  },
  staleTime: 20_000,
});
}

export const useAddCategoryMutation = (newCategory: TCategory): UseMutationResult<TApiResponse, unknown, void, unknown> => {
  return useMutation({
    mutationFn: async () => {
      const apiResponse = await $apiClient.post<TApiResponse>("/manager/categories", newCategory);
      return apiResponse.data;
  },
  });
}


