import type { TStateSlice } from "shared/types/store/store.types";
import type { TUser } from "shared/types/dto/User.types";

export type TAuthSliceDefinition = {
	hasHydrated: boolean;
	user: null | TUser;
	accessToken: string | null;
	refreshToken: string | null;
	storage: string;
};

export type TAuthSliceActions = {
	setHasHydrated: (value: boolean) => void;
	setAccessToken: (token: string) => void;
	logout: () => void;
};

export type TAuthSlice = TAuthSliceDefinition & TAuthSliceActions;

const initialAuthSliceState: TAuthSliceDefinition = {
	hasHydrated: false,
	user: null,
	accessToken: "A",
	refreshToken: "A",
	storage: "A",
};

export const AuthSlice: TStateSlice<TAuthSlice> = (set) => ({
	...initialAuthSliceState,
	setHasHydrated: (value): void => {
		set((state) => {
			state.authSlice.hasHydrated = value;
		});
	},
	setAccessToken: (token): void => {
		set((state) => {
			state.authSlice.accessToken = token;
		});
	},
	logout: (): void => {
		// Logout user code
		set((state) => {
			state.authSlice.accessToken = null;
			state.authSlice.refreshToken = null;
			state.authSlice.user = null;
		});
	},
});
