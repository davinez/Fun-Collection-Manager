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
	Checkbox,
	IconButton,
	Icon,
} from "@chakra-ui/react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { FaArrowDownAZ, FaArrowUpAZ } from "react-icons/fa6";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
import colorStylesTheme from "shared/styles/theme/foundations/colors";
// Components
import { ManagerHeadFilters } from "components/ui/head";
import { LoadingBox, ErrorBox } from "@/components/ui/box";
// Assets

// Hooks
import { useGetAllBookmarks } from "@/api/services/manager";
import useBookmarkSort from "@/hooks/manager/useBookmarkSort";
// Types
import type { TBookmark } from "@/shared/types/api/manager.types";
import {
	ViewCollectionsEnum,
	ShowInBookmarkEnum,
} from "@/shared/types/global.types";
// General
import { Fragment, useState, useEffect } from "react";
import { useStore } from "@/store/UseStore";
import { defaultHandlerApiError } from "@/api/apiClient";

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

	const handleMouseOver = (bookmarkId: number) => {
		// let updatedIsHovering = isHovering.map((hoveredBookmark) => {
		// 	if (hoveredBookmark.bookmarkId === bookmarkId) {
		// 		return { ...hoveredBookmark, isHovering: true };
		// 	}

		// 	return hoveredBookmark;
		// });

		// setIsHovering(updatedIsHovering);

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

		console.log(managerSlice.selectedBookmarksCheckbox);
		managerSlice.selectedBookmarksCheckbox.includes(bookmark.id)
			? managerSlice.setSelectedBookmarksCheckbox(
					managerSlice.selectedBookmarksCheckbox.filter(
						(id) => id === bookmark.id
					)
			  )
			: managerSlice.setSelectedBookmarksCheckbox([
					...managerSlice.selectedBookmarksCheckbox,
					bookmark.id,
			  ]);
				console.log(managerSlice.selectedBookmarksCheckbox);
	};

	return (
		<>
			<Card
				w={{ sm: "45%", md: "35%", lg: "32%" }}
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
						minH="0rem"
						maxH="14rem"
						p={
							managerSlice.selectedShowInValueCollectionFilter.length === 1 &&
							managerSlice.selectedShowInValueCollectionFilter.includes(
								ShowInBookmarkEnum.Cover
							)
								? 0
								: 2
						}
						overflow="hidden"
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
								lineHeight="1.1"
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
								lineHeight="1.1"
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
								<Box lineHeight="1" color="brandPrimary.150">
									<Text
										overflow="hidden"
										textOverflow="ellipsis"
										sx={{
											display: "-webkit-box",
											WebkitLineClamp: 1,
											WebkitBoxOrient: "vertical",
										}}
									>
										&#x2022; {bookmark.bookmarkDetail.websiteName}
									</Text>
								</Box>
								<Box lineHeight="1" color="brandPrimary.150">
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
						zIndex="banner"
						flexFlow="row nowrap"
						alignItems="start"
						justifyContent="space-between"
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
									aria-label="Search database"
									size="sm"
									icon={
										<Icon
											boxSize="5"
											color="brandPrimary.150"
											as={AiFillEdit}
										/>
									}
									bg="brandPrimary.900"
								/>
								<IconButton
									aria-label="Search database"
									size="sm"
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
