import { api } from "./api";
import type { UseQueryOptions } from "react-query";
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "react-query";
import type { QueryFunctionContext } from "react-query/types/core/types";
import type { AxiosError, AxiosResponse } from "axios";
import type { GetInfinitePagesInterface } from "../interfaces";

type QueryKeyT = [string, object | undefined];

export const fetcher = <T>({
	queryKey,
	pageParam,
}: QueryFunctionContext<QueryKeyT>): Promise<T> => {
	const [url, parameters] = queryKey;
	return api
		.get<T>(url, { params: { ...parameters, pageParam } })
		.then((res) => res.data);
};

export const useLoadMore = <T>(url: string | null, parameters?: object) => {
	const context = useInfiniteQuery<
		GetInfinitePagesInterface<T>,
		Error,
		GetInfinitePagesInterface<T>,
		QueryKeyT
	>(
		[url!, parameters],
		({ queryKey, pageParam: pageParameter = 1 }) =>
			fetcher({ queryKey, pageParam: pageParameter }),
		{
			getPreviousPageParam: (firstPage) => firstPage.previousId ?? false,
			getNextPageParam: (lastPage) => {
				return lastPage.nextId ?? false;
			},
		}
	);

	return context;
};

export const usePrefetch = <T>(url: string | null, parameters?: object) => {
	const queryClient = useQueryClient();

	return () => {
		if (!url) {
			return;
		}

		queryClient.prefetchQuery<T, Error, T, QueryKeyT>(
			[url, parameters],
			({ queryKey }) => fetcher({ queryKey })
		);
	};
};

export const useFetch = <T>(
	url: string | null,
	parameters?: object,
	config?: UseQueryOptions<T, Error, T, QueryKeyT>
) => {
	const context = useQuery<T, Error, T, QueryKeyT>(
		[url!, parameters],
		({ queryKey }) => fetcher({ queryKey }),
		{
			enabled: !!url,
			...config,
		}
	);

	return context;
};

const useGenericMutation = <T, S>(
	fn: (data: T | S) => Promise<AxiosResponse<S>>,
	url: string,
	parameters?: object,
	updater?: ((oldData: T, newData: S) => T) | undefined
) => {
	const queryClient = useQueryClient();

	return useMutation<AxiosResponse, AxiosError, T | S>(fn, {
		onMutate: async (data) => {
			await queryClient.cancelQueries([url, parameters]);

			const previousData = queryClient.getQueryData([url, parameters]);

			queryClient.setQueryData<T>([url, parameters], (oldData) => {
				return updater ? updater(oldData!, data as S) : (data as T);
			});

			return previousData;
		},
		onError: (error, _, context) => {
			queryClient.setQueryData([url, parameters], context);
		},
		onSettled: () => {
			queryClient.invalidateQueries([url, parameters]);
		},
	});
};

export const useDelete = <T>(
	url: string,
	parameters?: object,
	updater?: (oldData: T, id: string | number) => T
) => {
	return useGenericMutation<T, string | number>(
		(id) => api.delete(`${url}/${id}`),
		url,
		parameters,
		updater
	);
};

export const usePost = <T, S>(
	url: string,
	parameters?: object,
	updater?: (oldData: T, newData: S) => T
) => {
	return useGenericMutation<T, S>(
		(data) => api.post<S>(url, data),
		url,
		parameters,
		updater
	);
};

export const useUpdate = <T, S>(
	url: string,
	parameters?: object,
	updater?: (oldData: T, newData: S) => T
) => {
	return useGenericMutation<T, S>(
		(data) => api.patch<S>(url, data),
		url,
		parameters,
		updater
	);
};
