// Types
import type { TBookmark } from "@/shared/types/api/manager.types";
import {
  SortEnum,
} from "@/shared/types/global.types";
// General
import { useEffect, useState } from "react"
import { useStore } from "@/store/UseStore";

 /**
   * Sort Data according to Enum selected value.
   *
   * @remarks
   * Deprecated, currently the sorting is done on server, we cant have pagination on server and sort on client
   * https://stackoverflow.com/questions/10721430/should-data-sorting-be-done-on-the-client-or-on-the-server
   *
   */
export default function useBookmarkSort(data: TBookmark[]) {
  // State Hooks
  const { managerSlice } = useStore();
  const [dataSort, setDataSort] = useState(data);
  // General Hooks

  // Handle Sorting Filter
  // Check use of memo
  useEffect(() => {
    sortData();
  }, [managerSlice.getBookmarkParams.selectedSortValueCollectionFilter]);

  const sortData = () => {
    let newArray = [...dataSort];
    switch (managerSlice.getBookmarkParams.selectedSortValueCollectionFilter) {
      case SortEnum.DateAsc:
        newArray.sort((a, b) => new Date(a.bookmarkDetail.createdAt).getTime() - new Date(b.bookmarkDetail.createdAt).getTime());
        setDataSort(newArray);
        break;
      case SortEnum.DateDesc:
        newArray.sort((a, b) => new Date(a.bookmarkDetail.createdAt).getTime() - new Date(b.bookmarkDetail.createdAt).getTime());
        setDataSort(newArray);
        break;
      case SortEnum.NameAsc:
        newArray.sort((a, b) => {
          if (a.title < b.title)
            return -1;
          if (a.title > b.title)
            return 1;
          return 0;
        });
        setDataSort(newArray);
        break;
      case SortEnum.NameDesc:
        newArray.sort((a, b) => {
          if (b.title < a.title)
            return -1;
          if (b.title > a.title)
            return 1;
          return 0;
        });
        setDataSort(newArray);
        break;
      case SortEnum.SitesAsc:
        newArray.sort((a, b) => {
          if (a.websiteURL < b.websiteURL)
            return -1;
          if (a.websiteURL > b.websiteURL)
            return 1;
          return 0;
        });
        setDataSort(newArray);
        break;
      case SortEnum.SitesDesc:
        newArray.sort((a, b) => {
          if (b.websiteURL < a.websiteURL)
            return -1;
          if (b.websiteURL > a.websiteURL)
            return 1;
          return 0;
        });
        setDataSort(newArray);
        break;
      default:
        break;
    }
  }

  return [dataSort];
}