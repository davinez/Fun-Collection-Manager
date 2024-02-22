// Design
import { ListItem, ListIcon, UnorderedList } from "@chakra-ui/react";
import { AiFillBackward, AiFillForward } from "react-icons/ai";
// Components

// Assets

// Types
import { PAGINATION_DOTS } from "@/shared/config";
// General
import React from "react";
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
			w="100%"
			h="100%"
			p={0}
			m={0}
			styleType="none"
			display="flex"
			justifyContent="center"
			alignItems="center"
			gap={1}
			fontSize=".9rem"
			fontWeight="500"
			color="brandPrimary.100"
		>
			{managerSlice.getBookmarkParams.page !== 1 && (
				<ListItem
					aria-label="pagination-previous"
					cursor="pointer"
					borderRadius="6px"
					bg="brandPrimary.900"
					p={2}
					paddingRight={3}
					display="flex"
					alignItems="center"
					gap={1}
					_hover={{
						bg: "brandSecondary.600",
					}}
					_active={{
						bg: "brandSecondary.600",
					}}
					onClick={onPrevious}
				>
					<ListIcon m={0} as={AiFillBackward} color="brandPrimary.150" />
					Previous Page
				</ListItem>
			)}
			{paginationRange.map((pageNumber, index) => {
				if (pageNumber === PAGINATION_DOTS) {
					return (
						<ListItem
							aria-label="pagination-dots"
							key={`pagination_dots_${index}`}
						>
							{PAGINATION_DOTS}
						</ListItem>
					);
				}
				return (
					<ListItem
						aria-label="pagination-number"
						key={`pagination_number_${pageNumber}`}
						cursor="pointer"
						borderRadius="6px"
						bg={
							managerSlice.getBookmarkParams.page === pageNumber
								? "brandSecondary.600"
								: "brandPrimary.900"
						}
						p={2}
						display="flex"
						alignItems="center"
						gap={1}
						_hover={{
							bg: "brandSecondary.600",
						}}
						_active={{
							bg: "brandSecondary.600",
						}}
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
					borderRadius="6px"
					bg="brandPrimary.900"
					py={2}
					paddingRight={1}
					paddingLeft={3}
					display="flex"
					alignItems="center"
					gap={1}
					_hover={{
						bg: "brandSecondary.600",
					}}
					_active={{
						bg: "brandSecondary.600",
					}}
					onClick={onNext}
				>
					Next Page
					<ListIcon as={AiFillForward} color="brandPrimary.150" />
				</ListItem>
			)}
		</UnorderedList>
	);
};
