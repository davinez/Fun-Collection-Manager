import type {
  TSubmitLogin
} from "@/shared/types/api/auth.types";
import type { TApiResponse } from "@/shared/types/api/responses.types";
import { useMutation, type UseMutationResult } from "react-query";
import apiClient from "@/hooks/UseApiClient"

const API_BASE_URL = "http://localhost:8080/api";

const $apiClient = apiClient(API_BASE_URL);

export const useSubmitLoginMutation = (): UseMutationResult<TApiResponse, unknown, TSubmitLogin, unknown> => {
  return useMutation({
    mutationFn: async (submitData: TSubmitLogin) => {
      const apiResponse = await $apiClient.post<TApiResponse>("/auth/login", submitData);
      return apiResponse.data
  },
  });
}


