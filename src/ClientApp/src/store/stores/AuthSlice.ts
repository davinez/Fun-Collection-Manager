import type { TStateSlice } from "shared/types/store/store.types";
import type {
  AccountIdentifiers,
  TLoginCIAMResponse
} from "@/shared/types/api/auth.types";

export type TAuthSliceDefinition = {
  hasHydrated: boolean;
  accountIdentifiers: AccountIdentifiers;
  userDisplayName: string | undefined;
  userEmail: string | undefined;
  userRoles: string[] | undefined;
  accessToken: string | undefined;
};

export type TAuthSliceActions = {
  setHasHydrated: (value: boolean) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  setLoginUser: (payload: TLoginCIAMResponse) => void;
};

export type TAuthSlice = TAuthSliceDefinition & TAuthSliceActions;

const initialAuthSliceState: TAuthSliceDefinition = {
  hasHydrated: false,
  accountIdentifiers: {
    localAccountId:  undefined,
    homeAccountId: undefined,
    username: undefined
  },
  userDisplayName: undefined,
  userEmail: undefined,
  userRoles: undefined,
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
      state.authSlice.userRoles = undefined;
      state.authSlice.accessToken = undefined;
    }),
  setLoginUser: (payload): void =>
    set((state) => {
      state.authSlice = {
        ...state.authSlice,
        accountIdentifiers: {
          localAccountId: payload.localAccountId,
          homeAccountId: payload.homeAccountId,
          username: undefined
        },
        userDisplayName: payload.userDisplayName,
        userEmail: payload.userEmail,
        userRoles: payload.userRoles,
        accessToken: payload.accessToken
      };
    }),
});
