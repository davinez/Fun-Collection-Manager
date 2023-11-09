import type {
  TLoginPayload,
  TLoginResponse
} from "@/shared/types/api/auth.types";
import type { TApiResponse } from "@/shared/types/api/api-responses.types";
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import apiClient from "@/hooks/UseApiClient"

const API_BASE_URL = "http://localhost:7000/auth";

const $apiClient = apiClient(API_BASE_URL);

export const useSubmitLoginMutation = (): UseMutationResult<TApiResponse<TLoginResponse>, unknown, TLoginPayload, unknown> => {
  return useMutation({
    mutationFn: async (submitData: TLoginPayload) => {
      const apiResponse = await $apiClient.post<TApiResponse<TLoginResponse>>("/login", submitData);
      return apiResponse.data
  },
  });
}


