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
} from "react-icons/ai";
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

type TSidebarContentProps = {
	//color: string;
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

const SidebarContent = ({
	...rest
}: TSidebarContentProps & BoxProps): React.ReactElement => {
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
		<Box
			as="nav"
			pos="fixed"
			top="0"
			left="0"
			zIndex="sticky"
			h="full"
			pb="10"
			overflowX="hidden"
			overflowY="auto"
			w="300px"
			bg="brandPrimary.900"		
			{...rest}
		>
			<Flex pl="2" py="2" alignItems="center">
				<Menu>
					<MenuButton
						as={Button}
						rounded="base"
						variant="ghost"
						iconSpacing="2px"
						leftIcon={<Icon as={AiOutlineUser} />}
						rightIcon={<Icon as={AiFillCaretDown} />}
						textStyle="primary"
						color="brandPrimary.100"
						_hover={{
							bg: "brandPrimary.800",
						}}
						_active={{
							bg: "brandPrimary.800",
						}}
						p="1"
					>
						<Text ml="2">david.ibanezn</Text>
					</MenuButton>
					<MenuList
						bg="brandPrimary.900"
						textStyle="primary"
						color="brandPrimary.100"
					>
						<MenuItem
							bg="brandPrimary.900"
							_hover={{
								bg: "brandSecondary.800",
							}}
							h="100%"
							icon={<Icon as={AiFillSetting} />}
						>
							Settings
						</MenuItem>
						<MenuDivider />
						<MenuItem
							bg="brandPrimary.900"
							_hover={{
								bg: "brandSecondary.800",
							}}
							icon={<Icon as={AiOutlineLogout} />}
						>
							Logout
						</MenuItem>
					</MenuList>
				</Menu>
			</Flex>
			<Flex
				direction="column"
				as="nav"
				fontSize="sm"
				color="gray.600"
				aria-label="Main Navigation"
			>
				<NavItem icon={AiFillCloud}>All Bookmarks</NavItem>
				<NavItem icon={AiFillDelete}>Trash</NavItem>
				<Box py="2" pl="3" textStyle="primary" color="brandPrimary.150">
					Collections
				</Box>

				{
					// Recursion function
					getCollectionsResponse && renderCollections(getCollectionsResponse)
				}
			</Flex>
		</Box>
	);
};

// 2 secciones en navitem, la fecha despliega submenus y el resto seleccioan esa coleccion

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
			gridTemplateColumns={"300px 1fr"}
			gridTemplateRows={"3rem 1fr"}
			gap="0"
			minH="100vh"
			bg="gray.50"
		>
			<GridItem as="aside" area={"sidebar"} bg="brand.600">
				<SidebarContent />
			</GridItem>

			<GridItem
				as="header"
				display="flex"
				area={"navbar"}
				alignItems="center"
				justifyContent="space-between"
				position="sticky"
				top="0"
				w="full"
				h="full"
				bg="brandPrimary.900"
			>
				<InputGroup
					aria-label="page-navbar-leftbuttons-div"
					w="96"
					display={{
						base: "none",
						md: "flex",
					}}
				>
					<InputLeftElement color="gray.500">
						<AiOutlineEllipsis />
					</InputLeftElement>
					<Input placeholder="Search for articles..." />
				</InputGroup>

				<Flex aria-label="page-navbar-rightbuttons-div" align="center">
					<Icon color="gray.500" as={AiOutlineEllipsis} cursor="pointer" />
					<Avatar ml="4" size="sm" name="davinez" src="" cursor="pointer" />
				</Flex>
			</GridItem>

			<GridItem as="main" area={"main"} w="full">
				<Suspense>{outlet}</Suspense>
			</GridItem>
		</Grid>
	);
}
