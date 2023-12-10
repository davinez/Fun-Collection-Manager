// Design
import {
	Text,
	Box,
	Flex,
	Icon,
	Collapse,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	IconButton,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Input,
	Avatar,
	Button,
	Menu,
	MenuList,
	MenuButton,
	MenuItem,
	MenuDivider,
	Grid,
	GridItem,
	ButtonGroup,
	useDisclosure,
	useColorModeValue,
	type FlexProps,
	type BoxProps,
} from "@chakra-ui/react";
import {
	AiFillCaretRight,
	AiFillCaretDown,
	AiFillFolder,
	AiFillFolderOpen,
	AiOutlineEllipsis,
	AiOutlineMenu,
	AiOutlineUser,
	AiFillCloud,
	AiFillDelete,
	AiFillSetting,
	AiOutlineLogout,
	AiOutlineSearch,
	AiFillFilter,
} from "react-icons/ai";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
import colorStylesTheme from "shared/styles/theme/foundations/colors";
// Components

// Assets

// Hooks
import { useOutlet } from "react-router-dom";
import { useGetCollectionsQuery } from "@/api/services/manager";
import { isAxiosError } from "@/hooks/UseApiClient";
// Types
import type {
	TGetCollections,
	TChildCollection,
} from "@/shared/types/api/manager.types";
import type { TDynamicCollapseState } from "@/shared/types/global.types";

// General
import { Suspense, Fragment, useState, useEffect } from "react";

// function generic and type props explicitly.
type TNavItemProps = {
	icon?: React.ElementType; // Third party icon
	children: React.ReactNode;
	onClick?: () => void;
};

const NavItem = ({
	icon,
	onClick,
	children,
	...rest
}: TNavItemProps & FlexProps): React.ReactElement => {
	return (
		<Flex
			align="center"
			py="2"
			cursor="pointer"
			_hover={{
				bg: "brandPrimary.800",
			}}
			textStyle="primary"
			color="brandPrimary.100"
			transition=".15s ease"
			onClick={(): void => {
				onClick?.();
			}}
			pl="2"
			{...rest}
		>
			{icon && <Icon mx="2" boxSize="5" as={icon} />}
			{children}
		</Flex>
	);
};

const SidebarContent = (): React.ReactElement => {
	const {
		data: getCollectionsResponse,
		isLoading: isLoadingGetCollections,
		error: errorGetCollections,
	} = useGetCollectionsQuery();
	const [collapseState, setCollapseState] = useState<
		TDynamicCollapseState | undefined
	>();

	useEffect(() => {
		// Data not loaded or state already created
		if (!getCollectionsResponse || collapseState) return;

		renderCollectionsState(getCollectionsResponse);
	}, [getCollectionsResponse]);

	const handleClick = (collectionId: number) => {
		setCollapseState((prevState) => {
			if (prevState) {
				return {
					...prevState,
					settings: prevState.settings.map((item) =>
						item.id === collectionId ? { ...item, open: !item.open } : item
					),
				};
			}
		});
	};

	const renderCollectionsState = (collections: TGetCollections[]) => {
		const getIds = (collections: TGetCollections[]): number[] =>
			collections
				.map((collection) => [
					collection.id,
					...getIds(collection.childCollections),
				])
				.flat();

		const stateObject = getIds(collections).reduce((accum, current) => {
			accum =
				Object.keys(accum).length > 0
					? // state already initialized with collapse state
					  {
							...accum,
							settings: [...accum.settings, { id: current, open: false }],
					  }
					: // state not initialized with collapse state
					  { settings: [{ id: current, open: false }] };
			return accum;
		}, {} as TDynamicCollapseState);
		setCollapseState(stateObject);
	};

	const renderCollections = (
		collections: TGetCollections[] | TChildCollection[]
	): React.ReactElement[] => {
		return collections.map((collection) => {
			if (collection.childCollections) {
				if (isLoadingGetCollections) return <NavItem>Loading...</NavItem>;

				if (errorGetCollections) return <NavItem>Error in Collections</NavItem>;

				return (
					<Fragment key={`RenderedNavItem_${collection.id}`}>
						<NavItem
							icon={AiFillFolder}
							onClick={() => {
								handleClick(collection.id);
							}}
						>
							{collection.name}
						</NavItem>
						<Collapse
							in={
								collapseState?.settings.find(
									(item) => item.id === collection.id
								)?.open
							}
						>
							{renderCollections(collection.childCollections)}
						</Collapse>
					</Fragment>
				);
			} else {
				return (
					<NavItem key={`RenderedNavItem_${collection.id}`} icon={AiFillFolder}>
						{collection.name}
					</NavItem>
				);
			}
		});
	};

	return (
		<>
			<Flex pl="3" py="2" alignItems="center">
				<Menu>
					<MenuButton
						as={Button}
						rounded="base"
						variant="ghost"
						iconSpacing="2px"
						leftIcon={<Icon as={AiOutlineUser} />}
						rightIcon={<Icon as={AiFillCaretDown} />}
						color="brandPrimary.100"
						_hover={{
							bg: "brandPrimary.800",
						}}
						_active={{
							bg: "brandPrimary.800",
						}}
						p="1"
					>
						<Text textStyle="primary" ml="2">
							david.ibanezn
						</Text>
					</MenuButton>
					<MenuList
						bg="brandPrimary.800"
						color="brandPrimary.100"
						border="1px solid"
					>
						<MenuItem
							bg="brandPrimary.800"
							_hover={{
								bg: "brandSecondary.800",
							}}
							h="100%"
							icon={<Icon as={AiFillSetting} />}
							textStyle="primary"
						>
							Settings
						</MenuItem>
						<MenuDivider />
						<MenuItem
							bg="brandPrimary.800"
							_hover={{
								bg: "brandSecondary.800",
							}}
							icon={<Icon as={AiOutlineLogout} />}
							textStyle="primary"
						>
							Logout
						</MenuItem>
					</MenuList>
				</Menu>
			</Flex>
			<Flex
				direction="column"
				as="nav"
				textStyle="primary"
				aria-label="Main Navigation"
			>
				<NavItem icon={AiFillCloud}>All Bookmarks</NavItem>
				<NavItem icon={AiFillDelete}>Trash</NavItem>
				<Box py="2" pl="3" color="brandPrimary.150">
					Collections
				</Box>

				{
					// Recursion function
					getCollectionsResponse && renderCollections(getCollectionsResponse)
				}
			</Flex>
		</>
	);
};

