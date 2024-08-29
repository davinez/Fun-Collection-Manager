// Design
import { useToast, useDisclosure, Box, Flex } from "@chakra-ui/react";
import { AiFillCloud } from "react-icons/ai";
// Components
import { FiltersHead, SelectOptionsHead } from "components/ui/head/manager";
import { LoadingBox, ErrorBox } from "@/components/ui/box";
import { BookmarkCard } from "@/components/ui/card/manager";
import { BookmarkModal } from "@/components/ui/modal/manager";
import { MainPagination } from "@/components/ui/pagination/manager";
// Assets

// Hooks
import { useGetAllBookmarksQuery } from "@/api/services/manager";
// Types
import type {
	TBookmark,
	TGetAllBookmarks,
} from "@/shared/types/api/manager.types";
// General
import { useState, useEffect } from "react";
import { useStore } from "@/store/UseStore";
import { defaultHandlerApiError } from "@/api/useApiClient";
import NotFoundPage from "@/routes/NotFoundPage";
import EmptyPage from "@/routes/EmptyPage";

type TMainContentProps = {
	data: TGetAllBookmarks;
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

	// Handlers

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
					bookmarksCount={data.bookmarks.length as number}
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
				gridTemplateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}
				gap={4}
				justifyItems="center"
				alignItems="center"
			>
				{data.bookmarks.map((bookmark) => {
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
		} = useGetAllBookmarksQuery(managerSlice.getBookmarkParams);
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

		if (
			managerSlice.getBookmarkParams.debounceSearchValue.length > 0 &&
			getAllBookmarksResponse.total === 0
		) {
			return <NotFoundPage />;
		} else if (getAllBookmarksResponse.total === 0) {
			return <EmptyPage />;
		}

		return <MainContent data={getAllBookmarksResponse} />;
	};
