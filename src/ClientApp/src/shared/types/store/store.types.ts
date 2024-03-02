import type { StateCreator } from "zustand";
import type { TBarSlice } from "@/store/stores/BarSlice";
import type { TFooSlice } from "@/store/stores/FooSlice";
import type { TAuthSlice } from "@/store/stores/AuthSlice";
import type { TManagerSlice } from "@/store/stores/ManagerSlice";

export type TCombinedStore = {
	authSlice: TAuthSlice;
	barSlice: TBarSlice;
	fooSlice: TFooSlice;
	managerSlice: TManagerSlice
};

export type TStateSlice<T> = StateCreator<
   TCombinedStore,
	[
		["zustand/persist", unknown],
		["zustand/immer", never],
		["zustand/devtools", never],
	],
	[],
	T
>;
