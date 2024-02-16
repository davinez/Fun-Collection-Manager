// Design
import { useToast, useDisclosure, Box, Flex } from "@chakra-ui/react";
import { AiFillCloud } from "react-icons/ai";
// Components
import {
	ManagerFiltersHead,
	ManagerSelectOptionsHead,
} from "components/ui/head";
import { LoadingBox, ErrorBox } from "@/components/ui/box";
import { ManagerBookmarkCard } from "@/components/ui/card";
import { ManagerBookmarkModal } from "@/components/ui/modal";
import { ManagerMainPagination } from "@/components/ui/pagination";
// Assets

// Hooks
import { useGetAllBookmarks } from "@/api/services/manager";
import useBookmarkSort from "@/hooks/manager/useBookmarkSort";
// Types
import type { TApiResponse } from "@/shared/types/api/api-responses.types";
import type { TBookmark } from "@/shared/types/api/manager.types";
// General
import { useState } from "react";
import { useStore } from "@/store/UseStore";
import { defaultHandlerApiError } from "@/api/apiClient";

type TMainContentProps = {
	bookmarks: TApiResponse<TBookmark[]>;
};

const MainContent = ({ bookmarks }: TMainContentProps): React.ReactElement => {
	// Hooks
	const { managerSlice } = useStore();
	const [modalBookmark, setModalBookmark] = useState<TBookmark | undefined>();
	const {
		isOpen: isOpenBookmarkModal,
		onOpen: onOpenBookmarkModal,
		onClose: onCloseBookmarkModal,
	} = useDisclosure();
	const [sortedData] = useBookmarkSort(bookmarks.data);

	// Handlers

	if (!sortedData) {
		return <LoadingBox />;
	}

	return (
		<>
			<ManagerBookmarkModal
				aria-label="page-modal"
				isOpen={isOpenBookmarkModal}
				onClose={onCloseBookmarkModal}
				bookmark={modalBookmark}
			/>
			{managerSlice.showHeadSelectOptions ? (
				<ManagerSelectOptionsHead
					aria-label="page-head"
					bookmarksCount={bookmarks.total as number}
					onOpenBookmarkModal={onOpenBookmarkModal}
				/>
			) : (
				<ManagerFiltersHead
					aria-label="page-head"
					headerName="All bookmarks"
					icon={AiFillCloud}
				/>
			)}
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
				{sortedData.map((bookmark) => {
					return (
						<ManagerBookmarkCard
							key={`SortedCard_${bookmark.id}`}
							bookmark={bookmark}
							onOpenBookmarkModal={onOpenBookmarkModal}
							setModalBookmark={setModalBookmark}
						/>
					);
				})}
			</Box>
			<Flex aria-label="page-footer">
				<ManagerMainPagination total={bookmarks.total as number} />
			</Flex>
		</>
	);
};

type TAllBookmarksPageProps = {};

export const AllBookmarksPage =
	({}: TAllBookmarksPageProps): React.ReactElement => {
		// Hooks
		const { managerSlice } = useStore();
		const {
			isPending: isPendingGetAllBookmarks,
			isError: isErrorGetAllBookmarks,
			error: errorGetAllBookmarks,
			data: getAllBookmarksResponse,
		} = useGetAllBookmarks(managerSlice.getBookmarkParams);
		const toast = useToast();

		// Handlers

		// Render

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

		return <MainContent bookmarks={getAllBookmarksResponse} />;
	};
