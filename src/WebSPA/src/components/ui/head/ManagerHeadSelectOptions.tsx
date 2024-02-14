// Design
import {
	Hide,
	Stack,
	Text,
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
} from "@chakra-ui/react";
import { AiFillDelete, AiOutlineClose } from "react-icons/ai";
import { FaArrowDownAZ, FaArrowUpAZ } from "react-icons/fa6";
// Components

// Assets

// Hooks

// Types

// General
import { useState } from "react";
import { useStore } from "@/store/UseStore";

type THeaderSelectOptionsProps = {
	headerName?: string;
	bookmarksCount: number;
};

export const ManagerHeadSelectOptions = ({
	headerName,
	bookmarksCount,
}: THeaderSelectOptionsProps) => {
	// State Hooks
	const { managerSlice } = useStore();
	const [checkedHead, setCheckedHead] = useState(
		managerSlice.selectAllBookmarks
	);
	// General Hooks

	const handleOnClickCloseButton = () => {
		managerSlice.resetSelectedBookmarksCheckbox();
		managerSlice.setSelectAllBookmarks(false);
		managerSlice.setShowHeadSelectOptions(false);
	};

	const handleOnClickSelectAllCheckbox = (
		event: React.SyntheticEvent<EventTarget>
	) => {
		// Only activate collapse component if the clicked element it is div or button with show text
		if (event.target instanceof HTMLInputElement) {
			const checkbox = event.target as HTMLInputElement;
			// isChecked now it is a controlled component, we need to manage state
			if (!checkbox.checked) {
				managerSlice.resetSelectedBookmarksCheckbox();
				managerSlice.setSelectAllBookmarks(false);
				setCheckedHead(false);
				return;
			}

			setCheckedHead(true);
			managerSlice.setSelectAllBookmarks(true);
		}
	};

	return (
		<Flex
			aria-label="mainhead-container"
			w="100%"
			h="10%"
			bg="brandPrimary.800"
			justify="space-between"
			pl={6}
			pr={8}
			pt={1}
			pb={2}
			borderBottom="1px solid"
			borderBottomColor="gray"
			position="sticky"
			top="3rem" // stacking sticky element, same height from element up
			zIndex="1"
		>
			<Flex aria-label="headname-info-container" alignItems="center" gap={3}>
				<Checkbox
					colorScheme="gray"
					_focus={{
						borderColor: "none",
						outline: "none",
						boxShadow: "none",
					}}
					isChecked={checkedHead}
					isIndeterminate={
						(managerSlice.selectedBookmarksCheckbox.length !== 0 &&
							managerSlice.selectedBookmarksCheckbox.length !==
								bookmarksCount) ||
						(managerSlice.selectAllBookmarks === false &&
							managerSlice.selectedBookmarksCheckbox.length === bookmarksCount)
					}
					onChange={handleOnClickSelectAllCheckbox}
				/>
				<Text
					aria-label="head-counter"
					wordBreak="break-word"
					textStyle="title"
					color="brandPrimary.150"
				>
					{headerName
						? bookmarksCount === managerSlice.selectedBookmarksCheckbox.length
							? `All in ${headerName}`
							: `${managerSlice.selectedBookmarksCheckbox.length} in ${headerName}`
						: bookmarksCount === managerSlice.selectedBookmarksCheckbox.length
						? "All"
						: managerSlice.selectedBookmarksCheckbox.length}
				</Text>
			</Flex>

			<Flex
				aria-label="head-actions-container"
				justify="center"
				align="center"
				gap={2}
			>
				<Button
					aria-label="delete-selection"
					p={0}
					h={6}
					bg="brandPrimary.900"
					_hover={{
						bg: "brandPrimary.950",
					}}
					_active={{
						bg: "brandPrimary.950",
					}}
				>
					<Icon boxSize="5" color="brandPrimary.150" as={AiFillDelete} />
				</Button>
				<Button
					aria-label="delete-selection"
					p={0}
					h={6}
					onClick={handleOnClickCloseButton}
					bg="brandPrimary.900"
					_hover={{
						bg: "brandPrimary.950",
					}}
					_active={{
						bg: "brandPrimary.950",
					}}
				>
					<Icon boxSize="5" color="brandPrimary.150" as={AiOutlineClose} />
				</Button>
			</Flex>
		</Flex>
	);
};
