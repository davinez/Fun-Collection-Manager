import type {
  TLoginPayload,
  TLoginResponse
} from "@/shared/types/api/auth.types";
import type { TApiResponse } from "@/shared/types/api/api-responses.types";
import { useMutation } from '@tanstack/react-query';
import { useApiClient } from "@/api/useApiClient";

const API_BASE_URL = "http://localhost:7000/api";

export const useLoginMutation = () => {
  const apiClient = useApiClient(API_BASE_URL);
  return useMutation({
    mutationFn: async (payload: TLoginPayload) => {
      const apiResponse = await apiClient.post<TApiResponse<TLoginResponse>>("/auth/loginn", payload);
      return apiResponse.data
    },
  });
}



