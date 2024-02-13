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
import {
	AiFillClockCircle,
	AiFillChrome,
	AiFillProfile,
	AiFillLayout,
	AiFillAppstore,
} from "react-icons/ai";
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

type TManagerHeadFiltersProps = {
	icon: string | React.ElementType; // Third party icon
	headerName: string;
};

export const ManagerHeadFilters = ({
	icon,
	headerName,
}: TManagerHeadFiltersProps) => {
	const sortOptions = [
		{
			value: SortEnum.DateAsc,
			icon: AiFillClockCircle,
			description: "By date Asc",
		},
		{
			value: SortEnum.DateDesc,
			icon: AiFillClockCircle,
			description: "By date Desc",
		},
		{
			value: SortEnum.NameAsc,
			icon: FaArrowDownAZ,
			description: "By name (A-Z)",
		},
		{
			value: SortEnum.NameDesc,
			icon: FaArrowUpAZ,
			description: "By name (Z-A)",
		},
		{
			value: SortEnum.SitesDesc,
			icon: AiFillChrome,
			description: "Sites (A-Z)",
		},
		{
			value: SortEnum.SitesAsc,
			icon: AiFillChrome,
			description: "Sites (Z-A)",
		},
	];
	const viewOptions = [
		{
			value: ViewCollectionsEnum.Card,
			icon: AiFillAppstore,
			description: "Card",
		},
		{
			value: ViewCollectionsEnum.List,
			icon: AiFillProfile,
			description: "List",
		},
		{
			value: ViewCollectionsEnum.Moodboard,
			icon: AiFillLayout,
			description: "Moodboard",
		},
	];
	const ShowInOptions = [
		{
			value: ShowInBookmarkEnum.Cover,
			description: "Cover",
		},
		{
			value: ShowInBookmarkEnum.Title,
			description: "Title",
		},
		{
			value: ShowInBookmarkEnum.Description,
			description: "Description",
		},
		{
			value: ShowInBookmarkEnum.BookmarkInfo,
			description: "Bookmarks info",
		},
	];

	// State Hooks
	const { managerSlice } = useStore();
	const [isHovering, setIsHovering] = useState(false);
	const [sortValueRadio, setSortValueRadio] = useState(
		sortOptions.find(
			(option) =>
				option.value === managerSlice.selectedSortValueCollectionFilter
		)
	);
	const [viewValueRadio, setViewValueRadio] = useState(
		viewOptions.find(
			(option) =>
				option.value === managerSlice.selectedViewValueCollectionFilter
		)
	);
	// General Hooks

	const handleOnChangeRadioSortOption = (nextValue: string) => {
		const enumValueExists = Object.values(SortEnum).includes(nextValue);
		// Only if value of radio option exists in enum value
		if (enumValueExists) {
			managerSlice.setSelectedSortValueCollectionFilter(nextValue);
			setSortValueRadio(
				sortOptions.find((option) => option.value === nextValue)
			);
		}
	};

	const handleOnChangeRadioViewOption = (nextValue: string) => {
		const enumValueExists =
			Object.values(ViewCollectionsEnum).includes(nextValue);
		// Only if value of radio option exists in enum value
		if (enumValueExists) {
			managerSlice.setSelectedViewValueCollectionFilter(nextValue);
			setViewValueRadio(
				viewOptions.find((option) => option.value === nextValue)
			);
		}
	};

	const handleMouseOver = () => {
		setIsHovering(true);
	};

	const handleMouseOut = () => {
		setIsHovering(false);
	};

	const handleOnClickSelectAllCheckbox = () => {
		// activate head with edit and select options if it is not active
		if (!managerSlice.showHeadSelectOptions) {
			managerSlice.resetSelectedBookmarksCheckbox();
			managerSlice.setShowHeadSelectOptions(true);
		}

		managerSlice.setSelectAllBookmarks(true);
	};

	const handleOnChangeCheckboxShowInOptions = (
		checkBoxGroupState: string[]
	) => {
		managerSlice.setSelectedShowInValueCollectionFilter(checkBoxGroupState);
	};

	const { getCheckboxProps } = useCheckboxGroup({
		defaultValue: managerSlice.selectedShowInValueCollectionFilter.map(
			(value) => value.toString()
		),
		onChange: handleOnChangeCheckboxShowInOptions,
	});

	return (
		<Flex
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
			onMouseOver={handleMouseOver}
			onMouseOut={handleMouseOut}
		>
			<Flex alignItems="center" gap={3} ml={4}>
				{isHovering && (
					<Checkbox
						defaultChecked={false}
						colorScheme="gray"
						_focus={{
							borderColor: "none",
							outline: "none",
							boxShadow: "none",
						}}
						cursor="default"
						onChange={handleOnClickSelectAllCheckbox}
					/>
				)}
				{typeof icon === "string"
					? !isHovering && (
							<Image
								borderRadius="2px"
								boxSize="6"
								color="brandPrimary.150"
								objectFit="contain"
								src={icon as string}
								fallbackSrc="/assets/icons/bookmark.svg"
								alt="General Icon"
							/>
					  )
					: !isHovering && (
							<Icon
								boxSize="6"
								color="brandPrimary.150"
								as={icon as React.ElementType}
							/>
					  )}
				<Text wordBreak="break-word" textStyle="title" color="brandPrimary.150">
					{headerName}
				</Text>
			</Flex>

			<Flex justify="center" gap={1} mr={4}>
				<Popover>
					<PopoverTrigger>
						<Button
							bg="brandPrimary.800"
							px={2}
							py={2}
							color="brandPrimary.100"
							_hover={{
								bg: "brandPrimary.950",
							}}
							_active={{
								bg: "brandPrimary.950",
							}}
						>
							<Icon
								mx="0px"
								boxSize="4"
								color="brandPrimary.150"
								as={sortValueRadio?.icon}
							/>
							<Hide below="md">
								<Text ml={1} textStyle="primary" color="brandPrimary.150">
									{sortValueRadio?.description}
								</Text>
							</Hide>
						</Button>
					</PopoverTrigger>
					<PopoverContent
						zIndex="popover"
						bg="brandPrimary.900"
						color="brandPrimary.100"
						border="1px solid"
						borderColor="brandPrimary.900"
						w="100%"
						p={1}
					>
						<PopoverBody>
							<RadioGroup
								onChange={handleOnChangeRadioSortOption}
								defaultValue={managerSlice.selectedSortValueCollectionFilter.toString()}
							>
								<Stack direction="column">
									<Text textStyle="primary" color="brandPrimary.100" mb={1}>
										Sort by
									</Text>
									{sortOptions.map((option, index) => {
										return (
											<Radio
												key={`RenderedSortList${index}`}
												value={option.value.toString()}
												colorScheme="gray"
												borderColor="brandPrimary.150"
												_focus={{
													borderColor: "none",
													outline: "none",
													boxShadow: "none",
												}}
												_hover={{
													borderColor: "brandPrimary.100",
													color: "brandPrimary.150",
												}}
											>
												<Flex align="center" gap={2}>
													<Icon
														boxSize="5"
														color="brandPrimary.100"
														as={option.icon}
													/>
													<Text
														textStyle="primary"
														fontWeight="400"
														color="brandPrimary.100"
													>
														{option.description}
													</Text>
												</Flex>
											</Radio>
										);
									})}
								</Stack>
							</RadioGroup>
						</PopoverBody>
					</PopoverContent>
				</Popover>

				<Popover>
					<PopoverTrigger>
						<Button
							bg="brandPrimary.800"
							px={2}
							py={2}
							color="brandPrimary.100"
							_hover={{
								bg: "brandPrimary.950",
							}}
							_active={{
								bg: "brandPrimary.950",
							}}
						>
							<Icon
								mx="0px"
								boxSize="4"
								color="brandPrimary.150"
								as={viewValueRadio?.icon}
							/>
							<Hide below="md">
								<Text ml={1} textStyle="primary" color="brandPrimary.150">
									{viewValueRadio?.description}
								</Text>
							</Hide>
						</Button>
					</PopoverTrigger>
					<PopoverContent
						zIndex="popover"
						bg="brandPrimary.900"
						color="brandPrimary.100"
						border="1px solid"
						borderColor="brandPrimary.900"
						w="100%"
						p={1}
					>
						<PopoverBody>
							<RadioGroup
								onChange={handleOnChangeRadioViewOption}
								defaultValue={managerSlice.selectedViewValueCollectionFilter.toString()}
							>
								<Stack direction="column">
									<Text textStyle="primary" color="brandPrimary.100">
										Sort by
									</Text>
									{viewOptions.map((option, index) => {
										return (
											<Radio
												key={`RenderedViewList${index}`}
												value={option.value.toString()}
												colorScheme="gray"
												borderColor="brandPrimary.150"
												_focus={{
													borderColor: "none",
													outline: "none",
													boxShadow: "none",
												}}
												_hover={{
													borderColor: "brandPrimary.100",
													color: "brandPrimary.150",
												}}
											>
												<Flex align="center" gap={2}>
													<Icon
														boxSize="5"
														color="brandPrimary.100"
														as={option.icon}
													/>
													<Text
														textStyle="primary"
														fontWeight="400"
														color="brandPrimary.100"
													>
														{option.description}
													</Text>
												</Flex>
											</Radio>
										);
									})}
								</Stack>
							</RadioGroup>

							<Divider my={3} />

							<Stack direction="column">
								<Text textStyle="primary" color="brandPrimary.100">
									Show in list
								</Text>
								<Stack spacing={1} direction="column">
									{ShowInOptions.map((option, index) => {
										return (
											<Checkbox
												key={`RenderedShowInList${index}`}
												size="sm"
												value={option.value.toString()}
												colorScheme="gray"
												borderColor="brandPrimary.150"
												_focus={{
													borderColor: "none",
													outline: "none",
													boxShadow: "none",
												}}
												{...getCheckboxProps({
													value: option.value.toString(),
												})}
											>
												{option.description}
											</Checkbox>
										);
									})}
								</Stack>
							</Stack>
						</PopoverBody>
					</PopoverContent>
				</Popover>
			</Flex>
		</Flex>
	);
};
