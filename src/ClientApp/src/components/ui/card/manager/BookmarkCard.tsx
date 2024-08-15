// Design
import {
	Text,
	Flex,
	Card,
	CardBody,
	Image,
	Box,
	Checkbox,
	Button,
	Icon,
} from "@chakra-ui/react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
// Components

// Assets

// Hooks

// Types
import type { TBookmark } from "@/shared/types/api/manager.types";
import {
	ShowInBookmarkEnum,
	FormActionEnum,
} from "@/shared/types/global.types";
// General
import { useState, useEffect } from "react";
import { useStore } from "@/store/UseStore";
import { DEFAULT_ICON, DEFAULT_BOOKMARK_COVER, R2_COVERS_DOMAIN, R2_ICONS_DOMAIN } from "shared/config";
import { getUrlHostname, isValidHttpUrl } from "@/shared/utils";

type TBookmarkCardProps = {
	bookmark: TBookmark;
	onOpenBookmarkModal: () => void;
	setModalBookmark: React.Dispatch<React.SetStateAction<TBookmark | undefined>>;
};

export const BookmarkCard = ({
	bookmark,
	onOpenBookmarkModal,
	setModalBookmark,
}: TBookmarkCardProps) => {
	// State Hooks
	const [isHovering, setIsHovering] = useState(false);
	const { managerSlice } = useStore();
	const [checkedCard, setCheckedCard] = useState(false);
	// General Hooks

	const handleMouseOver = () => {
		setIsHovering(true);
	};

	const handleMouseOut = () => {
		setIsHovering(false);
	};

	const handleOnClickCard = (event: React.SyntheticEvent<EventTarget>) => {
		// Only open website if the clicked element it is the card and not an inside element (checkbox or card overlay buttons)
		if (
			event.target instanceof HTMLDivElement &&
			(event.target as HTMLDivElement).getAttribute("aria-label") ===
				"card-overlay-container"
		) {
			// Click card again to deselected
			if (managerSlice.showHeadSelectOptions) {
				handleOnClickCheckbox(event);
			} else {
				// Open website
				if (isValidHttpUrl(bookmark.websiteURL)) {
					window.open(bookmark.websiteURL, "_blank");
				}
				// TODO: Open not found page or invalid URL
			}
		}
	};

	const handleOnClickCheckbox = (event: React.SyntheticEvent<EventTarget>) => {
		// Last card to uncheck, so remove headselectoptions component
		if (
			checkedCard === true &&
			managerSlice.selectedBookmarksCheckbox.length === 1
		) {
			setCheckedCard(false);
			managerSlice.resetSelectedBookmarksCheckbox();
			managerSlice.setShowHeadSelectOptions(false);
			return;
		}

		// activate head with edit and select options if it is not active
		if (!managerSlice.showHeadSelectOptions) {
			managerSlice.setSelectedBookmarksCheckbox(bookmark.id);
			setCheckedCard(true);
			managerSlice.setShowHeadSelectOptions(true);
			return;
		}

		// isChecked now it is a controlled component, we need to manage state
		setCheckedCard(checkedCard ? false : true);
		managerSlice.setSelectedBookmarksCheckbox(bookmark.id);
	};

	const handleOnClickEditBookmark = () => {
		setModalBookmark(bookmark);
		managerSlice.setBookmarkModalFormAction(FormActionEnum.Update);
		onOpenBookmarkModal();
	};

	const handleOnClickDeleteBookmark = () => {
		managerSlice.setBookmarkModalFormAction(FormActionEnum.Delete);
		managerSlice.resetSelectedBookmarksCheckbox();
		managerSlice.setSelectedBookmarksCheckbox(bookmark.id);
		onOpenBookmarkModal();
	};

	useEffect(() => {
		// Reset checkbox on headselectoptions component unmount
		if (!managerSlice.showHeadSelectOptions) {
			setCheckedCard(false);
		}

		if (managerSlice.showHeadSelectOptions && managerSlice.selectAllBookmarks) {
			// Trigger on select all bookmarks checkbox
			if (!managerSlice.selectedBookmarksCheckbox.includes(bookmark.id)) {
				// If checbox not already checked then check it
				managerSlice.setSelectedBookmarksCheckbox(bookmark.id);
				setCheckedCard(true);
			}
		} else if (
			// Trigger on de-selected all bookmarks checkbox
			managerSlice.showHeadSelectOptions &&
			!managerSlice.selectAllBookmarks &&
			!managerSlice.selectedBookmarksCheckbox.includes(bookmark.id)
		) {
			setCheckedCard(false);
		}
	}, [managerSlice.selectAllBookmarks, managerSlice.showHeadSelectOptions]);

	return (
		<>
			<Card
				w="100%"
				h="100%"
				bg="brandPrimary.900"
				boxShadow="0 0 1px rgba(255,255,255)"
				borderRadius="6px"
				onMouseOver={handleMouseOver}
				onMouseOut={handleMouseOut}
			>
				<CardBody w="100%" h="100%" p={0}>
					{managerSlice.selectedShowInValueCollectionFilter.includes(
						ShowInBookmarkEnum.Cover
					) && (
						<Box w="100%" h={{ sm: "8rem", md: "12rem", lg: "12.5rem" }}>
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
								objectFit="cover"
								src={!bookmark.cover ? DEFAULT_BOOKMARK_COVER : R2_COVERS_DOMAIN + "/" + bookmark.cover}
								fallbackSrc={DEFAULT_BOOKMARK_COVER}
								alt="Default Icon"
							/>
						</Box>
					)}

					<Flex
						aria-label="card-info"
						w="100%"
						h="auto" // height according to image container without overflowing card
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
									wordBreak="break-all"
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
									wordBreak="break-all"
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
								{
									// Not render section in collection page
									bookmark.bookmarkDetail.collectionDetail && (
										<Flex
											aria-label="collection-detail"
											w="100%"
											direction="row"
											gap={1}
											align="center"
										>
											<Image
												w="auto"
												boxSize="4"
												objectFit="contain"
												src={R2_ICONS_DOMAIN + "/" + bookmark.bookmarkDetail.collectionDetail.icon}
												fallbackSrc={DEFAULT_ICON}
												alt="Default Icon"
											/>
											<Box w="auto" color="brandPrimary.150">
												<Text
													wordBreak="break-all"
													overflow="hidden"
													textOverflow="ellipsis"
													sx={{
														display: "-webkit-box",
														WebkitLineClamp: 1,
														WebkitBoxOrient: "vertical",
													}}
												>
													{bookmark.bookmarkDetail.collectionDetail.name}
												</Text>
											</Box>
										</Flex>
									)
								}

								<Box w="100%" lineHeight="1.2" color="brandPrimary.150">
									<Text
										wordBreak="break-all"
										overflow="hidden"
										textOverflow="ellipsis"
										sx={{
											display: "-webkit-box",
											WebkitLineClamp: 1,
											WebkitBoxOrient: "vertical",
										}}
									>
										&#x2022; {getUrlHostname(bookmark.websiteURL)}
									</Text>
								</Box>
								<Box w="100%" lineHeight="1.2" color="brandPrimary.150">
									<Text
										wordBreak="break-all"
										overflow="hidden"
										textOverflow="ellipsis"
										sx={{
											display: "-webkit-box",
											WebkitLineClamp: 1,
											WebkitBoxOrient: "vertical",
										}}
									>
										&#x2022; {new Date(bookmark.bookmarkDetail.createdAt).toDateString()}
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
							isChecked={checkedCard}
							onChange={handleOnClickCheckbox}
						/>
						{!managerSlice.showHeadSelectOptions && (
							<Flex
								aria-label="card-overlay-container-buttons"
								gap={2}
								mt={2}
								mr={2}
							>
								<Button
									aria-label="Edit bookmark"
									size="sm"
									_hover={{
										bg: "brandPrimary.950",
									}}
									_active={{
										bg: "brandPrimary.950",
									}}
									bg="brandPrimary.900"
									onClick={handleOnClickEditBookmark}
								>
									<Icon boxSize="5" color="brandPrimary.150" as={AiFillEdit} />
								</Button>
								<Button
									aria-label="Delete bookmark"
									size="sm"
									_hover={{
										bg: "brandPrimary.950",
									}}
									_active={{
										bg: "brandPrimary.950",
									}}
									bg="brandPrimary.900"
									onClick={handleOnClickDeleteBookmark}
								>
									<Icon
										boxSize="5"
										color="brandPrimary.150"
										as={AiFillDelete}
									/>
								</Button>
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
