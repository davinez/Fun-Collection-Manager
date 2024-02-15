import type { TStateSlice } from "shared/types/store/store.types";
import {
  FormActionEnum,
  SortEnum,
  ViewCollectionsEnum,
  ShowInBookmarkEnum,
  FilterBookmarksEnum
} from "@/shared/types/global.types";

export type TManagerSliceDefinition = {
  groupModalFormAction: FormActionEnum;
  bookmarkModalFormAction: FormActionEnum | undefined;
  selectedSidebarGroup: number | undefined;
  selectedSidebarCollection: number | undefined;
  selectedSortValueCollectionFilter: string;
  selectedViewValueCollectionFilter: string;
  selectedShowInValueCollectionFilter: string[];
  selectedBookmarksCheckbox: number[];
  selectAllBookmarks: boolean;
  showHeadSelectOptions: boolean;
  selectedBookmarkCollectionFilter: string;
};

export type TManagerSliceActions = {
  setGroupModalFormAction: (payload: FormActionEnum) => void;
  setBookmarkModalFormAction: (payload: FormActionEnum) => void;
  setSelectedSidebarGroup: (payload: number) => void;
  setSelectedSidebarCollection: (payload: number) => void;
  setSelectedSortValueCollectionFilter: (payload: string) => void;
  setSelectedViewValueCollectionFilter: (payload: string) => void;
  setSelectedShowInValueCollectionFilter: (payload: string[]) => void;
  setSelectedBookmarksCheckbox: (payload: number | number[]) => void;
  resetSelectedBookmarksCheckbox: () => void;
  setSelectAllBookmarks: (payload: boolean) => void;
  setShowHeadSelectOptions: (payload: boolean) => void;
  setSelectedBookmarkCollectionFilter: (payload: string) => void;
};

export type TManagerSlice = TManagerSliceDefinition & TManagerSliceActions;

const initialManagerSliceState: TManagerSliceDefinition = {
  groupModalFormAction: FormActionEnum.Add,
  bookmarkModalFormAction: undefined,
  selectedSidebarGroup: undefined,
  selectedSidebarCollection: undefined,
  selectedSortValueCollectionFilter: SortEnum.DateAsc,
  selectedViewValueCollectionFilter: ViewCollectionsEnum.Card,
  selectedShowInValueCollectionFilter: [ShowInBookmarkEnum.Cover, ShowInBookmarkEnum.Title, ShowInBookmarkEnum.BookmarkInfo],
  selectedBookmarksCheckbox: [],
  selectAllBookmarks: false,
  showHeadSelectOptions: false,
  selectedBookmarkCollectionFilter: FilterBookmarksEnum.Info
};

export const ManagerSlice: TStateSlice<TManagerSlice> = (set) => ({
  ...initialManagerSliceState,
  setSelectedSidebarGroup: (payload): void =>
    set((state) => {
      state.managerSlice.selectedSidebarGroup = payload;
    }),
  setSelectedSidebarCollection: (payload): void =>
    set((state) => {
      state.managerSlice.selectedSidebarCollection = payload;
    }),
  setGroupModalFormAction: (payload): void =>
    set((state) => {
      state.managerSlice.groupModalFormAction = payload;
    }),
  setSelectedSortValueCollectionFilter: (payload): void =>
    set((state) => {
      state.managerSlice.selectedSortValueCollectionFilter = payload;
    }),
  setSelectedViewValueCollectionFilter: (payload): void =>
    set((state) => {
      state.managerSlice.selectedViewValueCollectionFilter = payload;
    }),
  setSelectedShowInValueCollectionFilter: (payload): void =>
    set((state) => {
      state.managerSlice.selectedShowInValueCollectionFilter = payload;
    }),
  setSelectedBookmarksCheckbox: (payload): void =>
    set((state) => {
      if (Array.isArray(payload)) {
        state.managerSlice.selectedBookmarksCheckbox = payload;
      } else {
        if (state.managerSlice.selectedBookmarksCheckbox.includes(payload)) {
          const index = state.managerSlice.selectedBookmarksCheckbox.indexOf(payload);
          state.managerSlice.selectedBookmarksCheckbox.splice(index, 1);
        } else {
          state.managerSlice.selectedBookmarksCheckbox = [...state.managerSlice.selectedBookmarksCheckbox, payload]
        }
      }
    }),
  resetSelectedBookmarksCheckbox: (): void =>
    set((state) => {
      state.managerSlice.selectedBookmarksCheckbox = [];
    }),
  setSelectAllBookmarks: (payload): void =>
    set((state) => {
      state.managerSlice.selectAllBookmarks = payload;
    }),
  setShowHeadSelectOptions: (payload): void =>
    set((state) => {
      state.managerSlice.showHeadSelectOptions = payload;
    }),
  setBookmarkModalFormAction: (payload): void =>
    set((state) => {
      state.managerSlice.bookmarkModalFormAction = payload;
    }),
  setSelectedBookmarkCollectionFilter: (payload): void =>
    set((state) => {
      state.managerSlice.selectedBookmarkCollectionFilter = payload;
    }),
  //   updateWallet: (payload) =>
  //   set(
  //     (state) => {
  //       state.wallet.connectedWallets = state.wallet.connectedWallets.map(
  //         (wallet) => {
  //           if (wallet.address !== payload.address) {
  //             return wallet;
  //           }

  //           return {
  //             ...wallet,
  //             ...payload,
  //           };
  //         },
  //       );

  //       if (state.wallet.activeWallet?.address === payload.address) {
  //         state.wallet.activeWallet = {
  //           ...state.wallet.activeWallet,
  //           ...payload,
  //         };
  //       }
  //     }),
});