const NavbarContent = (): React.ReactElement => {
	return (
		<>
			<InputGroup
				aria-label="page-navbar-leftbuttons-div"
				h="55%"
				w={{
					base: "80%",
					md: "40%",
				}}
			>
				<InputLeftElement h="100%">
					<Icon
						as={AiOutlineSearch}
						boxSize={textStylesTheme.textStyles.primary.fontSize}
						color="brandPrimary.150"
					/>
				</InputLeftElement>

				<Input variant="navbar" placeholder="Search for articles..." />

				<InputRightElement h="100%">
					<Menu placement="bottom-end">
						<MenuButton
							_hover={{
								bg: "brandPrimary.800",
							}}
							as={Button}
							bg={colorStylesTheme.colors.brandPrimary[950]}
							p="5px"
							w="100%"
							h="100%"
							rightIcon={
								<Icon
									boxSize={textStylesTheme.textStyles.primary.fontSize}
									as={AiFillCaretDown}
									color="brandPrimary.150"
								/>
							}
						>
							<Icon
								boxSize={textStylesTheme.textStyles.primary.fontSize}
								as={AiFillFilter}
								color="brandPrimary.150"
							/>
						</MenuButton>
						<MenuList
							bg="brandPrimary.800"
							color="brandPrimary.100"
							border="none"
						>
							<MenuItem
								bg="brandPrimary.800"
								_hover={{
									bg: "brandSecondary.800",
								}}
							>
								Link 1
							</MenuItem>
							<MenuItem
								bg="brandPrimary.800"
								_hover={{
									bg: "brandSecondary.800",
								}}
							>
								Link 2
							</MenuItem>
						</MenuList>
					</Menu>
				</InputRightElement>
			</InputGroup>

			<ButtonGroup
				aria-label="page-navbar-rightbuttons-div"
				size="sm"
				isAttached
				variant="outline"
			>
				<Button>Save</Button>
				<IconButton
					aria-label="Add to friends"
					icon={
						<Icon
							boxSize={textStylesTheme.textStyles.primary.fontSize}
							as={AiFillCaretDown}
							color="brandPrimary.150"
						/>
					}
				/>
			</ButtonGroup>
		</>
	);
};

