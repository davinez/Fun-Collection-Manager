// Design
import {
	Hide,
	Stack,
	Text,
	Flex,
	Icon,
	Image,
	IconButton,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	RadioGroup,
	Radio,
	Checkbox,
	useCheckboxGroup,
	Divider,
} from "@chakra-ui/react";
import { AiFillDelete, AiOutlineClose } from "react-icons/ai";
import { FaArrowDownAZ, FaArrowUpAZ } from "react-icons/fa6";
// Components

// Assets

// Hooks

// Types
import {
	SortEnum,
	ViewCollectionsEnum,
	ShowInBookmarkEnum,
} from "@/shared/types/global.types";
// General
import { useState } from "react";
import { useStore } from "@/store/UseStore";

type THeaderSelectOptionsProps = {};

export const ManagerHeadSelectOptions = ({}: THeaderSelectOptionsProps) => {
	// State Hooks
	const { managerSlice } = useStore();
	// General Hooks

	const handleOnClickCloseButton = () => {
		managerSlice.setShowHeadSelectOptions(false);
	};

	const handleOnClickSelectAllCheckbox = (
		event: React.SyntheticEvent<EventTarget>
	) => {
		// Only activate collapse component if the clicked element it is div or button with show text
		if (event.target instanceof HTMLInputElement) {
			const checkbox = event.target as HTMLInputElement;
			managerSlice.setSelectAllBookmarks(checkbox.checked);
		}
	};

	return (
		<Flex
			w="100%"
			bg="brandPrimary.800"
			justify="space-between"
			px={1}
			pt={1}
			pb={2}
			borderBottom="1px solid"
			borderBottomColor="gray"
			position="sticky"
			top="3rem" // stacking sticky element, same height from element up
			zIndex="1"
		>
			<Flex w="30%" alignItems="center" gap={3} ml={4}>
				<Checkbox
					colorScheme="gray"
					_focus={{
						borderColor: "none",
						outline: "none",
						boxShadow: "none",
					}}
					defaultChecked={managerSlice.selectAllBookmarks}
					onChange={handleOnClickSelectAllCheckbox}
				/>
				<Text wordBreak="break-word" textStyle="title" color="brandPrimary.150">
					{managerSlice.selectedBookmarksCheckbox.length}
				</Text>
			</Flex>

			<Flex w="70%" align="center" justify="end" gap={2} mr={7}>
				<IconButton
					aria-label="delete-selection"
					size="sm"
					icon={<Icon boxSize="5" color="brandPrimary.150" as={AiFillDelete} />}
					bg="brandPrimary.900"
					_hover={{
						bg: "brandPrimary.950",
					}}
					_active={{
						bg: "brandPrimary.950",
					}}
				/>
				<IconButton
					aria-label="delete-selection"
					size="sm"
					icon={
						<Icon boxSize="5" color="brandPrimary.150" as={AiOutlineClose} />
					}
					onClick={handleOnClickCloseButton}
					bg="brandPrimary.900"
					_hover={{
						bg: "brandPrimary.950",
					}}
					_active={{
						bg: "brandPrimary.950",
					}}
				/>
			</Flex>
		</Flex>
	);
};
