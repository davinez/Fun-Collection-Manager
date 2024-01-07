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
	CheckboxGroup,
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

// Assets

// Hooks
import { useGetCollectionsQuery } from "@/api/services/manager";
// Types
import type { TCollection } from "@/shared/types/api/manager.types";
import {
	EventOrValue,
	SortEnum,
	ViewCollectionsEnum,
	ShowInBookmarkEnum,
} from "@/shared/types/global.types";
// General
import { Fragment, useState, useEffect } from "react";
import { useStore } from "@/store/UseStore";
import { defaultHandlerApiError } from "@/api/apiClient";

type THeaderFiltersProps = {
	icon: string | React.ElementType; // Third party icon
	headerName: string;
};

const HeaderFilters = ({ icon, headerName }: THeaderFiltersProps) => {
	const sortOptions = [
		{
			value: SortEnum.dateAsc,
			icon: AiFillClockCircle,
			description: "By date Asc",
		},
		{
			value: SortEnum.dateDesc,
			icon: AiFillClockCircle,
			description: "By date Desc",
		},
		{
			value: SortEnum.nameAsc,
			icon: FaArrowDownAZ,
			description: "By name (A-Z)",
		},
		{
			value: SortEnum.nameDesc,
			icon: FaArrowUpAZ,
			description: "By name (Z-A)",
		},
		{
			value: SortEnum.sitesDesc,
			icon: AiFillChrome,
			description: "Sites (A-Z)",
		},
		{
			value: SortEnum.sitesAsc,
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
	const [sortValueRadio, setSortValueRadio] = useState(sortOptions[0]);
	const [viewValueRadio, setViewValueRadio] = useState(viewOptions[0]);

	// set default values of inputs in default store managet state

	const onChangeRadioSortOption = (nextValue: string) => {
		const newSortValue = sortOptions.find(
			(option) => option.value.toString() === nextValue
		);

		if (newSortValue) {
			setSortValueRadio(newSortValue);
			// set value in store
		}
	};

	const onChangeRadioViewOption = (nextValue: string) => {
		const newViewValue = viewOptions.find(
			(option) => option.value.toString() === nextValue
		);

		if (newViewValue) {
			setViewValueRadio(newViewValue);
			// set value in store
		}
	};

	const onChangeCheckboxShowInOptions = (value: (string | number)[]) => {
		const checkBoxGroupState = value as string[];
		console.log(checkBoxGroupState);
		// set value in store
	};

	const { getCheckboxProps } = useCheckboxGroup({
		defaultValue: [
			ShowInOptions[0]?.value.toString() as string,
			ShowInOptions[1]?.value.toString() as string,
			ShowInOptions[3]?.value.toString() as string,
		],
		onChange: onChangeCheckboxShowInOptions,
	});

	return (
		<Flex>
			<Flex alignItems="center" gap={3}>
				{typeof icon === "string" ? (
					<Image
						borderRadius="2px"
						boxSize="5"
						color="brandPrimary.150"
						objectFit="contain"
						src={icon as string}
						fallbackSrc="/assets/icons/bookmark.svg"
						alt="General Icon"
					/>
				) : (
					<Icon
						boxSize="5"
						color="brandPrimary.150"
						as={icon as React.ElementType}
					/>
				)}
				<Text textStyle="primary">{headerName}</Text>
			</Flex>

			<Flex justify="space-between" gap={2}>
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
								boxSize="3"
								color="brandPrimary.150"
								as={sortValueRadio?.icon}
							/>
							<Hide below="md">
								<Text ml={1} textStyle="secondary" color="brandPrimary.150">
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
								defaultValue={sortValueRadio?.value.toString()}
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
													<Text textStyle="primary" color="brandPrimary.100">
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
								boxSize="3"
								color="brandPrimary.150"
								as={viewValueRadio?.icon}
							/>
							<Hide below="md">
								<Text ml={1} textStyle="secondary" color="brandPrimary.150">
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
								defaultValue={viewValueRadio?.value.toString()}
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
													<Text textStyle="primary" color="brandPrimary.100">
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

export const AllBookmarksPage = (): React.ReactElement => {
	const sortByDateAsc = () => {
		// Sort data response

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
