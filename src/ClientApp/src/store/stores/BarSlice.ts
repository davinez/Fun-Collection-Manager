import type { TStateSlice } from "shared/types/store/store.types";

export type TBarSliceDefinition = {
	baz: string;
	qux: string;
};

export type TBarSliceActions = {
	setBaz: (value: string) => void;
	setQux: (value: string) => void;
};

export type TBarSlice = TBarSliceActions & TBarSliceDefinition;

const initialBarState: TBarSliceDefinition = {
	baz: "",
	qux: "",
};

export const BarSlice: TStateSlice<TBarSlice> = (set) => ({
	...initialBarState,
	setBaz: (value): void => {
		set((state) => {
			state.barSlice.baz = value;
		});
	},
	setQux: (value): void => {
		set((state) => {
			state.barSlice.qux = value;
		});
	},
});
