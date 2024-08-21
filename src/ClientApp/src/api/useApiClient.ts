// General
import { useNavigate } from "react-router-dom";
import axios, { type AxiosResponse, AxiosRequestConfig } from "axios";
import { useStore } from "@/store/UseStore";
import type { TApiErrorResponse } from "@/shared/types/api/api-responses.types";
import { useMsal } from "@azure/msal-react";
import {
  InteractionRequiredAuthError,
} from "@azure/msal-browser";
import { managerAPIRequest } from "@/shared/config";


export const defaultHandlerApiError = (error: Error | unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.code === undefined || error.code.includes("5") || error.code === "ERR_NETWORK") {
      console.error("Unknown server error or failed connection");
      return;
    }
 
    if (error.response) {
      // TODO: Check possible responses, from api response or axios generic
      if (Object.keys(error.response.data).length > 0) {
        console.error((error.response.data as TApiErrorResponse).error.message);
        return;
      }

      console.error(error.message);
      return;
    }
  }

  if (error instanceof Error) {
    console.error(`General error: ${error.name} ${error.message}`);
    return;
  }

  console.error(`Unknown Error: ${error}`);
}

interface AxiosRetryConfig extends AxiosRequestConfig {
  _retry: boolean;
}

export type TApi = {
  get: <T>(url: string, parameters?: object) => Promise<AxiosResponse<T, unknown>>;
  post: <T>(url: string, data: object, parameters?: object) => Promise<AxiosResponse<T, unknown>>;
  patchForm: <T>(url: string, data: object, parameters?: object) => Promise<AxiosResponse<T, unknown>>;
  patch: <T>(url: string, data: object, parameters?: object) => Promise<AxiosResponse<T, unknown>>;
  delete: <T>(url: string, data?: object, parameters?: object) => Promise<AxiosResponse<T, unknown>>;
}

export const useApiClient = (baseURL: string): TApi => {
  // Hooks
  const navigate = useNavigate();
  const { authSlice } = useStore();
  const { instance } = useMsal();
  const apiClientAxios = axios.create({
    baseURL,
  });

  // Add interceptors
  /*
  // Check scopes for user-api
      const tokenRequest = {
        account: activeAccount,
        scopes: loginRequest.scopes,
      };

      // Acquire an access token active account already exists 
      instance
        .acquireTokenSilent(tokenRequest)
        .then((loginResponse) => {
          // Update / Set again user data
          authSlice.setLoginUser({
            localAccountId: loginResponse.account.localAccountId,
            homeAccountId: loginResponse.account.homeAccountId,
            username: loginResponse.account.username,
            userEmail: "email placeholder obtener de claims",
            userScopes: loginResponse.scopes,
            accessToken: loginResponse.accessToken,
          });

          navigate("/my/manager/dashboard");
        })
        .catch(async (error) => {
          defaultHandlerApiError(error);
          onOpenFailedLoginAlert();
        });

  */
  apiClientAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest: AxiosRetryConfig = error.config;
      // If the error status is 401 and there is no originalRequest._retry flag,
      // it means the token has expired and we need to refresh it
      if (error.code !== "ERR_NETWORK" && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const activeAccount = instance.getActiveAccount();

        try {
          if (activeAccount === null) {
            navigate("/");
            return;
          }

          const tokenRequest = {
            account: activeAccount,
            scopes: [...managerAPIRequest.scopes]
          };

          const requestResponse = await instance.acquireTokenSilent(tokenRequest);
          authSlice.setAccessToken(requestResponse.accessToken);

          // Retry the original request with the new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${requestResponse.accessToken}`;
          }

          return axios(originalRequest);
        } catch (error) {
          // Catch interaction_required errors and call interactive method to resolve
          if (error instanceof InteractionRequiredAuthError && activeAccount !== null) {
            originalRequest._retry = true;

            const tokenRequest = {
              account: activeAccount,
              scopes: [],
            };
            try {
              // Before Retry the original request a new login is required to update access and refresh tokens
              const requestResponse = await instance.acquireTokenPopup(tokenRequest);
              authSlice.setAccessToken(requestResponse.accessToken);

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${requestResponse.accessToken}`;
              }

              return axios(originalRequest);
            } catch (error) {
              defaultHandlerApiError(error);
              authSlice.logout();
              instance.clearCache();
              navigate("/");
            }


          } else {
            defaultHandlerApiError(error);
            authSlice.logout();
            instance.clearCache();
            navigate("/");
          }

        }
      }

      return Promise.reject(error);
    },
  )

  return {
    get: <T>(url: string, parameters?: object) =>
      apiClientAxios.get<T>(url, {
        headers: {
          Authorization: `Bearer ${authSlice.accessToken}`,
        },
        params: parameters,
      }),
    post: <T>(url: string, data: object, parameters?: object) =>
      apiClientAxios.post<T>(url, data, {
        headers: {
          Authorization: `Bearer ${authSlice.accessToken}`,
        },
        params: parameters,
      }),
    patchForm: <T>(url: string, data: object, parameters?: object) =>
      apiClientAxios.patchForm<T>(url, data, {
        headers: {
          Authorization: `Bearer ${authSlice.accessToken}`,
        },
        params: parameters,
      }),
    patch: <T>(url: string, data: object, parameters?: object) =>
      apiClientAxios.patch<T>(url, data, {
        headers: {
          Authorization: `Bearer ${authSlice.accessToken}`,
        },
        params: parameters,
      }),
    delete: <T>(url: string, data?: object, parameters?: object) =>
      apiClientAxios.delete<T>(url, {
        headers: {
          Authorization: `Bearer ${authSlice.accessToken}`,
        },
        params: parameters,
        data
      }),
  };
}

// https://stackoverflow.com/questions/55299383/better-aproach-for-destructing-custom-react-hooks-with-multiple-returns

//export default useApiClient;


