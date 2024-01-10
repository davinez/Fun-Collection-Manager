// Design
import {
	Hide,
	Stack,
	Text,
	Box,
	Flex,
	Icon,
	Image,
	Button,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	RadioGroup,
	Radio,
	Checkbox,
	useCheckboxGroup,
	Divider,
	type FlexProps,
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
// Components
import { HeaderFilters } from "components/ui/manager";
// Assets

// Hooks
import { useGetCollectionsQuery } from "@/api/services/manager";
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
	const sortByDateAsc = () => {
		// Query data and sort according to state

		// Set view according to state

		// use components for each view type enum


		return (
			<Box>
				<Icon mx="0px" boxSize="3" color="brandPrimary.150" as={AiFillCloud} />
				<Hide below="md">
					<Text ml={1} textStyle="secondary" color="brandPrimary.150">
						This text hides at the "md" value screen width and smaller.
					</Text>
				</Hide>
			</Box>
		);
	};

	return (
		<>
			<HeaderFilters headerName="All bookmarks" icon={AiFillCloud} />
			<Stack direction={["column", "row"]} spacing="24px">
				<Text>All</Text>
			</Stack>
		</>
	);
};
