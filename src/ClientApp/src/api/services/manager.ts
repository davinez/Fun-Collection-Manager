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
  TGetAllIcons,
  TDeleteCollectionPayload,
  TCollectionUpdateIconFormPayload,
  TGetBookmarksParams,
  TCollectionAddExtrasPayload
} from "@/shared/types/api/manager.types";
import type { TApiResponse } from "@/shared/types/api/api-responses.types";
import { useQuery, useMutation } from '@tanstack/react-query';
import { useApiClient, type TApi } from "@/api/useApiClient";
import queryClient from "@/api/query-client";
import { API_BASE_URL_MANAGER } from "shared/config";


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
  const apiClient = useApiClient(API_BASE_URL_MANAGER);
  return useQuery({
    queryKey: ["collection-groups"],
    queryFn: async () => {
      const response = await apiClient.get<TApiResponse<TGetCollectionGroups>>("/collections/by-groups");
      return response.data.data
    }
  });
}

/**
* Calls the API with the useQuery hook providing access query.isError, query.error.message, 
* query.isLoading, query.isFetching, and query.data to get the state of our request
* and also subscribing to the query key
* @param id collection group id
* @returns returns the collection group
*/
export const useGetGroupByIdQuery = (id: number) => {
  const apiClient = useApiClient(API_BASE_URL_MANAGER);
  return useQuery({
    queryKey: ["group", id],
    queryFn: async () => {
      const response = await apiClient.get<TApiResponse<TGroupInfo>>(`/collection-groups/${id}`);
      return response.data.data
    },
  });
}

/**
* Calls the API with queryClient.fetchQuery, this is an imperative way to fetch data. 
* It will either resolve with the data or throw with the error. 
* Imperative data fetching means you write code to explicitly request and handle data based on your query. And in the case of
* useQuery hook difference, it will try to fetch immediately data without having access to fetch state like query.isLoading, query.isFetching, etc
* https://tanstack.com/query/latest/docs/reference/QueryClient/#queryclientfetchquery
* @param id collection group id
* @returns returns the collection group
*/
export const useGetGroupByIdFetchQuery = async (id: number) => {
  const apiClient = useApiClient(API_BASE_URL_MANAGER);
  return await queryClient.fetchQuery({
    queryKey: ["group", id],
    queryFn: async () => {
      const response = await apiClient.get<TApiResponse<TGroupInfo>>(`/collection-groups/${id}`);
      return response.data.data
    }
  });
}


/**
* Calls the API with queryClient.fetchQuery, this is an imperative way to fetch data. 
* It will either resolve with the data or throw with the error. 
* Imperative data fetching means you write code to explicitly request and handle data based on your query. And in the case of
* useQuery hook difference, it will try to fetch immediately data without having access to fetch state like query.isLoading, query.isFetching, etc
* https://tanstack.com/query/latest/docs/reference/QueryClient/#queryclientfetchquery
* @param id collection id
* @returns returns the collection 
*/
export const getCollectionByIdQueryFetchQuery = async (apiClient: TApi, id: number) => {
  return await queryClient.fetchQuery({
    queryKey: ["collection", id],
    queryFn: async () => {
      const response = await apiClient.get<TApiResponse<TCollectionInfo>>(`/collections/${id}`);
      return response.data.data
    }
  });
}

