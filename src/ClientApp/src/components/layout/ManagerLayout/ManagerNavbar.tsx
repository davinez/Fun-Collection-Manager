// Design
import {
	Icon,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Button,
	Menu,
	MenuList,
	MenuButton,
	MenuItem,
	MenuOptionGroup,
	MenuItemOption,
	MenuDivider,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverCloseButton,
	PopoverBody,
	Flex,
	Text,
	IconButton,
	useMediaQuery,
	useDisclosure,
} from "@chakra-ui/react";
import {
	AiFillCaretDown,
	AiOutlineSearch,
	AiFillFilter,
	AiFillStar,
	AiFillDatabase,
	AiFillClockCircle,
	AiFillChrome,
} from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
// Components
import { URLAddForm, SearchInputField } from "@/components/forms/manager";
// Assets

// Types
import { FilterBookmarksEnum } from "@/shared/types/global.types";
// General
import { useState, useEffect } from "react";
import { useStore } from "@/store/UseStore";
import { Location, useLocation } from "react-router-dom";
import { getEnumKeyByEnumValue } from "@/shared/utils";
import { HelpSearchModal } from "@/components/ui/modal/manager/HelpSearchModal";

type TManagerNavbarProps = {
	onOpenDrawer: () => void;
};

export const ManagerNavbar = ({
	onOpenDrawer,
}: TManagerNavbarProps): React.ReactElement => {
	const filterbookmarkOptions = [
		{
			value: FilterBookmarksEnum.Info,
			icon: AiFillDatabase,
			description: "By title/description",
		},
		{
			value: FilterBookmarksEnum.URL,
			icon: AiFillChrome,
			description: "By URL",
		},
		{
			value: FilterBookmarksEnum.CreationDate,
			icon: AiFillClockCircle,
			description: "By date of creation",
		},
	];

	// Hooks
	const { managerSlice } = useStore();
	const [filterOptionRadio, setFilterOptionRadio] = useState(
		filterbookmarkOptions.find(
			(option) => option.value === managerSlice.getBookmarkParams.filterType
		)
	);
	const {
		isOpen: isOpenHelpModal,
		onOpen: onOpenHelpModal,
		onClose: onCloseHelpModal,
	} = useDisclosure();
	const location: Location = useLocation();
	const [isLargerThan800] = useMediaQuery("(min-width: 800px)");

	// Reset state get params on url change
	useEffect(() => {
		//console.log(location);
		managerSlice.resetGetBookmarkParams();
	}, [location.pathname]);

	// Handlers

	const handleOnChangeBookmarkFilterOption = (value: string | string[]) => {
		if (typeof value === "string") {
			const enumKey = getEnumKeyByEnumValue(FilterBookmarksEnum, value);
			// Only if value of radio option exists in enum
			if (enumKey) {
				managerSlice.setGetBookmarkParamsFilter(FilterBookmarksEnum[enumKey]);
				setFilterOptionRadio(
					filterbookmarkOptions.find((option) => option.value === value)
				);
			}
		}
	};

	// handleOnClickHelpButton
	const handleOnClickHelpButton = () => {
		onOpenHelpModal();
	};

	return (
		<>
			<HelpSearchModal isOpen={isOpenHelpModal} onClose={onCloseHelpModal} />

			{!isLargerThan800 && (
				<IconButton
					onClick={onOpenDrawer}
					bg="brandPrimary.950"
					aria-label="open menu sidebar"
					h="55%"
					icon={<Icon as={FiMenu} color="brandPrimary.150" />}
				/>
			)}

			<InputGroup
				aria-label="page-navbar-leftbuttons-div"
				h="55%"
				w={{
					base: "80%",
					md: "40%",
				}}
				borderLeftRadius={5}
				borderRightRadius={5}
				_focusWithin={{
					border: "1px solid",
					borderColor: "brandSecondary.800",
				}}
			>
				<InputLeftElement h="100%" left="4px" gap="2px" pointerEvents="none">
					<Icon as={AiOutlineSearch} boxSize="5" color="brandPrimary.150" />
					<Icon
						as={filterOptionRadio?.icon}
						boxSize="5"
						color="brandPrimary.150"
					/>
				</InputLeftElement>

				<SearchInputField
					w="100%"
					pl="50px"
					variant="navbar"
					placeholder="Search"
				/>

				<InputRightElement h="100%">
					<Menu placement="bottom-end" closeOnSelect={false}>
						<MenuButton
							as={Button}
							bg="brandPrimary.950"
							_hover={{
								bg: "brandPrimary.800",
							}}
							_active={{
								bg: "brandPrimary.800",
							}}
							h="100%"
							p={0}
						>
							<Icon
								boxSize={textStylesTheme.textStyles.primary.fontSize}
								as={AiFillFilter}
								color="brandPrimary.150"
							/>
							<Icon
								boxSize={textStylesTheme.textStyles.primary.fontSize}
								as={AiFillCaretDown}
								color="brandPrimary.150"
							/>
						</MenuButton>
						<MenuList
							aria-label="filter-options-section"
							bg="brandPrimary.900"
							color="brandPrimary.100"
							border="none"
							w="200px"
							minW={0}
						>
							<MenuOptionGroup
								title="Filter By"
								type="radio"
								value={managerSlice.getBookmarkParams.filterType.toString()}
								onChange={handleOnChangeBookmarkFilterOption}
							>
								{filterbookmarkOptions.map((option, index) => {
									return (
										<MenuItemOption
											key={`RenderedFilterBookmarkOption${index}`}
											bg="brandPrimary.900"
											_hover={{
												bg: "brandSecondary.800",
											}}
											value={option.value.toString()}
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
										</MenuItemOption>
									);
								})}
							</MenuOptionGroup>
							<MenuDivider />
							<MenuItem
								bg="brandPrimary.900"
								textStyle="primary"
								_hover={{
									bg: "brandSecondary.800",
								}}
								onClick={handleOnClickHelpButton}
							>
								Help
							</MenuItem>
						</MenuList>
					</Menu>
				</InputRightElement>
			</InputGroup>

			<Popover placement="bottom-end">
				<PopoverTrigger>
					<Button
						fontSize={textStylesTheme.textStyles.primary.fontSize}
						bg="brandSecondary.600"
						_hover={{
							bg: "brandSecondary.800",
						}}
						px={3}
						py={3}
						h="55%"
						leftIcon={<Icon boxSize="120%" as={AiFillStar} color="black" />}
					>
						Add
					</Button>
				</PopoverTrigger>
				<PopoverContent
					p={2}
					w="25.4rem"
					bg="brandPrimary.950"
					border="1px"
					borderColor="brandPrimary.900"
					color="brandPrimary.100"
					zIndex="popover"
				>
					<PopoverCloseButton p={2} />
					<PopoverBody>
						<URLAddForm />
					</PopoverBody>
				</PopoverContent>
			</Popover>
		</>
	);
};
