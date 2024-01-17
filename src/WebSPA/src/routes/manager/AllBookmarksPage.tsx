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
import { HeaderFilters } from "components/ui/manager";
import { LoadingBox } from "@/components/ui/box";
// Assets

// Hooks
import { useGetAllBookmarks } from "@/api/services/manager";
// Types
import type { TCollection } from "@/shared/types/api/manager.types";
import {
	SortEnum,
	ViewCollectionsEnum,
	ShowInBookmarkEnum,
} from "@/shared/types/global.types";
// General
import { Fragment, useState, useEffect } from "react";
import { useStore } from "@/store/UseStore";
import { defaultHandlerApiError } from "@/api/apiClient";

export const AllBookmarksPage = (): React.ReactElement => {
	// State Hooks
	// set toggle conection beetwen state of filters and card elements
	const { managerSlice } = useStore();
	// General Hooks
	const {
		isPending: isPendingGetAllBookmarks,
		isError: isErrorGetAllBookmarks,
		error: errorGetAllBookmarks,
		data: getAllBookmarksResponse,
	} = useGetAllBookmarks();
	const toast = useToast();

	const heightCardCalculation = () => {
		// h={{ sm: "20rem", md: "20rem", lg: "19rem" }}

    
		
return 1
	//	return {sm:  "20rem", md: "20rem", lg: "19rem"}
	}

	// Handle Error
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

	return (
		<>
			<HeaderFilters headerName="All bookmarks" icon={AiFillCloud} />
			<Flex
				aria-label="page-maincontent"
				h="auto"
				w="100%"
				flexFlow="row wrap"
				gap={4}
				justify="flex-start"
				px={4}
				py={4}
			>
				{isPendingGetAllBookmarks && <LoadingBox />}
				{getAllBookmarksResponse !== undefined &&
					getAllBookmarksResponse.map((bookmark, index) => {
						return (
							<Card
								key={`RenderedCard_${index}`}
								w={{ sm: "45%", md: "35%", lg: "32%" }}	
								bg="brandPrimary.900"
								boxShadow="0 0 1px rgba(255,255,255)"
								borderRadius="6px"
							>
								<CardBody w="100%" h="100%" p={0}>
									{managerSlice.selectedShowInValueCollectionFilter.includes(
										ShowInBookmarkEnum.Cover
									) && (
										<Box 
										w="100%" 	
										h={{ sm: "6rem", md: "12rem", lg: "10rem" }}
										>
											<Image
												w="100%"
												h="100%"
												borderTopRadius="6px"
												borderBottomRadius={managerSlice.selectedShowInValueCollectionFilter.length === 1 && 
													managerSlice.selectedShowInValueCollectionFilter.includes(ShowInBookmarkEnum.Cover) ? "6px" : "0px"}
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
										p={managerSlice.selectedShowInValueCollectionFilter.length === 1 && 
											managerSlice.selectedShowInValueCollectionFilter.includes(ShowInBookmarkEnum.Cover) ? 0 : 2}
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
							</Card>
						);
					})}
			</Flex>
		</>
	);
};
