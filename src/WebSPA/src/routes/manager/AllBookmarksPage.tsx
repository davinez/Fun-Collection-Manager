// Design
import { useToast, useDisclosure, Box, Flex } from "@chakra-ui/react";
import { AiFillCloud } from "react-icons/ai";
// Components
import {
	FiltersHead,
	SelectOptionsHead,
} from "components/ui/head/manager";
import { LoadingBox, ErrorBox } from "@/components/ui/box";
import { BookmarkCard } from "@/components/ui/card/manager";
import { BookmarkModal } from "@/components/ui/modal/manager";
import { MainPagination } from "@/components/ui/pagination/manager";
// Assets

// Hooks
import { useGetAllBookmarks } from "@/api/services/manager";
import useBookmarkSort from "@/hooks/manager/useBookmarkSort";
// Types
import type {
	TBookmark,
	TGetBookmarks,
} from "@/shared/types/api/manager.types";
// General
import { useState, useEffect } from "react";
import { useStore } from "@/store/UseStore";
import { defaultHandlerApiError } from "@/api/apiClient";

type TMainContentProps = {
	data: TGetBookmarks;
};

const MainContent = ({ data }: TMainContentProps): React.ReactElement => {
	// Hooks
	const { managerSlice } = useStore();
	const [modalBookmark, setModalBookmark] = useState<TBookmark | undefined>();
	const {
		isOpen: isOpenBookmarkModal,
		onOpen: onOpenBookmarkModal,
		onClose: onCloseBookmarkModal,
	} = useDisclosure();
	const [sortedData] = useBookmarkSort(data.bookmarks);

	// Handlers

	if (!sortedData) {
		return <LoadingBox />;
	}

	return (
		<>
			<BookmarkModal
				aria-label="page-modal"
				isOpen={isOpenBookmarkModal}
				onClose={onCloseBookmarkModal}
				bookmark={modalBookmark}
			/>
			{managerSlice.showHeadSelectOptions ? (
				<SelectOptionsHead
					aria-label="page-head"
					bookmarksCount={data.total as number}
					onOpenBookmarkModal={onOpenBookmarkModal}
				/>
			) : (
				<FiltersHead
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
						<BookmarkCard
							key={`SortedCard_${bookmark.id}`}
							bookmark={bookmark}
							onOpenBookmarkModal={onOpenBookmarkModal}
							setModalBookmark={setModalBookmark}
						/>
					);
				})}
			</Box>
			<Flex aria-label="page-footer" w="100%" mt={5} mb={8}>
				<MainPagination totalCount={data.total} />
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

		useEffect(() => {
			if (isErrorGetAllBookmarks) {
				toast({
					title: "Error",
					description: "Error in fetching all bookmarks",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				defaultHandlerApiError(errorGetAllBookmarks);
			}
		}, [isErrorGetAllBookmarks]);

		// Handlers

		// Return handling

		if (isPendingGetAllBookmarks) return <LoadingBox />;

		if (isErrorGetAllBookmarks) return <ErrorBox />;

		// if data.length === 0 and searchterm !== empty then render Not Found bookmarks Content - Message
		return <MainContent data={getAllBookmarksResponse} />;
	};
