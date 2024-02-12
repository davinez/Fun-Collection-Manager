// Design
import {
	Text,
	Flex,
	Card,
	CardBody,
	Image,
	Box,
	Checkbox,
	IconButton,
	Icon,
	useDisclosure,
} from "@chakra-ui/react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
// Components
import { ManagerBookmarkModal } from "components/ui/modal";
// Assets

// Hooks

// Types
import type { TBookmark } from "@/shared/types/api/manager.types";
import { ShowInBookmarkEnum, FormActionEnum } from "@/shared/types/global.types";
// General
import { useState } from "react";
import { useStore } from "@/store/UseStore";

type TManagerBookmarkCardProps = {
	bookmark: TBookmark;
};

export const ManagerBookmarkCard = ({
	bookmark,
}: TManagerBookmarkCardProps) => {
	// State Hooks
	const [isHovering, setIsHovering] = useState(false);
	const { managerSlice } = useStore();
	// General Hooks
	const {
		isOpen: isOpenBookmarkModal,
		onOpen: onOpenBookmarkModal,
		onClose: onCloseBookmarkModal,
	} = useDisclosure();

	const handleMouseOver = (bookmarkId: number) => {
		setIsHovering(true);
	};

	const handleMouseOut = (bookmarkId: number) => {
		setIsHovering(false);
	};

	const handleOnClickCard = (event: React.SyntheticEvent<EventTarget>) => {
		// Only open website if the clicked element it is the card and not an inside element
		if (
			event.target instanceof HTMLDivElement &&
			(event.target as HTMLDivElement).getAttribute("aria-label") ===
				"card-overlay-container"
		) {
			console.log("Clicked overlay card");
		}
	};

	const handleOnClickCheckbox = () => {
		// activate head with edit and select options if it is not active
		if (!managerSlice.showHeadSelectOptions)
			managerSlice.setShowHeadSelectOptions(true);

		managerSlice.setSelectedBookmarksCheckbox(bookmark.id);
	};

	const handleOnClickEditBookmark = () => {
		managerSlice.setBookmarkModalFormAction(FormActionEnum.Update);
		onOpenBookmarkModal();
	};

	return (
		<>
			<ManagerBookmarkModal
				isOpen={isOpenBookmarkModal}
				onClose={onCloseBookmarkModal}
				bookmark={bookmark}
			/>
			<Card
				w="100%"
				h="100%"
				bg="brandPrimary.900"
				boxShadow="0 0 1px rgba(255,255,255)"
				borderRadius="6px"
				onMouseOver={() => handleMouseOver(bookmark.id)}
				onMouseOut={() => handleMouseOut(bookmark.id)}
			>
				<CardBody w="100%" h="100%" p={0}>
					{managerSlice.selectedShowInValueCollectionFilter.includes(
						ShowInBookmarkEnum.Cover
					) && (
						<Box w="100%" h={{ sm: "6rem", md: "12rem", lg: "10rem" }}>
							<Image
								w="100%"
								h="100%"
								borderTopRadius="6px"
								borderBottomRadius={
									managerSlice.selectedShowInValueCollectionFilter.length ===
										1 &&
									managerSlice.selectedShowInValueCollectionFilter.includes(
										ShowInBookmarkEnum.Cover
									)
										? "6px"
										: "0px"
								}
								objectFit="fill"
								src={bookmark.cover}
								fallbackSrc="/assets/images/default_bookmark_cover.jpg"
								alt="Default Icon"
							/>
						</Box>
					)}

					<Flex
						aria-label="card-info"
						w="100%"
						h="100%"
						p={
							managerSlice.selectedShowInValueCollectionFilter.length === 1 &&
							managerSlice.selectedShowInValueCollectionFilter.includes(
								ShowInBookmarkEnum.Cover
							)
								? 0
								: 2
						}
						direction="column"
						justify="flex-start"
						gap="4px"
					>
						{managerSlice.selectedShowInValueCollectionFilter.includes(
							ShowInBookmarkEnum.Title
						) && (
							<Box
								aria-label="bookmark-title"
								w="100%"
								lineHeight="1.2"
								fontSize="1.05rem"
								fontWeight="500"
								color="brandPrimary.100"
							>
								<Text
									overflow="hidden"
									textOverflow="ellipsis"
									sx={{
										display: "-webkit-box",
										WebkitLineClamp: 3,
										WebkitBoxOrient: "vertical",
									}}
								>
									{bookmark.title}
								</Text>
							</Box>
						)}

						{managerSlice.selectedShowInValueCollectionFilter.includes(
							ShowInBookmarkEnum.Description
						) && (
							<Box
								aria-label="bookmark-description"
								w="100%"
								lineHeight="1.2"
								fontSize=".8rem"
								fontWeight="500"
								color="brandPrimary.150"
							>
								<Text
									overflow="hidden"
									textOverflow="ellipsis"
									sx={{
										display: "-webkit-box",
										WebkitLineClamp: 3,
										WebkitBoxOrient: "vertical",
									}}
								>
									{bookmark.description}
								</Text>
							</Box>
						)}

						{managerSlice.selectedShowInValueCollectionFilter.includes(
							ShowInBookmarkEnum.BookmarkInfo
						) && (
							<Flex
								aria-label="bookmark-detail"
								w="100%"
								flexFlow="row wrap"
								gap={1}
								justify="flex-start"
								align="center"
								color="brandPrimary.150"
								fontSize=".8rem"
								fontWeight="400"
							>
								<Flex direction="row" gap={1} align="center">
									<Image
										boxSize="4"
										objectFit="contain"
										src={bookmark.bookmarkDetail.collection.icon}
										fallbackSrc="/assets/icons/bookmark.svg"
										alt="Default Icon"
									/>
									<Box color="brandPrimary.150">
										<Text
											overflow="hidden"
											textOverflow="ellipsis"
											sx={{
												display: "-webkit-box",
												WebkitLineClamp: 1,
												WebkitBoxOrient: "vertical",
											}}
										>
											{bookmark.bookmarkDetail.collection.name}
										</Text>
									</Box>
								</Flex>
								<Box lineHeight="1.2" color="brandPrimary.150">
									<Text
										overflow="hidden"
										textOverflow="ellipsis"
										sx={{
											display: "-webkit-box",
											WebkitLineClamp: 1,
											WebkitBoxOrient: "vertical",
										}}
									>
										&#x2022; {bookmark.bookmarkDetail.websiteURL}
									</Text>
								</Box>
								<Box lineHeight="1.2" color="brandPrimary.150">
									<Text
										overflow="hidden"
										textOverflow="ellipsis"
										sx={{
											display: "-webkit-box",
											WebkitLineClamp: 1,
											WebkitBoxOrient: "vertical",
										}}
									>
										&#x2022; {bookmark.bookmarkDetail.createdAt}
									</Text>
								</Box>
							</Flex>
						)}
					</Flex>
				</CardBody>
				{managerSlice.showHeadSelectOptions || isHovering ? (
					<Flex
						aria-label="card-overlay-container"
						position="absolute"
						top="0"
						left="0"
						right="0"
						bottom="0"
						bg={isHovering ? "rgba(0, 0, 0, 0.5)" : undefined}
						borderRadius="6px"
						flexFlow="row nowrap"
						alignItems="start"
						justifyContent="space-between"
						cursor="pointer"
						onClick={handleOnClickCard}
					>
						{/* Hover Overlay to show edit, delete and select option */}
						<Checkbox
							size="sm"
							colorScheme="gray"
							mt={2}
							ml={2}
							_focus={{
								borderColor: "none",
								outline: "none",
								boxShadow: "none",
							}}
							cursor="default"
							onChange={handleOnClickCheckbox}
						/>
						{!managerSlice.showHeadSelectOptions && (
							<Flex
								aria-label="card-overlay-container-buttons"
								gap={2}
								mt={2}
								mr={2}
							>
								<IconButton
									// Set edit functionality, open right drawer with form
									aria-label="Search database"
									size="sm"
									_hover={{
										bg: "brandPrimary.950",
									}}
									_active={{
										bg: "brandPrimary.950",
									}}
									icon={
										<Icon
											boxSize="5"
											color="brandPrimary.150"
											as={AiFillEdit}
										/>
									}
									bg="brandPrimary.900"
									onClick={handleOnClickEditBookmark}
								/>
								<IconButton
									aria-label="Search database"
									size="sm"
									_hover={{
										bg: "brandPrimary.950",
									}}
									_active={{
										bg: "brandPrimary.950",
									}}
									icon={
										<Icon
											boxSize="5"
											color="brandPrimary.150"
											as={AiFillDelete}
										/>
									}
									bg="brandPrimary.900"
								/>
							</Flex>
						)}
					</Flex>
				) : (
					<></>
				)}
			</Card>
		</>
	);
};
