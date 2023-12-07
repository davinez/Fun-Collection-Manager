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
	useDisclosure,
	useColorModeValue,
	type FlexProps,
	type BoxProps,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import {
	AiFillCaretRight,
	AiFillCaretDown,
	AiFillFolder,
	AiFillFolderOpen,
	AiOutlineEllipsis,
	AiOutlineMenu,
	AiOutlineUser,
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
			px="4"
			pl="4"
			py="3"
			cursor="pointer"
			color="inherit"
			_dark={{
				color: "gray.400",
			}}
			_hover={{
				bg: "gray.100",
				_dark: {
					bg: "gray.900",
				},
				color: "gray.900",
			}}
			fontWeight="semibold"
			transition=".15s ease"
			onClick={(): void => {
				onClick?.();
			}}
			{...rest}
		>
			{icon && (
				<Icon
					mx="2"
					boxSize="4"
					_groupHover={{
						color: "gray.100",
					}}
					as={icon}
				/>
			)}
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
							icon={AiOutlineEllipsis}
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
					<NavItem
						key={`RenderedNavItem_${collection.id}`}
						icon={AiOutlineEllipsis}
					>
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
			bg="white"
			_dark={{
				bg: "gray.800",
			}}
			color="inherit"
			borderRightWidth="1px"
			w="60"
			{...rest}
		>
			<Flex px="4" py="5" alignItems="center">
				<Menu>
					<MenuButton
						as={Button}
						rounded={"base"}
						variant={"ghost"}	
						iconSpacing='2px'				
						leftIcon={<Icon as={AiOutlineUser} />}
						rightIcon={<Icon as={AiFillCaretDown} />}
					>
						<Text
							textStyle='title'
							color="brandPrimary.500"
							ml="2"
						>
							david.ibanezn
						</Text>
					</MenuButton>
					<MenuList>
						<MenuItem>Settings</MenuItem>
						<MenuDivider />
						<MenuItem>Logout</MenuItem>
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
	const sidebar = useDisclosure();
	const outlet = useOutlet();

	return (
		<Box
			as="section"
			bg="gray.50"
			_dark={{
				bg: "gray.700",
			}}
			minH="100vh"
		>
			<SidebarContent
				display={{
					base: "none",
					md: "unset",
				}}
			/>
			<Drawer
				isOpen={sidebar.isOpen}
				onClose={sidebar.onClose}
				placement="left"
			>
				<DrawerOverlay />
				<DrawerContent>
					<SidebarContent w="full" borderRight="none" />
				</DrawerContent>
			</Drawer>
			<Box
				ml={{
					base: 0,
					md: 60,
				}}
				transition=".3s ease"
			>
				<Flex
					as="header"
					align="center"
					justify="space-between"
					w="full"
					px="4"
					bg="white"
					_dark={{
						bg: "gray.800",
					}}
					borderBottomWidth="1px"
					color="inherit"
					h="14"
				>
					<IconButton
						aria-label="Menu"
						display={{
							base: "inline-flex",
							md: "none",
						}}
						onClick={sidebar.onOpen}
						icon={<AiOutlineEllipsis />}
						size="sm"
					/>
					<InputGroup
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

					<Flex align="center">
						<Icon color="gray.500" as={AiOutlineEllipsis} cursor="pointer" />
						<Avatar ml="4" size="sm" name="davinez" src="" cursor="pointer" />
					</Flex>
				</Flex>

				<Box as="main" p="4">
					<Suspense>{outlet}</Suspense>
				</Box>
			</Box>
		</Box>
	);
}
