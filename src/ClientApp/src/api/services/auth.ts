import type {
  TCreateUserAccountPayload,
  TUserAccount
} from "@/shared/types/api/auth.types";
import type { TApiResponse } from "@/shared/types/api/api-responses.types";
import { useMutation } from '@tanstack/react-query';
import { useApiClient, type TApi } from "@/api/useApiClient";
import queryClient from "@/api/query-client";
import { API_BASE_URL_AUTH } from "shared/config";

// Currently not implemented due to entra id external implementation for login
// export const useLoginMutation = () => {
//   const apiClient = useApiClient(API_BASE_URL);
//   return useMutation({
//     mutationFn: async (payload: TLoginPayload) => {
//       const apiResponse = await apiClient.post<TApiResponse<TLoginResponse>>("/auth/login", payload);
//       return apiResponse.data
//     },
//   });
// }

export const getUserAccountByIdPFetchQuery = async (apiClient: TApi,identityProviderId: string, skipCache = false) => {
  if(skipCache) { 	queryClient.invalidateQueries({ queryKey: ["userAccount"] }); }

  return await queryClient.fetchQuery({
    queryKey: ["userAccount", identityProviderId],
    queryFn: async () => {
      const response = await apiClient.get<TApiResponse<TUserAccount | undefined>>("/accounts",
          {
            identity_provider_id: identityProviderId,
          }
      );
      return response.data.data
    }
  });
}

export const useCreateUserAccountMutation = () => {
    const apiClient = useApiClient(API_BASE_URL_AUTH);
    return useMutation({
      mutationFn: async (payload: TCreateUserAccountPayload) => {
        const apiResponse = await apiClient.post<TApiResponse>("/accounts", payload);
        return apiResponse.data
      },
    });
  }



