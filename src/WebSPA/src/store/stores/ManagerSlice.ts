import type { TStateSlice } from "shared/types/store/store.types";
import {
  FormActionEnum,
  SortEnum,
  ViewCollectionsEnum,
  ShowInBookmarkEnum,
} from "@/shared/types/global.types";


export type TManagerSliceDefinition = {
  groupModalFormAction: FormActionEnum;
  selectedSidebarGroup: number | undefined;
  selectedSidebarCollection: number | undefined;
  selectedSortValueCollectionFilter: string;
  selectedViewValueCollectionFilter: string;
  selectedShowInValueCollectionFilter: string[];
  selectedBookmarksCheckbox: number[];
  showHeadSelectOptions: boolean;
};

export type TManagerSliceActions = {
  setGroupModalFormAction: (payload: FormActionEnum) => void;
  setSelectedSidebarGroup: (payload: number) => void;
  setSelectedSidebarCollection: (payload: number) => void;
  setSelectedSortValueCollectionFilter: (payload: string) => void;
  setSelectedViewValueCollectionFilter: (payload: string) => void;
  setSelectedShowInValueCollectionFilter: (payload: string[]) => void;
  setSelectedBookmarksCheckbox: (payload: number[]) => void;
  setShowHeadSelectOptions: (payload: boolean) => void;
};

export type TManagerSlice = TManagerSliceDefinition & TManagerSliceActions;

const initialManagerSliceState: TManagerSliceDefinition = {
  groupModalFormAction: FormActionEnum.Add,
  selectedSidebarGroup: undefined,
  selectedSidebarCollection: undefined,
  selectedSortValueCollectionFilter: SortEnum.DateAsc,
  selectedViewValueCollectionFilter: ViewCollectionsEnum.Card,
  selectedShowInValueCollectionFilter: [ShowInBookmarkEnum.Cover, ShowInBookmarkEnum.Title, ShowInBookmarkEnum.BookmarkInfo],
  selectedBookmarksCheckbox: [],
  showHeadSelectOptions: false
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
  },
  setSelectedSortValueCollectionFilter: (payload): void => {
    set((state) => {
      state.managerSlice.selectedSortValueCollectionFilter = payload;
    });
  },
  setSelectedViewValueCollectionFilter: (payload): void => {
    set((state) => {
      state.managerSlice.selectedViewValueCollectionFilter = payload;
    });
  },
  setSelectedShowInValueCollectionFilter: (payload): void => {
    set((state) => {
      state.managerSlice.selectedShowInValueCollectionFilter = payload;
    });
  },
  setSelectedBookmarksCheckbox: (payload): void => {
    set((state) => {
      state.managerSlice.selectedBookmarksCheckbox = payload;
    });
  },
  setShowHeadSelectOptions: (payload): void => {
    set((state) => {
      state.managerSlice.selectedBookmarksCheckbox = [];
      state.managerSlice.showHeadSelectOptions = payload;
    });
  }
});