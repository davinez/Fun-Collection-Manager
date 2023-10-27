import type { TStateSlice } from "shared/types/store/store.types";

export type TFooSliceDefinition = {
	thud: string;
	waldo: string;
};

export type TFooSliceActions = {
	setThud: (value: string) => void;
	setWaldo: (value: string) => void;
};

export type TFooSlice = TFooSliceActions & TFooSliceDefinition;

const initialFooState: TFooSliceDefinition = {
	thud: "",
	waldo: "",
};

export const FooSlice: TStateSlice<TFooSlice> = (set) => ({
	...initialFooState,
	setThud: (value): void => {
		set((state) => {
			state.fooSlice.thud = value;
		});
	},
	setWaldo: (value): void => {
		set((state) => {
			state.fooSlice.waldo = value;
		});
	},
});
