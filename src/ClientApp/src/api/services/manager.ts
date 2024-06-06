import type {
  TGetCollectionGroups,
  TAddURLPayload,
  TGroupUpdatePayload,
  TGroupAddPayload,
  TDeleteGroupPayload,
  TBookmarkUpdatePayload,
  TBookmarkDeletePayload,
  TCollectionAddFormPayload,
  TCollectionUpdateFormPayload,
  TGroupInfo,
  TCollectionInfo,
  TGetAllBookmarks,
  TGetBookmarksByCollection,
  TGetCollectionsAllIcons,
  TDeleteCollectionPayload,
  TCollectionUpdateIconFormPayload,
  TGetBookmarksParams,
  TAddCollectionMutationParams
} from "@/shared/types/api/manager.types";
import type { TApiResponse } from "@/shared/types/api/api-responses.types";
import { useQuery, useMutation } from '@tanstack/react-query';
import { useApiClient } from "@/api/useApiClient";
import queryClient from "@/api/query-client";

const API_BASE_URL = "http://localhost:7000/api";

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
  const apiClient = useApiClient(API_BASE_URL);
  return useQuery({
    queryKey: ["collection-groups"],
    queryFn: async () => {
      const response = await apiClient.get<TApiResponse<TGetCollectionGroups>>("/manager/groups/collection-groups");
      return response.data.data
    }
  });
}

export const useGetGroupByIdQuery = (id: number) => {
  const apiClient = useApiClient(API_BASE_URL);
  return useQuery({
    queryKey: ["group", id],
    queryFn: async () => {
      const response = await apiClient.get<TApiResponse<TGroupInfo>>(`/manager/groups/${id}`);
      return response.data.data
    },
  });
}

export const useGetGroupByIdFetchQuery = async (id: number) => {
  const apiClient = useApiClient(API_BASE_URL);
  return await queryClient.fetchQuery({
    queryKey: ["group", id],
    queryFn: async () => {
      const response = await apiClient.get<TApiResponse<TGroupInfo>>(`/manager/groups/${id}`);
      return response.data.data
    }
  });
}

export const useGetCollectionByIdQueryClientAsync = async (id: number) => {
  const apiClient = useApiClient(API_BASE_URL);
  return await queryClient.fetchQuery({
    queryKey: ["collection", id],
    queryFn: async () => {
      const response = await apiClient.get<TApiResponse<TCollectionInfo>>(`/manager/collections/${id}`);
      return response.data.data
    }
  });
}

export const useGetAllBookmarksQuery = ({ page, pageLimit, filterType, debounceSearchValue }: TGetBookmarksParams) => {
  const apiClient = useApiClient(API_BASE_URL);
  return useQuery({
    queryKey: ["all-bookmarks", { currentPage: page, debounceSearchValue }],
    queryFn: async () => {
      const response = await apiClient.get<TApiResponse<TGetAllBookmarks>>('/manager/collections/bookmarks',
        debounceSearchValue.length !== 0 ?
          {
            page: page,
            page_limit: pageLimit,
            filter_type: filterType,
            search_value: debounceSearchValue
          } :
          {
            page: page,
            page_limit: pageLimit
          }
      );
      return response.data.data
    }
  });
}

export const useGetBookmarksByCollectionQuery = ({ page, pageLimit, filterType, debounceSearchValue }: TGetBookmarksParams, collectionId: string) => {
  const apiClient = useApiClient(API_BASE_URL);
  return useQuery({
    queryKey: ["collection-bookmarks", { currentPage: page, debounceSearchValue }],
    queryFn: async () => {
      const response = await apiClient.get<TApiResponse<TGetBookmarksByCollection>>(`/manager/collections/${collectionId}/bookmarks`,
        debounceSearchValue.length !== 0 ?
          {
            page: page,
            page_limit: pageLimit,
            filter_type: filterType,
            search_value: debounceSearchValue
          } :
          {
            page: page,
            page_limit: pageLimit
          }
      );
      return response.data.data
    }
  });
}

export const useGetCollectionsAllIconsQuery = () => {
  const apiClient = useApiClient(API_BASE_URL);
  return useQuery({
    queryKey: ["collections-all-icons"],
    queryFn: async () => {
      const response = await apiClient.get<TApiResponse<TGetCollectionsAllIcons>>("/manager/collections/icons");
      return response.data.data
    }
  });
}

/***** Mutations *****/


