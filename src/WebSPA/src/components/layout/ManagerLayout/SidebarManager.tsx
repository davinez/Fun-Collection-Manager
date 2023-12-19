// Design
import {
	Text,
	Box,
	Flex,
	Icon,
	Collapse,
	Button,
	Menu,
	MenuList,
	MenuButton,
	MenuItem,
	MenuDivider,
	type FlexProps
} from "@chakra-ui/react";
import {
	AiFillCaretDown,
	AiFillFolder,
	AiOutlineUser,
	AiFillCloud,
	AiFillDelete,
	AiFillSetting,
	AiOutlineLogout
} from "react-icons/ai";
// Components

// Assets

// Hooks
import { useGetCollectionsQuery } from "@/api/services/manager";
// Types
import type {
	TGetCollections,
	TChildCollection,
} from "@/shared/types/api/manager.types";
import type { TDynamicCollapseState } from "@/shared/types/global.types";
// General
import {  Fragment, useState, useEffect } from "react";


// function generic and type props explicitly.
type TNavItemProps = {
	icon?: React.ElementType; // Third party icon
	children: React.ReactNode;
	onNavItemClick?: () => void;
};

const NavItem = ({
	icon,
	onNavItemClick,
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
				onNavItemClick?.();
			}}
			pl="2"
			{...rest}
		>
			{icon && <Icon mx="2" boxSize="5" as={icon} />}
			{children}
		</Flex>
	);
};

// function generic and type props explicitly.
type TSidebarProps = {

};

export const SidebarManager = ({}: TSidebarProps & FlexProps): React.ReactElement => {
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
							onNavItemClick={() => {
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
