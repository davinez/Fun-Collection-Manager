// Design
import {
	Hide,
	Text,
	Flex,
	Card,
	CardBody,
	CardFooter,
	Heading,
	Divider,
	Image,
	Stack,
	useToast,
	type FlexProps,
	Box,
	CardHeader,
} from "@chakra-ui/react";
import {
	AiFillCloud,
	AiFillClockCircle,
	AiFillChrome,
	AiFillProfile,
	AiFillLayout,
	AiFillAppstore,
} from "react-icons/ai";
import { FaArrowDownAZ, FaArrowUpAZ } from "react-icons/fa6";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
import colorStylesTheme from "shared/styles/theme/foundations/colors";
// Components
import {
	ManagerHeadFilters,
	ManagerHeadSelectOptions,
} from "components/ui/head";
import { LoadingBox, ErrorBox } from "@/components/ui/box";
import { ManagerBookmarkCard } from "@/components/ui/card";
// Assets

// Hooks
import { useGetAllBookmarks } from "@/api/services/manager";
import useBookmarkSort from "@/hooks/manager/useBookmarkSort";
// Types
import type { TBookmark } from "@/shared/types/api/manager.types";
import {
	ViewCollectionsEnum,
	ShowInBookmarkEnum,
	TBreakpointsStyling,
} from "@/shared/types/global.types";
// General
import { Fragment, useState, useEffect } from "react";
import { useStore } from "@/store/UseStore";
import { defaultHandlerApiError } from "@/api/apiClient";

type TMainContentProps = {
	bookmarks: TBookmark[];
};

const MainContent = ({ bookmarks }: TMainContentProps): React.ReactElement => {
	// State Hooks
	const { managerSlice } = useStore();
	// General Hooks
	const [sortedData] = useBookmarkSort(bookmarks);

	// Pending set "All" word in headselect component if all bookmarks are selected, add to store boomarks object to count 
	// a;so it will be use in the sort and filter/search functionality
	useEffect(() => {
		if (managerSlice.selectAllBookmarks) {
			managerSlice.resetSelectedBookmarksCheckbox();

			managerSlice.setSelectedBookmarksCheckbox(
				bookmarks.map((bookmark) => bookmark.id)
			);
		} else if (!managerSlice.selectAllBookmarks) {
			managerSlice.resetSelectedBookmarksCheckbox();
		}

	}, [managerSlice.selectAllBookmarks]);

	return (
		<Box
			aria-label="page-maincontent"
			h="auto"
			w="100%"
			px={4}
			py={4}
			display="grid"
			gridAutoRows="1fr" /* make all rows the same height */
			gridTemplateColumns={{ sm: "1fr 1fr", md: "1fr 1fr 1fr" }}
			gap={4}
			justifyItems="center"
			alignItems="center"
		>
			{sortedData &&
				sortedData.map((bookmark) => {
					return (
						<ManagerBookmarkCard
							key={`RenderedCard_${bookmark.id}`}
							bookmark={bookmark}
						/>
					);
				})}
		</Box>
	);
};

type TAllBookmarksPageProps = {};

export const AllBookmarksPage =
	({}: TAllBookmarksPageProps): React.ReactElement => {
		// State Hooks
		const { managerSlice } = useStore();
		// General Hooks
		const {
			isPending: isPendingGetAllBookmarks,
			isError: isErrorGetAllBookmarks,
			error: errorGetAllBookmarks,
			data: getAllBookmarksResponse,
		} = useGetAllBookmarks();
		const toast = useToast();

		if (isPendingGetAllBookmarks) {
			return <LoadingBox />;
		}

		if (isErrorGetAllBookmarks) {
			toast({
				title: "Error",
				description: "Error in fetching all bookmarks",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			defaultHandlerApiError(errorGetAllBookmarks);

			return <ErrorBox />;
		}

		return (
			<>
				{managerSlice.showHeadSelectOptions ? (
					<ManagerHeadSelectOptions />
				) : (
					<ManagerHeadFilters headerName="All bookmarks" icon={AiFillCloud} />
				)}
				<MainContent bookmarks={getAllBookmarksResponse} />
			</>
		);
	};