// MutationFunction takes only one parameter called variables.
type TuseAddURLMutationVariables = {
  collectionId: number;
  payload: TAddURLPayload;
}

export const useAddURLMutation = () => {
  const apiClient = useApiClient(API_BASE_URL);
  return useMutation({
    mutationFn: async ({ collectionId, payload }: TuseAddURLMutationVariables) => {
      const response = await apiClient.post<TApiResponse>(`/manager/collections/${collectionId}`, payload);
      return response.data;
    },
  });
}

export const useAddGroupMutation = () => {
  const apiClient = useApiClient(API_BASE_URL);
  return useMutation({
    mutationFn: async (payload: TGroupAddPayload) => {
      const response = await apiClient.post<TApiResponse>(`/manager/groups`, payload);
      return response.data;
    },
  });
}

type TuseUpdateGroupMutationVariables = {
  groupId: number;
  payload: TGroupUpdatePayload;
}

export const useUpdateGroupMutation = () => {
  const apiClient = useApiClient(API_BASE_URL);
  return useMutation({
    mutationFn: async ({ groupId, payload }: TuseUpdateGroupMutationVariables) => {
      const response = await apiClient.patch<TApiResponse>(`/manager/groups/${groupId}`, payload);
      return response.data;
    },
  });
}

export const useDeleteGroupMutation = () => {
  const apiClient = useApiClient(API_BASE_URL);
  return useMutation({
    mutationFn: async (payload: TDeleteGroupPayload) => {
      const response = await apiClient.delete<TApiResponse>(`/manager/groups/${payload.groupId}`);
      return response.data;
    },
  });
}

type TuseUpdateBookmarkMutationVariables = {
  bookmarkId: number;
  payload: TBookmarkUpdatePayload;
}

export const useUpdateBookmarkMutation = () => {
  const apiClient = useApiClient(API_BASE_URL);
  return useMutation({
    mutationFn: async ({ bookmarkId, payload }: TuseUpdateBookmarkMutationVariables) => {
      const response = await apiClient.patch<TApiResponse>(`/manager/bookmarks/${bookmarkId}`, payload);
      return response.data;
    },
  });
}

export const useDeleteBookmarkMutation = () => {
  const apiClient = useApiClient(API_BASE_URL);
  return useMutation({
    mutationFn: async (payload: TBookmarkDeletePayload) => {
      const response = await apiClient.delete<TApiResponse>('/manager/bookmarks', payload);
      return response.data;
    },
  });
}

type TuseUpdateCollectionMutationVariables = {
  collectionId: number;
  payload: TCollectionUpdateFormPayload;
}

export const useUpdateCollectionMutation = () => {
  const apiClient = useApiClient(API_BASE_URL);
  return useMutation({
    mutationFn: async ({ collectionId, payload }: TuseUpdateCollectionMutationVariables) => {
      const response = await apiClient.patch<TApiResponse>(`/manager/collections/${collectionId}`,
        payload
      );
      return response.data;
    },
  });
}

type TuseUpdateCollectionIconMutationVariables = {
  collectionId: number;
  payload: TCollectionUpdateIconFormPayload;
}

export const useUpdateCollectionIconMutation = () => {
  const apiClient = useApiClient(API_BASE_URL);
  return useMutation({
    mutationFn: async ({ collectionId, payload }: TuseUpdateCollectionIconMutationVariables) => {
      const response = await apiClient.patch<TApiResponse>(`/manager/collections/${collectionId}/icon`,
        payload
      );
      return response.data;
    },
  });
}

type TuseAddCollectionMutationVariables = {
  params: TAddCollectionMutationParams;
  payload: TCollectionAddFormPayload;
}

export const useAddCollectionMutation = () => {
  const apiClient = useApiClient(API_BASE_URL);
  return useMutation({
    mutationFn: async ({ params, payload }: TuseAddCollectionMutationVariables) => {
      const response = await apiClient.post<TApiResponse>('/manager/collections',
        payload,
        { // Conditionally add object properties
          ...(params.groupId) && { group_id: params.groupId },
          ...(params.parentCollectionId) && { parent_collection_id: params.parentCollectionId }
        }
      );
      return response.data;
    },
  });
}

export const useDeleteCollectionMutation = () => {
  const apiClient = useApiClient(API_BASE_URL);
  return useMutation({
    mutationFn: async (payload: TDeleteCollectionPayload) => {
      const response = await apiClient.delete<TApiResponse>(`/manager/collections/${payload.collectionId}`);
      return response.data;
    },
  });
}







