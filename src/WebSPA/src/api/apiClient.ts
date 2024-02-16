import axios, { type AxiosResponse } from "axios";
import { useStore } from "@/store/UseStore";
import type { TApiErrorResponse } from "@/shared/types/api/api-responses.types";

export const getApiErrors = (error: Error | unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.code === undefined || error.code.includes("5") || error.code === "ERR_NETWORK") {
      return undefined;
    }

    if (error.response)
      // Check response possible undefined error
      return (error.response.data as TApiErrorResponse).error.errors;
  }

  return undefined;
}

export const defaultHandlerApiError = (error: Error | unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.code === undefined || error.code.includes("5") || error.code === "ERR_NETWORK") {
      console.error("Unknown server error or failed connection");
      return;
    }

    if (error.response)
      // Check response possible undefined error
      console.error((error.response.data as TApiErrorResponse).error.message);

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
  post: <T>(url: string, data: object, parameters?: object) => Promise<AxiosResponse<T, unknown>>;
  patch: <T>(url: string, data: object, parameters?: object) => Promise<AxiosResponse<T, unknown>>;
  delete: <T>(url: string, data?: object, parameters?: object) => Promise<AxiosResponse<T, unknown>>;
}

const apiClient = (baseURL: string): TApi => {
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
        params: parameters,
      }),
    post: <T>(url: string, data: object, parameters?: object) =>
      apiClient.post<T>(url, data, {
        headers: {
          token: authSlice.accessToken,
        },
        params: parameters,
      }),
    patch: <T>(url: string, data: object, parameters?: object) =>
      apiClient.patch<T>(url, data, {
        headers: {
          token: authSlice.accessToken,
        },
        params: parameters,
      }),
    delete: <T>(url: string, data?: object, parameters?: object) =>
      apiClient.delete<T>(url, {
        headers: {
          token: authSlice.accessToken,
        },
        params: parameters,
        data: {
          source: data
        }
      }),
  };
}

// https://stackoverflow.com/questions/55299383/better-aproach-for-destructing-custom-react-hooks-with-multiple-returns

export default apiClient;