export default function ManagerLayout(): JSX.Element {
	const outlet = useOutlet();

	return (
		// <Box
		// 	as="section"
		// 	bg="pink"
		// 	minH="100vh"
		// >
		// 	<SidebarContent
		// 		display={{
		// 			base: "none",
		// 			md: "unset",
		// 		}}
		// 	/>
		// 	<Drawer
		// 		isOpen={sidebar.isOpen}
		// 		onClose={sidebar.onClose}
		// 		placement="left"
		// 	>
		// 		<DrawerOverlay />
		// 		<DrawerContent>
		// 			<SidebarContent w="full" borderRight="none" />
		// 		</DrawerContent>
		// 	</Drawer>
		// 	<Box
		// 		ml={{
		// 			base: 0,
		// 			md: 60,
		// 		}}
		// 		transition=".3s ease"
		// 	>
		// 		<Flex
		// 			as="header"
		// 			align="center"
		// 			justify="space-between"
		// 			w="full"
		// 			px="4"
		// 			bg="white"
		// 			h="3rem"
		// 		>
		// 			<IconButton
		// 				aria-label="Menu"
		// 				display={{
		// 					base: "inline-flex",
		// 					md: "none",
		// 				}}
		// 				onClick={sidebar.onOpen}
		// 				icon={<AiOutlineEllipsis />}
		// 				size="sm"
		// 			/>
		// 			<InputGroup
		// 				w="96"
		// 				display={{
		// 					base: "none",
		// 					md: "flex",
		// 				}}
		// 			>
		// 				<InputLeftElement color="gray.500">
		// 					<AiOutlineEllipsis />
		// 				</InputLeftElement>
		// 				<Input placeholder="Search for articles..." />
		// 			</InputGroup>

		// 			<Flex align="center">
		// 				<Icon color="gray.500" as={AiOutlineEllipsis} cursor="pointer" />
		// 				<Avatar ml="4" size="sm" name="davinez" src="" cursor="pointer" />
		// 			</Flex>
		// 		</Flex>

		// 		<Box as="main" p="4">
		// 			<Suspense>{outlet}</Suspense>
		// 		</Box>
		// 	</Box>
		// </Box>

		// <Box aria-label="page-full-div" as="section" bg="pink" minH="100vh">
		// 	<SidebarContent
		// 	aria-label="page-sidebar"
		// 		display={{
		// 			base: "none",
		// 			md: "unset",
		// 		}}
		// 	/>
		// 	<Box
		// 	  aria-label="page-mainandnavbar-div"
		// 		ml={{
		// 			base: 0,
		// 			md: 60,
		// 		}}
		// 		transition=".3s ease"
		// 	>
		// 		<Flex
		// 		  aria-label="page-navbar-div"
		// 			as="header"
		// 			align="center"
		// 			justify="space-between"
		// 			w="full"
		// 			px="4"
		// 			bg="white"
		// 			h="3rem"
		// 		>
		// 			<InputGroup
		// 			aria-label="page-navbar-leftbuttons-div"
		// 				w="96"
		// 				display={{
		// 					base: "none",
		// 					md: "flex",
		// 				}}
		// 			>
		// 				<InputLeftElement color="gray.500">
		// 					<AiOutlineEllipsis />
		// 				</InputLeftElement>
		// 				<Input placeholder="Search for articles..." />
		// 			</InputGroup>

		// 			<Flex aria-label="page-navbar-rightbuttons-div" align="center">
		// 				<Icon color="gray.500" as={AiOutlineEllipsis} cursor="pointer" />
		// 				<Avatar ml="4" size="sm" name="davinez" src="" cursor="pointer" />
		// 			</Flex>
		// 		</Flex>

		// 		<Box aria-label="page-main-content" as="main" p="4">
		// 			<Suspense>{outlet}</Suspense>
		// 		</Box>
		// 	</Box>
		// </Box>

		<Grid
			templateAreas={`"sidebar navbar" "sidebar main"`}
			gridTemplateColumns="300px 1fr"
			gridTemplateRows="3rem 1fr"
			gap="0"
			minH="100vh"
			bg="gray.50"
		>
			<GridItem
				as="aside"
				area="sidebar"
				pos="fixed"
				top="0"
				left="0"
				zIndex="sticky"
				h="full"
				pb="10"
				overflowX="hidden"
				overflowY="auto"
				w="300px"
				bg="brandPrimary.800"
				borderRight="1px solid"
				borderRightColor="brandPrimary.150"
			>
				<SidebarContent />
			</GridItem>

			<GridItem
				as="header"
				display="flex"
				area="navbar"
				alignItems="center"
				justifyContent="space-between"
				position="sticky"
				top="0"
				w="full"
				h="full"
				bg="brandPrimary.800"
				borderBottom="1px solid"
				borderBottomColor="brandPrimary.150"
				pl="15px"
			>
				<NavbarContent />
			</GridItem>

			<GridItem as="main" area="main" w="full">
				<Suspense>{outlet}</Suspense>
			</GridItem>
		</Grid>
	);
}
