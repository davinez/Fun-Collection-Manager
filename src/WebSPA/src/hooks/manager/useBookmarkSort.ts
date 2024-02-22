// Types
import type { TBookmark } from "@/shared/types/api/manager.types";
import {
  SortEnum,
} from "@/shared/types/global.types";
// General
import { useEffect, useState } from "react"
import { useStore } from "@/store/UseStore";

export default function useBookmarkSort(data: TBookmark[]) {
  // State Hooks
  const { managerSlice } = useStore();
  const [dataSort, setDataSort] = useState(data);
  // General Hooks

  // Handle Sorting Filter
  // Check use of memo
  useEffect(() => {
    sortData();
  }, [managerSlice.selectedSortValueCollectionFilter]);

  const sortData = () => {
    let newArray = [...dataSort];
    switch (managerSlice.selectedSortValueCollectionFilter) {
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
          if (a.bookmarkDetail.websiteURL < b.bookmarkDetail.websiteURL)
            return -1;
          if (a.bookmarkDetail.websiteURL > b.bookmarkDetail.websiteURL)
            return 1;
          return 0;
        });
        setDataSort(newArray);
        break;
      case SortEnum.SitesDesc:
        newArray.sort((a, b) => {
          if (b.bookmarkDetail.websiteURL < a.bookmarkDetail.websiteURL)
            return -1;
          if (b.bookmarkDetail.websiteURL > a.bookmarkDetail.websiteURL)
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