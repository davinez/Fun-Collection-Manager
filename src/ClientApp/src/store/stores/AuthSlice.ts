import type { TStateSlice } from "shared/types/store/store.types";
import type {
  AccountIdentifiers,
  TLoginResponse
} from "@/shared/types/api/auth.types";

export type TAuthSliceDefinition = {
  hasHydrated: boolean;
  accountIdentifiers: AccountIdentifiers;
  userEmail: string | undefined;
  userScopes: string[] | undefined;
  accessToken: string | undefined;
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
  accountIdentifiers: {
    localAccountId:  undefined,
    homeAccountId: undefined,
    username: undefined
  },
  userEmail: undefined,
  userScopes: undefined,
  accessToken: undefined,
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
      state.authSlice.accountIdentifiers = {
        localAccountId: undefined,
        homeAccountId: undefined,
        username: undefined
      }
      state.authSlice.userEmail = undefined;
      state.authSlice.userScopes = undefined;
      state.authSlice.accessToken = undefined;
    }),
  setLoginUser: (payload: TLoginResponse): void =>
    set((state) => {
      state.authSlice = {
        ...state.authSlice,
        accountIdentifiers: {
          localAccountId: payload.localAccountId,
          homeAccountId: payload.homeAccountId,
          username: payload.username
        },
        userEmail: payload.userEmail,
        userScopes: payload.userScopes,
        accessToken: payload.accessToken
      };
    }),
});
