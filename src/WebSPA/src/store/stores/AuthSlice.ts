import type { TStateSlice } from "shared/types/store/store.types";
import type {
  TLoginResponse
} from "@/shared/types/api/auth.types";

export type TAuthSliceDefinition = {
  hasHydrated: boolean;
  username: string | undefined;
  userEmail: string | undefined;
  accessToken: string | undefined;
  refreshToken: string | undefined;
  storage: string;
};

export type TAuthSliceActions = {
  setHasHydrated: (value: boolean) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  setLoginUser: (payload: TLoginResponse) => void;
};

export type TAuthSlice = TAuthSliceDefinition & TAuthSliceActions;

const initialAuthSliceState: TAuthSliceDefinition = {
  hasHydrated: false,
  username: undefined,
  userEmail: undefined,
  accessToken: undefined,
  refreshToken: undefined,
  storage: "A",
};

export const AuthSlice: TStateSlice<TAuthSlice> = (set) => ({
  ...initialAuthSliceState,
  setHasHydrated: (value): void =>
    set((state) => {
      state.authSlice.hasHydrated = value;
    }),
  setAccessToken: (token): void =>
    set((state) => {
      state.authSlice.accessToken = token;
    }),
  logout: (): void =>
    // Logout user code
    set((state) => {
      state.authSlice.accessToken = undefined;
      state.authSlice.refreshToken = undefined;
      state.authSlice.username = undefined;
      state.authSlice.userEmail = undefined;
    }),
  setLoginUser: (payload: TLoginResponse): void =>
    set((state) => {
      state.authSlice = {
        ...state.authSlice,
        username: payload.userName,
        userEmail: payload.userEmail,
        accessToken: payload.token,
        refreshToken: payload.refreshtoken
      };
    }),
});
