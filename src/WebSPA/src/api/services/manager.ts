import type {
  TNewCollection,
  TGetCollectionGroups,
  TAddURLPayload,
  TGroupUpdatePayload,
  TGroupAddPayload,
  TDeleteGroupPayload,
  TGroup
} from "@/shared/types/api/manager.types";
import type { TApiResponse } from "@/shared/types/api/api-responses.types";
import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from "@/hooks/UseApiClient";

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

/***** Queries *****/ 

export const useGetCollectionsQuery = () => {
  return useQuery({
    queryKey: ["collection-groups"],
    queryFn: async () => {
      const response = await $apiClient.get<TApiResponse<TGetCollectionGroups>>("/manager/groups/collection-groups");
      return response.data.data
    },
    staleTime: 20_000,
  });
}

// export const useGetCollectionsQuery = () => {
//   return useQuery({
//     queryKey: ["collection-groups"],
//     queryFn: () => {
//       throw new Error('Oh no!');
//       // const response = $apiClient.get<TApiResponse<TGetCollectionGroups>>("/manager/groups/collection-groups").then(s => s.data.data)
//       // return response
//     }
//   });
// }

export const useGetGroupByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["group", id],
    queryFn: async () => {
      const response = await $apiClient.get<TApiResponse<TGroup>>(`/manager/groups/${id}`);
      return response.data.data
    }
  });
}

/***** Mutations *****/ 

export const useAddCategoryMutation = () => {
  return useMutation({
    mutationFn: async (payload: TNewCollection) => {
      const response = await $apiClient.post<TApiResponse>("/manager/collection", payload);
      return response.data;
    },
  });
}

// MutationFunction takes only one parameter called variables.
type TuseAddURLMutationVariables = {
  collectionId: number;
  payload: TAddURLPayload;
}

export const useAddURLMutation = () => {
  return useMutation({
    mutationFn: async ({ collectionId, payload }: TuseAddURLMutationVariables) => {
      const response = await $apiClient.post<TApiResponse>(`/manager/collection/${collectionId}`, payload);
      return response.data;
    },
  });
}

export const useAddGroupMutation = () => {
  return useMutation({
    mutationFn: async (payload: TGroupAddPayload) => {
      const response = await $apiClient.post<TApiResponse>(`/manager/group`, payload);
      return response.data;
    },
  });
}

type TuseUpdateGroupMutationVariables = {
  groupId: number;
  payload: TGroupUpdatePayload;
}

export const useUpdateGroupMutation = () => {
  return useMutation({
    mutationFn: async ({ groupId, payload }: TuseUpdateGroupMutationVariables) => {
      const response = await $apiClient.patch<TApiResponse>(`/manager/group/${groupId}`, payload);
      return response.data;
    },
  });
}

export const useDeleteGroupMutation = () => {
  return useMutation({
    mutationFn: async (payload: TDeleteGroupPayload) => {
      const response = await $apiClient.delete<TApiResponse>(`/manager/group/${payload.groupId}`);
      return response.data;
    },
  });
}









