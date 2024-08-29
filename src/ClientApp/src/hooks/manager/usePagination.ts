import { useMemo } from 'react';
import { PAGINATION_DOTS } from '@/shared/config';


const range = (start: number, end: number) => {
  let length = end - start + 1;
  return [...Array(length).keys()].map(i => i + start);
};

type TusePaginationProps = {
  totalCount: number;
  pageSize: number;
  siblingCount: number;
  currentPage: number;
};

/**
 * Custom hook to manage pagination state
 * @param
 * @returns 
 */
export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage
}: TusePaginationProps) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);
    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    /*
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    /*
      We do not want to show dots if there is only one position left 
      after/before the left/right page count as that would lead to a change if our Pagination
      component size which we do not want
    */

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + (2 * siblingCount);
      let leftRange = range(1, leftItemCount);

      return [...leftRange, PAGINATION_DOTS, totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + (2 * siblingCount);
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, PAGINATION_DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, PAGINATION_DOTS, ...middleRange, PAGINATION_DOTS, lastPageIndex];
    }

  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};
