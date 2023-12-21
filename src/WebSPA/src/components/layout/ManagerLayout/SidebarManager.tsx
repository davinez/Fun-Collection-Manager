// Design
import {
	Text,
	Box,
	Flex,
	Icon,
	Collapse,
	Button,
	IconButton,
	Menu,
	MenuList,
	MenuButton,
	MenuItem,
	MenuDivider,
	useToast,
	type FlexProps,
} from "@chakra-ui/react";
import {
	AiFillCaretDown,
	AiFillFolder,
	AiOutlineUser,
	AiFillCloud,
	AiFillDelete,
	AiFillSetting,
	AiOutlineLogout,
} from "react-icons/ai";
// Components

// Assets

// Hooks
import { useGetCollectionsQuery } from "@/api/services/manager";
import { isAxiosError } from "@/hooks/UseApiClient";
// Types
import type { TCollection } from "@/shared/types/api/manager.types";
import type { TDynamicCollapseState } from "@/shared/types/global.types";
import type { TApiResponse } from "@/shared/types/api/api-responses.types";
// General
import { Fragment, useState, useEffect } from "react";

// function generic and type props explicitly.
type TNavItemProps = {
	leftIcon?: React.ElementType; // Third party icon
	icon?: React.ElementType; // Third party icon
	counter?: number;
	children: React.ReactNode;
	onNavItemClick?: () => void;
};

const NavItem = ({
	leftIcon,
	icon,
	counter,
	onNavItemClick,
	children,
	...rest
}: TNavItemProps & FlexProps): React.ReactElement => {
	const [isHovering, setIsHovering] = useState(false);

	const handleMouseOver = () => {
		setIsHovering(true);
	};

	const handleMouseOut = () => {
		setIsHovering(false);
	};

	return (
		<Flex
			align="center"
			justify="space-between"
			py="2"
			pl="2"
			pr="3"
			cursor="pointer"
			_hover={{
				bg: "brandPrimary.900",
			}}
			textStyle="primary"
			color="brandPrimary.100"
			transition=".15s ease"
			onMouseOver={handleMouseOver}
			onMouseOut={handleMouseOut}
			{...rest}
		>
			<Flex align="center" gap="0" p="0">
				{leftIcon && (
					<Icon
						mx="0px"
						boxSize="3"
						color="brandPrimary.150"
						as={leftIcon}
						onClick={(): void => {
							onNavItemClick?.();
						}}
					/>
				)}
				{icon && (
					<Icon mx="5px" boxSize="5" color="brandPrimary.150" as={icon} />
				)}
				{children}
			</Flex>
			{isHovering ? (
				<Menu>
					<MenuButton
						as={IconButton}
						aria-label="NavItem Options"
						icon={
							<Icon boxSize="4" color="brandPrimary.150" as={AiFillSetting} />
						}
						bg="brandPrimary.900"
						_hover={{
							bg: "brandPrimary.950",
						}}
						h={5}
						py={1}
					/>
					<MenuList>
						<MenuItem>Download</MenuItem>
						<MenuItem>Create a Copy</MenuItem>
						<MenuItem>Mark as Draft</MenuItem>
						<MenuItem>Delete</MenuItem>
						<MenuItem>Attend a Workshop</MenuItem>
					</MenuList>
				</Menu>
			) : (
				<Text my="auto" textStyle="tertiary" color="brandPrimary.150">
					{counter}
				</Text>
			)}
		</Flex>
	);
};

// function generic and type props explicitly.
type TSidebarProps = {};

export const SidebarManager = ({}: TSidebarProps &
	FlexProps): React.ReactElement => {
	// Refactor object response, property for colection data and other
	// porperties for all bookmarks and trash data
	const {
		data: getCollectionsResponse,
		isSuccess: isSuccesGetCollections,
		isPending: isPendingGetCollections,
		error: errorGetCollections,
		isError: isErrorGetCollections,
	} = useGetCollectionsQuery();
	const [collapseState, setCollapseState] = useState<
		TDynamicCollapseState | undefined
	>();
	const toast = useToast();

	useEffect(() => {
		// Data not loaded or state already created
		if (!isSuccesGetCollections || getCollectionsResponse === undefined) return;

		// Collections not empty
		if (getCollectionsResponse.collections)
			renderCollectionsState(getCollectionsResponse.collections);
	}, [getCollectionsResponse]);

	useEffect(() => {
		if (isErrorGetCollections) {
			if (isAxiosError<TApiResponse>(errorGetCollections)) {
				toast({
					title: "Error",
					description: "Error in fetching collections",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				console.error(errorGetCollections.response?.data.messsage as string);
			} else {
				console.error(
					`General error: ${errorGetCollections.name} ${errorGetCollections.message}`
				);
			}
		}
	}, [isErrorGetCollections]);

	const handleClickinCollection = (collectionId: number) => {
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

	const renderCollectionsState = (collections: TCollection[]) => {
		const getIds = (collections: TCollection[]): number[] =>
			collections
				.map((collection) => {
					if (collection.childCollections) {
						return [collection.id, ...getIds(collection.childCollections)];
					}
					return [];
				})
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

	const renderCollectionsNodes = (
		collections: TCollection[]
	): React.ReactElement[] => {
		return collections.map((collection) => {
			if (
				collection.childCollections &&
				collection.childCollections.length > 0
			) {
				return (
					<Fragment key={`RenderedNavItem_${collection.id}`}>
						<NavItem
							leftIcon={AiFillCaretDown}
							icon={AiFillFolder}
							counter={collection.bookmarksCounter}
							onNavItemClick={() => {
								handleClickinCollection(collection.id);
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
							{renderCollectionsNodes(collection.childCollections)}
						</Collapse>
					</Fragment>
				);
			} else {
				return (
					<NavItem
						key={`RenderedNavItem_${collection.id}`}
						icon={AiFillFolder}
						counter={collection.bookmarksCounter}
					>
						{collection.name}
					</NavItem>
				);
			}
		});
	};

	return (
		<>
			<Flex pl="2" py="2" alignItems="center">
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
							bg: "brandPrimary.900",
						}}
						_active={{
							bg: "brandPrimary.900",
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
				{isPendingGetCollections && <NavItem>Loading...</NavItem>}
				{isSuccesGetCollections && (
					<>
						<NavItem
							icon={AiFillCloud}
							counter={getCollectionsResponse.allBookmarksCounter}
						>
							All Bookmarks
						</NavItem>
						<NavItem
							icon={AiFillDelete}
							counter={getCollectionsResponse.trashCounter}
						>
							Trash
						</NavItem>
						<Box py="2" pl="3" color="brandPrimary.150">
							Collections
						</Box>
					</>
				)}
				{
					// Recursion function
					isSuccesGetCollections &&
						getCollectionsResponse.collections &&
						renderCollectionsNodes(getCollectionsResponse.collections)
				}
			</Flex>
		</>
	);
};
