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
	useDisclosure,
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
import type {
	TCollection,
	TGetCollectionGroups,
} from "@/shared/types/api/manager.types";
import type { TDynamicCollapseState } from "@/shared/types/global.types";
import type { TApiResponse } from "@/shared/types/api/api-responses.types";
// General
import { Fragment, useState, useEffect } from "react";

// function generic and type props explicitly.
type TNavItemProps = {
	leftIcon?: React.ElementType; // Third party icon
	icon?: React.ElementType; // Third party icon
	counter?: number;
	isGroup?: boolean;
	collapseChildren?: TCollection[];
	renderCollapseChildren?: (collection: TCollection[]) => React.ReactElement[];
	children: React.ReactNode;
	onNavItemClick?: () => void;
};

const NavItem = ({
	leftIcon,
	icon,
	counter,
	onNavItemClick,
	isGroup,
	collapseChildren,
	renderCollapseChildren,
	children,
	...rest
}: TNavItemProps & FlexProps): React.ReactElement => {
	const [isHovering, setIsHovering] = useState(false);
	const { isOpen, onToggle } = useDisclosure();

	const handleMouseOver = () => {
		setIsHovering(true);
	};

	const handleMouseOut = () => {
		setIsHovering(false);
	};

	return (
		<>
			<Flex
				align="center"
				justify="space-between"
				py="2"
				pl="2"
				pr="3"
				cursor="pointer"
				textStyle="primary"
				color="brandPrimary.100"
				transition=".15s ease"
				onClick={isGroup ? onToggle : undefined}
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
							onClick={onToggle}
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
			{renderCollapseChildren && collapseChildren && (
				<Collapse in={isOpen} animateOpacity>
					{renderCollapseChildren(collapseChildren)}
				</Collapse>
			)}
		</>
	);
};

// function generic and type props explicitly.
type TSidebarProps = {};

export const SidebarManager = ({}: TSidebarProps &
	FlexProps): React.ReactElement => {
	// Falta pasar como prop el contenido del menu para cada NavItem

	const {
		data: getCollectionGroupsResponse,
		isSuccess: isSuccesGetCollectionGroups,
		isPending: isPendingGetCollectionGroups,
		error: errorGetCollectionGroups,
		isError: isErrorGetCollectionGroups,
	} = useGetCollectionsQuery();
	const [collapseState, setCollapseState] = useState<
		TDynamicCollapseState | undefined
	>();
	const toast = useToast();

	useEffect(() => {
		if (isErrorGetCollectionGroups) {
			if (isAxiosError<TApiResponse>(errorGetCollectionGroups)) {
				toast({
					title: "Error",
					description: "Error in fetching collection groups",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				console.error(
					errorGetCollectionGroups.response?.data.messsage as string
				);
			} else {
				console.error(
					`General error: ${errorGetCollectionGroups.name} ${errorGetCollectionGroups.message}`
				);
			}
		}
	}, [isErrorGetCollectionGroups]);

	const renderCollectionsNodes = (
		collections: TCollection[]
	): React.ReactElement[] => {
		return collections.map((collection) => {
			if (
				collection.childCollections &&
				collection.childCollections.length > 0
			) {
				return (
					<NavItem
						key={`RenderedCollection_${collection.id}`}
						leftIcon={AiFillCaretDown}
						icon={AiFillFolder}
						counter={collection.bookmarksCounter}
						collapseChildren={collection.childCollections}
						renderCollapseChildren={renderCollectionsNodes}
						_hover={{
							bg: "brandPrimary.900",
						}}
					>
						{collection.name}
					</NavItem>
				);
			} else {
				return (
					<NavItem
						key={`RenderedCollection_${collection.id}`}
						icon={AiFillFolder}
						counter={collection.bookmarksCounter}
						_hover={{
							bg: "brandPrimary.900",
						}}
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
				{isPendingGetCollectionGroups && <NavItem>Loading...</NavItem>}
				{isSuccesGetCollectionGroups && (
					<>
						<NavItem
							icon={AiFillCloud}
							counter={getCollectionGroupsResponse.allBookmarksCounter}
							_hover={{
								bg: "brandPrimary.900",
							}}
						>
							All Bookmarks
						</NavItem>
						<NavItem
							icon={AiFillDelete}
							counter={getCollectionGroupsResponse.trashCounter}
							_hover={{
								bg: "brandPrimary.900",
							}}
						>
							Trash
						</NavItem>
					</>
				)}
				{
					// Recursion function
					isSuccesGetCollectionGroups &&
						getCollectionGroupsResponse.groups &&
						getCollectionGroupsResponse.groups.map((group) => {
							return group.collections ? (
								<Fragment key={`RenderedGroup_${group.id}`}>
									<NavItem
										py="2"
										pl="3"
										color="brandPrimary.150"
										isGroup={true}
										collapseChildren={group.collections}
										renderCollapseChildren={renderCollectionsNodes}
									>
										{group.name}
									</NavItem>
								</Fragment>
							) : (
								<NavItem py="2" pl="3" color="brandPrimary.150">
									{group.name}
								</NavItem>
							);
						})
				}
			</Flex>
		</>
	);
};
