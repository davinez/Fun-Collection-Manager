import type { TStateSlice } from "shared/types/store/store.types";
import {
  FormActionEnum,
  SortEnum,
  ViewCollectionsEnum,
  ShowInBookmarkEnum,
  FilterBookmarksEnum
} from "@/shared/types/global.types";
import { TDynamicCollapseState, TGetBookmarksParams } from "@/shared/types/api/manager.types";
import { PAGE_ITEM_LIMIT } from "shared/config";

export type TManagerSliceDefinition = {
  collectionsNodeState: TDynamicCollapseState[] | undefined;
  groupModalFormAction: FormActionEnum;
  bookmarkModalFormAction: FormActionEnum;
  selectedSidebarGroupId: number;
  selectedSidebarCollection: number | undefined;
  selectedViewValueCollectionFilter: string;
  selectedShowInValueCollectionFilter: string[];
  selectedBookmarksCheckbox: number[];
  selectAllBookmarks: boolean;
  showHeadSelectOptions: boolean;
  getBookmarkParams: TGetBookmarksParams;
};

export type TManagerSliceActions = {
  setCollectionNodes: (payload: TDynamicCollapseState[]) => void;
  toggleCollectionNode: (payload: number) => void;
  closeAllCollectionNodes: () => void;
  setGroupModalFormAction: (payload: FormActionEnum) => void;
  setBookmarkModalFormAction: (payload: FormActionEnum) => void;
  setSelectedSidebarGroupId: (payload: number) => void;
  setSelectedSidebarCollection: (payload: number) => void;
  setSelectedSortValueCollectionFilter: (payload: SortEnum) => void;
  setSelectedViewValueCollectionFilter: (payload: string) => void;
  setSelectedShowInValueCollectionFilter: (payload: string[]) => void;
  setSelectedBookmarksCheckbox: (payload: number | number[]) => void;
  resetSelectedBookmarksCheckbox: () => void;
  resetGetBookmarkParams: () => void;
  setSelectAllBookmarks: (payload: boolean) => void;
  setShowHeadSelectOptions: (payload: boolean) => void;
  setGetBookmarkParamsFilter: (payload: FilterBookmarksEnum) => void;
  setGetBookmarkParamsSearchValue: (payload: string) => void;
  setGetBookmarkParamsPage: (payload: number) => void;
};

export type TManagerSlice = TManagerSliceDefinition & TManagerSliceActions;

const initialManagerSliceState: TManagerSliceDefinition = {
  collectionsNodeState: [],
  groupModalFormAction: FormActionEnum.Add,
  bookmarkModalFormAction: FormActionEnum.Add,
  selectedSidebarGroupId: 0,
  selectedSidebarCollection: undefined,
  selectedViewValueCollectionFilter: ViewCollectionsEnum.Card,
  selectedShowInValueCollectionFilter: [ShowInBookmarkEnum.Cover, ShowInBookmarkEnum.Title, ShowInBookmarkEnum.BookmarkInfo],
  selectedBookmarksCheckbox: [],
  selectAllBookmarks: false,
  showHeadSelectOptions: false,
  getBookmarkParams: {
    page: 1,
    pageLimit: PAGE_ITEM_LIMIT,
    filterType: FilterBookmarksEnum.Info,
    debounceSearchValue: "",
    // Sort Filter
    selectedSortValueCollectionFilter: SortEnum.DateAsc,
  }
};

export const ManagerSlice: TStateSlice<TManagerSlice> = (set) => ({
  ...initialManagerSliceState,
  setCollectionNodes: (payload): void =>
    set((state) => {
      state.managerSlice.collectionsNodeState = payload;
    }),
  toggleCollectionNode: (payload): void =>
    set((state) => {

      if (!state.managerSlice.collectionsNodeState) {
        return;
      }

      const index = state.managerSlice.collectionsNodeState
        .findIndex(node => node.nodeId === payload);

      if (index !== -1) {
        const node = state.managerSlice.collectionsNodeState[index] as TDynamicCollapseState;
        node.isOpen = node.isOpen ? false : true;
      }
    }),
  closeAllCollectionNodes: (): void =>
    set((state) => {
      if (!state.managerSlice.collectionsNodeState) {
        return;
      }

      state.managerSlice.collectionsNodeState.forEach(node => {

        if (node.isOpen) {
          node.isOpen = false;
        }

      });
    }),
  setSelectedSidebarGroupId: (payload): void =>
    set((state) => {
      state.managerSlice.selectedSidebarGroupId = payload;
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
      state.managerSlice.getBookmarkParams.selectedSortValueCollectionFilter = payload;
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
  setGetBookmarkParamsFilter: (payload): void =>
    set((state) => {
      state.managerSlice.getBookmarkParams.filterType = payload;
    }),
  setGetBookmarkParamsPage: (payload): void =>
    set((state) => {
      state.managerSlice.getBookmarkParams.page = payload;
    }),
  setGetBookmarkParamsSearchValue: (payload): void =>
    set((state) => {
      state.managerSlice.getBookmarkParams.debounceSearchValue = payload;
    }),
  resetGetBookmarkParams: (): void =>
    set((state) => {
      state.managerSlice.getBookmarkParams = {
        page: 1,
        pageLimit: PAGE_ITEM_LIMIT,
        filterType: FilterBookmarksEnum.Info,
        debounceSearchValue: "",
        selectedSortValueCollectionFilter: SortEnum.DateAsc,
      };
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