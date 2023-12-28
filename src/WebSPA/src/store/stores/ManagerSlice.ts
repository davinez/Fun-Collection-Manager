import type { TStateSlice } from "shared/types/store/store.types";

export type TManagerSliceDefinition = {
  selectedSidebarGroup: number | undefined;
  selectedSidebarCollection: number | undefined;
};

export type TManagerSliceActions = {
  setSelectedSidebarGroup: (payload: number) => void;
  setSelectedSidebarCollection: (payload: number) => void;
};

export type TManagerSlice = TManagerSliceDefinition & TManagerSliceActions;

const initialManagerSliceState: TManagerSliceDefinition = {
  selectedSidebarGroup: undefined,
  selectedSidebarCollection: undefined
};

export const AuthSlice: TStateSlice<TManagerSlice> = (set) => ({
  ...initialManagerSliceState,
  setSelectedSidebarGroup: (payload): void => {
    set((state) => {
      state.managerSlice.selectedSidebarGroup = payload;
    });
  },
  setSelectedSidebarCollection: (payload): void => {
    set((state) => {
      state.managerSlice.selectedSidebarCollection = payload;
    });
  }
});