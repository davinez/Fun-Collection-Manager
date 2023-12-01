import axios, {type AxiosResponse, type AxiosError} from "axios";
import { useStore } from "@/store/UseStore";

export const isAxiosError = <T>(error: unknown): error is AxiosError<T> => {
  return axios.isAxiosError(error);
}

type TApi = {
  get: <T>(url: string, parameters?: object) => Promise<AxiosResponse<T, unknown>>;
  post: <T>(url: string, data: object) => Promise<AxiosResponse<T, unknown>>;
  patch: <T>(url: string, data: object) => Promise<AxiosResponse<T, unknown>>;
  delete: <T>(url: string) => Promise<AxiosResponse<T, unknown>>;
}

const useApiClient = (baseURL: string): TApi =>
{
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

export default useApiClient;


