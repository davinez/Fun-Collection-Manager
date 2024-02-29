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
import { useGetBookmarksByCollectionQuery } from "@/api/services/manager";
import useBookmarkSort from "@/hooks/manager/useBookmarkSort";
// Types
import type {
	TBookmark,
	TGetBookmarksByCollection,
} from "@/shared/types/api/manager.types";
// General
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStore } from "@/store/UseStore";
import { defaultHandlerApiError } from "@/api/apiClient";

type TMainContentProps = {
	data: TGetBookmarksByCollection;
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
					headerName={data.collectionName}
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

type TCollectionPageProps = {};

export const CollectionPage =
	({}: TCollectionPageProps): React.ReactElement => {
		// Hooks

		// Get the Collection Id param from the URL.
		const { id } = useParams();
		const { managerSlice } = useStore();
		// TODO: manage unexistant ud or id = 0
		const {
			isPending: isPendingGetBookmarks,
			isError: isErrorGetBookmarks,
			error: errorGetBookmarks,
			data: getBookmarksResponse,
		} = useGetBookmarksByCollectionQuery(managerSlice.getBookmarkParams, id ? id : "0");
		const toast = useToast();

		useEffect(() => {
			if (isErrorGetBookmarks) {
				toast({
					title: "Error",
					description: "Error in fetching bookmarks",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				defaultHandlerApiError(errorGetBookmarks);
			}
		}, [isErrorGetBookmarks]);

		// Handlers

	// Return handling

	if (isPendingGetBookmarks)
		return (
			<Flex p={5} align="center" justify="space-between">
				<LoadingBox />
			</Flex>
		);

	if (isErrorGetBookmarks)
		return (
			<Flex p={5} align="center" justify="space-between">
				<ErrorBox />
			</Flex>
		);

		//TODO: if data.length === 0 and searchterm !== empty then render Not Found bookmarks Content - Message
		return <MainContent data={getBookmarksResponse} />;
	};