export const useGetAllBookmarksQuery = ({ page, pageLimit, filterType, debounceSearchValue }: TGetBookmarksParams) => {
  const apiClient = useApiClient(API_BASE_URL_MANAGER);
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
  const apiClient = useApiClient(API_BASE_URL_MANAGER);
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

export const useGetAllIconsQuery = () => {
  const apiClient = useApiClient(API_BASE_URL_MANAGER);
  return useQuery({
    queryKey: ["all-icons"],
    queryFn: async () => {
      const response = await apiClient.get<TApiResponse<TGetAllIcons>>("/icons");
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
  const apiClient = useApiClient(API_BASE_URL_MANAGER);
  return useMutation({
    mutationFn: async ({ collectionId, payload }: TuseAddURLMutationVariables) => {
      const response = await apiClient.post<TApiResponse>(`/manager/collections/${collectionId}`, payload);
      return response.data;
    },
  });
}

export const useAddGroupMutation = () => {
  const apiClient = useApiClient(API_BASE_URL_MANAGER);
  return useMutation({
    mutationFn: async (payload: TGroupAddPayload) => {
      const response = await apiClient.post<TApiResponse>("/collection-groups", payload);
      return response.data;
    },
  });
}

type TuseUpdateGroupMutationVariables = {
  groupId: number;
  payload: TGroupUpdatePayload;
}

export const useUpdateGroupMutation = () => {
  const apiClient = useApiClient(API_BASE_URL_MANAGER);
  return useMutation({
    mutationFn: async ({ groupId, payload }: TuseUpdateGroupMutationVariables) => {
      const response = await apiClient.patch<TApiResponse>(`/collection-groups/${groupId}`, payload);
      return response.data;
    },
  });
}

export const useDeleteGroupMutation = () => {
  const apiClient = useApiClient(API_BASE_URL_MANAGER);
  return useMutation({
    mutationFn: async (payload: TDeleteGroupPayload) => {
      const response = await apiClient.delete<TApiResponse>(`/collection-groups/${payload.groupId}`);
      return response.data;
    },
  });
}

type TuseUpdateBookmarkMutationVariables = {
  bookmarkId: number;
  payload: TBookmarkUpdatePayload;
}

export const useUpdateBookmarkMutation = () => {
  const apiClient = useApiClient(API_BASE_URL_MANAGER);
  return useMutation({
    mutationFn: async ({ bookmarkId, payload }: TuseUpdateBookmarkMutationVariables) => {
      const response = await apiClient.patch<TApiResponse>(`/manager/bookmarks/${bookmarkId}`, payload);
      return response.data;
    },
  });
}

export const useDeleteBookmarkMutation = () => {
  const apiClient = useApiClient(API_BASE_URL_MANAGER);
  return useMutation({
    mutationFn: async (payload: TBookmarkDeletePayload) => {
      const response = await apiClient.delete<TApiResponse>('/manager/bookmarks', payload);
      return response.data;
    },
  });
}

type TusePatchCollectionMutationVariables = {
  collectionId: number;
  payload: TCollectionUpdateFormPayload;
}

export const usePatchCollectionMutation = () => {
  const apiClient = useApiClient(API_BASE_URL_MANAGER);
  return useMutation({
    mutationFn: async ({ collectionId, payload }: TusePatchCollectionMutationVariables) => {
      const response = await apiClient.patch<TApiResponse>(`/collections/${collectionId}`,
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
  const apiClient = useApiClient(API_BASE_URL_MANAGER);
  return useMutation({
    mutationFn: async ({ collectionId, payload }: TuseUpdateCollectionIconMutationVariables) => {
      const response = await apiClient.patch<TApiResponse>(`/collections/${collectionId}/icon`,
        payload
      );
      return response.data;
    },
  });
}

export const useAddCollectionMutation = () => {
  const apiClient = useApiClient(API_BASE_URL_MANAGER);
  return useMutation({
    mutationFn: async (payload: TCollectionAddFormPayload & TCollectionAddExtrasPayload) => {
      const response = await apiClient.post<TApiResponse>('/collections', payload);
      return response.data;
    },
  });
}

export const useDeleteCollectionMutation = () => {
  const apiClient = useApiClient(API_BASE_URL_MANAGER);
  return useMutation({
    mutationFn: async (payload: TDeleteCollectionPayload) => {
      const response = await apiClient.delete<TApiResponse>(`/collections/${payload.collectionId}`);
      return response.data;
    },
  });
}







