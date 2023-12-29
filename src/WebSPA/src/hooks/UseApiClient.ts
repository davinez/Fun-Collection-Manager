import axios, { type AxiosResponse, type AxiosError } from "axios";
import { useStore } from "@/store/UseStore";
import type { TApiResponse } from "@/shared/types/api/api-responses.types";

const isAxiosError = <T>(error: unknown): error is AxiosError<T> => {
  return axios.isAxiosError(error);
}

export const handleApiError = (error: Error | unknown) => {
  if (isAxiosError<TApiResponse>(error)) {
    if (error.code === undefined || error.code.includes("5") || error.code === "ERR_NETWORK") {
      console.error("Unknown error server or connection");
      return;
    }

    // Check response possible undefined error
    console.error(error.response?.data.messsage as string);
    return;
  }

  if (error instanceof Error) {
    console.error(`General error: ${error.name} ${error.message}`);
    return;
  }

  console.error("Unknown Error");
}

type TApi = {
  get: <T>(url: string, parameters?: object) => Promise<AxiosResponse<T, unknown>>;
  post: <T>(url: string, data: object) => Promise<AxiosResponse<T, unknown>>;
  patch: <T>(url: string, data: object) => Promise<AxiosResponse<T, unknown>>;
  delete: <T>(url: string) => Promise<AxiosResponse<T, unknown>>;
}

const useApiClient = (baseURL: string): TApi => {
  // Use store outside of component
  const authSlice = useStore.getState().authSlice;
  const apiClient = axios.create({
    baseURL,
  });

  // Add interceptors



  return {
    get: <T>(url: string, parameters?: object) =>
      apiClient.get<T>(url, {
        headers: {
          token: authSlice.accessToken,
        },
        ...parameters,
      }),
    post: <T>(url: string, data: object) =>
      apiClient.post<T>(url, data, {
        headers: {
          token: authSlice.accessToken,
        },
      }),
    patch: <T>(url: string, data: object) =>
      apiClient.patch<T>(url, data, {
        headers: {
          token: authSlice.accessToken,
        },
      }),
    delete: <T>(url: string) =>
      apiClient.delete<T>(url, {
        headers: {
          token: authSlice.accessToken,
        },
      }),
  };
}

// https://stackoverflow.com/questions/55299383/better-aproach-for-destructing-custom-react-hooks-with-multiple-returns

export default useApiClient;


