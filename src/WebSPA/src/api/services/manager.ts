import type {
  TNewCollection,
  TGetCollections
} from "@/shared/types/api/manager.types";
import type { TApiResponse } from "@/shared/types/api/api-responses.types";
import { useQuery, useMutation, type UseQueryResult, type UseMutationResult } from '@tanstack/react-query';
import apiClient from "@/hooks/UseApiClient"

const API_BASE_URL = "http://localhost:7000/api";

const $apiClient = apiClient(API_BASE_URL);

/*
A query function / queryFn can be literally any function that returns a promise.
The promise that is returned should either resolve the data or throw an error.
*/

/*
 The queryKey you provide is used as the identifier for this cache.
 If useQuery is called again with the same key while the data is still in the cache,
 React Query will return the cached data instead of performing a new fetch.
*/

export const useGetCollectionsQuery = (): UseQueryResult<TGetCollections[], unknown> => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => { 
      const apiResponse = $apiClient.get<TApiResponse<TGetCollections[]>>("/manager/collections").then((res) => {
        const result = res.data.data;
        return result;
      });      
     return apiResponse;
    },
    staleTime: 20_000,
  });
}

export const useAddCategoryMutation = (newCollection: TNewCollection): UseMutationResult<TApiResponse, unknown, void, unknown> => {
  return useMutation({
    mutationFn: async () => {
      const apiResponse = await $apiClient.post<TApiResponse>("/manager/collection", newCollection);
      return apiResponse.data;
    },
  });
}


