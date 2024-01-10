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

type THeaderFiltersProps = {
	icon: string | React.ElementType; // Third party icon
	headerName: string;
};

export const HeaderFilters = ({ icon, headerName }: THeaderFiltersProps) => {
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

	const { managerSlice } = useStore();
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

	const onChangeRadioSortOption = (nextValue: string) => {
		const enumValueExists = Object.values(SortEnum).includes(nextValue);
		// Only if value of radio option exists in enum value
		if (enumValueExists) {
			managerSlice.setSelectedSortValueCollectionFilter(nextValue);
			setSortValueRadio(
				sortOptions.find((option) => option.value === nextValue)
			);
		}
	};

	const onChangeRadioViewOption = (nextValue: string) => {
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

	const onChangeCheckboxShowInOptions = (value: (string | number)[]) => {
		const checkBoxGroupState = value as string[];
		managerSlice.setSelectedShowInValueCollectionFilter(checkBoxGroupState);
	};

	const { getCheckboxProps } = useCheckboxGroup({
		defaultValue: managerSlice.selectedShowInValueCollectionFilter.map(
			(value) => value.toString()
		),
		onChange: onChangeCheckboxShowInOptions,
	});

	return (
		<Flex bg="brandPrimary.900" justify="space-between" p={1}>
			<Flex alignItems="center" gap={3} ml={4}>
				{typeof icon === "string" ? (
					<Image
						borderRadius="2px"
						boxSize="6"
						color="brandPrimary.150"
						objectFit="contain"
						src={icon as string}
						fallbackSrc="/assets/icons/bookmark.svg"
						alt="General Icon"
					/>
				) : (
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
							bg="brandPrimary.900"
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
								onChange={onChangeRadioSortOption}
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
													<Text textStyle="primary" fontWeight="400" color="brandPrimary.100">
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
							bg="brandPrimary.900"
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
								onChange={onChangeRadioViewOption}
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
