// Design
import {
	Icon,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Input,
	Button,
	Menu,
	MenuList,
	MenuButton,
	MenuItem,
	MenuOptionGroup,
	MenuItemOption,
	MenuDivider,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverCloseButton,
	PopoverBody,
	Spinner,
	Flex,
	Text,
	List,
	ListItem,
	ListIcon,
	UnorderedList,
} from "@chakra-ui/react";
import {
	AiFillCaretDown,
	AiOutlineSearch,
	AiFillFilter,
	AiFillStar,
	AiFillDatabase,
	AiFillClockCircle,
	AiFillChrome,
	AiFillBackward,
	AiFillForward,
	AiOutlineEllipsis,
} from "react-icons/ai";
// Components

// Assets

// Types
import { PAGINATION_DOTS } from "@/shared/config";
// General
import React, { useState, useEffect, ReactElement } from "react";
import { useStore } from "@/store/UseStore";
import { usePagination } from "@/hooks/manager/usePagination";

type TManagerMainPaginationProps = {
	totalCount: number;
};

export const ManagerMainPagination = ({
	totalCount,
}: TManagerMainPaginationProps): React.ReactElement => {
	// Hooks
	const { managerSlice } = useStore();
	const paginationRange = usePagination({
		totalCount,
		pageSize: managerSlice.getBookmarkParams.pageLimit,
		siblingCount: 2,
		currentPage: managerSlice.getBookmarkParams.page,
	});

	// Handlers
	const handleOnPageChange = (currentPage: number) => {
		managerSlice.setGetBookmarkParamsPage(currentPage);
	};

	const onNext = () => {
		handleOnPageChange(managerSlice.getBookmarkParams.page + 1);
	};

	const onPrevious = () => {
		handleOnPageChange(managerSlice.getBookmarkParams.page - 1);
	};

	// Return handling
	let lastPage = paginationRange![paginationRange!.length - 1] as number;

	if (
		managerSlice.getBookmarkParams.page === 0 ||
		!paginationRange ||
		paginationRange.length < 2
	) {
		return <></>;
	}

	return (
		<UnorderedList
			// className={classnames('pagination-container', { [className]: className })}
			w="100%"
			h="100%"
			p={0}
			m={0}
			styleType="none"
			display="flex"
			justifyContent="center"
			alignItems="center"
			gap={3}
		>
			{managerSlice.getBookmarkParams.page !== 1 && (
				<ListItem
					aria-label="pagination-previous"
					cursor="pointer"
					onClick={onPrevious}
				>
					<ListIcon as={AiFillBackward} color="brandPrimary.150" />
					Previous Page
				</ListItem>
			)}
			{paginationRange.map((pageNumber) => {
				if (pageNumber === PAGINATION_DOTS) {
					return (
						<ListItem aria-label="pagination-dots">{PAGINATION_DOTS}</ListItem>
					);
				}
				return (
					<ListItem
						// className={classnames("pagination-item", { selected: pageNumber === currentPage,})}
						bg="pink.300"
						p={2}
						cursor="pointer"
						onClick={() => handleOnPageChange(pageNumber as number)}
					>
						{pageNumber}
					</ListItem>
				);
			})}
			{managerSlice.getBookmarkParams.page !== lastPage && (
				<ListItem
					aria-label="pagination-next"
					cursor="pointer"
					onClick={onNext}
				>
					Next Page
					<ListIcon as={AiFillForward} color="brandPrimary.150" />
				</ListItem>
			)}
		</UnorderedList>
	);
};
