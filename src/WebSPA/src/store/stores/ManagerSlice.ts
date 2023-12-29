import type { TStateSlice } from "shared/types/store/store.types";
import { FormActionEnum } from "@/shared/types/global.types";

export type TManagerSliceDefinition = {
  groupModalFormAction: FormActionEnum;
  selectedSidebarGroup: number | undefined;
  selectedSidebarCollection: number | undefined;
};

export type TManagerSliceActions = {
  setGroupModalFormAction: (payload: FormActionEnum) => void;
  setSelectedSidebarGroup: (payload: number) => void;
  setSelectedSidebarCollection: (payload: number) => void;
};

export type TManagerSlice = TManagerSliceDefinition & TManagerSliceActions;

const initialManagerSliceState: TManagerSliceDefinition = {
  groupModalFormAction: FormActionEnum.Add,
  selectedSidebarGroup: undefined,
  selectedSidebarCollection: undefined
};

export const ManagerSlice: TStateSlice<TManagerSlice> = (set) => ({
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
  },
  setGroupModalFormAction: (payload): void => {
    set((state) => {
      state.managerSlice.groupModalFormAction = payload;
    });
  }
});