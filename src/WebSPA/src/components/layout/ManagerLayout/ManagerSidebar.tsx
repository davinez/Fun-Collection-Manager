// Design
import {
	Image,
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
	AiFillCaretRight,
	AiFillFolder,
	AiOutlineUser,
	AiFillCloud,
	AiFillDelete,
	AiFillSetting,
	AiOutlineLogout,
} from "react-icons/ai";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
// Components
import { ManagerGroupModal } from "@/components/ui/modal";
import { LoadingBox } from "@/components/ui/box";
// Assets

// Hooks
import { useGetCollectionsQuery } from "@/api/services/manager";
// Types
import type { TCollection } from "@/shared/types/api/manager.types";
import { FormActionEnum } from "@/shared/types/global.types";
// General
import { Fragment, useState, useEffect } from "react";
import { useStore } from "@/store/UseStore";
import { defaultHandlerApiError } from "@/api/apiClient";
import { useNavigate } from "react-router-dom";

type TMenuOptionsNavItem = {
	isDivider?: boolean;
	description?: string;
	onClickOption?: () => void;
};

// function generic and type props explicitly.
type TNavItemProps = {
	leftIcon?: React.ElementType; // Third party icon
	leftIconSelected?: React.ElementType; // Third party icon
	icon?: string | React.ElementType; // Third party icon
	counter?: number;
	isGroup?: boolean;
	treeDepth?: number;
	collapseChildren?: TCollection[];
	renderCollapseChildren?: (
		collection: TCollection[],
		depth: number
	) => React.ReactElement[];
	menuListOptions?: TMenuOptionsNavItem[];
	children: React.ReactNode;
	onNavItemClick?: () => void;
};

const NavItem = ({
	leftIcon,
	leftIconSelected,
	icon,
	counter,
	onNavItemClick,
	isGroup,
	treeDepth,
	collapseChildren,
	renderCollapseChildren,
	menuListOptions,
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

	const handleOnClickGroup = (event: React.SyntheticEvent<EventTarget>) => {
		// Only activate collapse component if the clicked element it is div or button with show text
		if (event.target instanceof HTMLDivElement) onToggle();

		// Only activate collapse component if the clicked element it is div or button with show text
		if (
			event.target instanceof HTMLButtonElement &&
			(event.target as HTMLButtonElement).textContent === "Show"
		)
			onToggle();
	};

	return (
		<>
			<Flex
				align="center"
				justify="space-between"
				py="2"
				pr="3"
				cursor="pointer"
				textStyle="primary"
				color="brandPrimary.100"
				transition=".15s ease"
				onClick={isGroup ? handleOnClickGroup : onNavItemClick}
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
							as={isOpen ? leftIconSelected : leftIcon}
							onClick={onToggle}
						/>
					)}
					{icon &&
						(typeof icon === "string" ? (
							<Image
								ml="0px"
								mr="5px"
								borderRadius="2px"
								boxSize="5"
								color="brandPrimary.150"
								objectFit="contain"
								src={icon as string}
								fallbackSrc="/assets/icons/bookmark.svg"
								alt="Default Icon"
							/>
						) : (
							<Icon
								ml="0px"
								mr="5px"
								boxSize="5"
								color="brandPrimary.150"
								as={icon as React.ElementType}
							/>
						))}
					{children}
				</Flex>
				{isHovering && menuListOptions !== undefined ? (
					isGroup && !isOpen ? (
						<Button
							color="brandPrimary.100"
							bg="brandPrimary.900"
							_hover={{
								bg: "brandPrimary.950",
							}}
							fontSize={textStylesTheme.textStyles.secondary.fontSize}
							h={5}
							py={1}
							onClick={handleOnClickGroup}
						>
							Show
						</Button>
					) : (
						<Menu>
							<MenuButton
								as={IconButton}
								aria-label="NavItem Options"
								icon={
									<Icon
										boxSize="4"
										color="brandPrimary.150"
										as={AiFillSetting}
									/>
								}
								bg="brandPrimary.900"
								color="brandPrimary.100"
								_hover={{
									bg: "brandPrimary.950",
								}}
								_active={{
									bg: "brandPrimary.950",
								}}
								h={5}
								py={1}
							/>
							<MenuList
								bg="brandPrimary.800"
								color="brandPrimary.100"
								border="1px solid"
								borderColor="brandPrimary.900"
							>
								{menuListOptions.map((option, index) => {
									return option.isDivider ? (
										<MenuDivider
											key={
												isGroup
													? `RenderedGroupOptionsDivider_${index}`
													: `RenderedCollectionOptionsDivider_${index}`
											}
											borderColor="brandPrimary.100"
										/>
									) : (
										<MenuItem
											key={
												isGroup
													? `RenderedGroupOptions_${index}`
													: `RenderedCollectionOptions_${index}`
											}
											bg="brandPrimary.800"
											_hover={{
												bg: "brandSecondary.800",
											}}
											h="100%"
											textStyle="primary"
											onClick={
												option.onClickOption ? option.onClickOption : undefined
											}
										>
											{option.description}
										</MenuItem>
									);
								})}
							</MenuList>
						</Menu>
					)
				) : (
					<Text mr={2} textStyle="tertiary" color="brandPrimary.150">
						{counter}
					</Text>
				)}
			</Flex>
			{renderCollapseChildren && collapseChildren && treeDepth != undefined && (
				<Collapse in={isOpen} animateOpacity>
					{renderCollapseChildren(collapseChildren, treeDepth)}
				</Collapse>
			)}
		</>
	);
};

// function generic and type props explicitly.
type TSidebarProps = {};

export const ManagerSidebar = ({}: TSidebarProps &
	FlexProps): React.ReactElement => {
	// State Hooks
	const { managerSlice } = useStore();
	// General Hooks
	const navigate = useNavigate();
	const {
		isOpen: isOpenGroupModal,
		onOpen: onOpenGroupModal,
		onClose: onCloseGroupModal,
	} = useDisclosure();
	const {
		isPending: isPendingGetCollectionGroups,
		isError: isErrorGetCollectionGroups,
		error: errorGetCollectionGroups,
		data: getCollectionGroupsResponse,
	} = useGetCollectionsQuery();
	const toast = useToast();

	// Handle Error
	useEffect(() => {
		if (isErrorGetCollectionGroups) {
			toast({
				title: "Error",
				description: "Error in fetching collection groups",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			defaultHandlerApiError(errorGetCollectionGroups);
		}
	}, [isErrorGetCollectionGroups]);

	const handleOnClickAllbookmarks = () => {
		navigate("/my/manager/all");
	};

	const handleOnClickCreateCollectionRootGroup = () => {};

	const handleOnClickCollapseAllCollections = () => {};

	const handleOnClickRemoveAllEmptyCollection = () => {};

	const handleOnClickCreateGroup = () => {
		managerSlice.setGroupModalFormAction(FormActionEnum.Add);
		onOpenGroupModal();
	};

	const handleOnClickRenameGroup = (id: number) => {
		managerSlice.setGroupModalFormAction(FormActionEnum.Update);
		managerSlice.setSelectedSidebarGroup(id);
		onOpenGroupModal();
	};

	const handleOnClickRemoveGroup = () => {};

	const handleOnClickCreateNestedCollection = () => {};

	const handleOnClickRenameCollection = () => {};

	const handleOnClickChangeIconCollection = () => {};

	const handleOnClickRemoveCollection = () => {};

	const renderCollectionsNodes = (
		collections: TCollection[],
		treeDepth: number
	): React.ReactElement[] => {
		return collections.map((collection) => {
			if (
				collection.childCollections &&
				collection.childCollections.length > 0
			) {
				return (
					<NavItem
						key={`RenderedCollection_${collection.id}`}
						leftIcon={AiFillCaretRight}
						leftIconSelected={AiFillCaretDown}
						icon={collection.cover}
						counter={collection.bookmarksCounter}
						pl={treeDepth === 5 ? 20 : treeDepth}
						treeDepth={treeDepth + 3}
						collapseChildren={collection.childCollections}
						renderCollapseChildren={renderCollectionsNodes}
						menuListOptions={[
							{
								description: "Create nested collection",
								onClickOption: handleOnClickCreateNestedCollection,
							},
							{
								isDivider: true,
							},
							{
								description: "Rename",
								onClickOption: handleOnClickRenameCollection,
							},
							{
								description: "Change Icon",
								onClickOption: handleOnClickChangeIconCollection,
							},
							{
								description: "Remove",
								onClickOption: handleOnClickRemoveCollection,
							},
						]}
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
						icon={collection.cover}
						counter={collection.bookmarksCounter}
						pl={treeDepth === 5 ? 20 : treeDepth + 3}
						menuListOptions={[
							{
								description: "Create nested collection",
								onClickOption: handleOnClickCreateNestedCollection,
							},
							{
								isDivider: true,
							},
							{
								description: "Rename",
								onClickOption: handleOnClickRenameCollection,
							},
							{
								description: "Change Icon",
								onClickOption: handleOnClickChangeIconCollection,
							},
							{
								description: "Remove",
								onClickOption: handleOnClickRemoveCollection,
							},
						]}
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
			<ManagerGroupModal isOpen={isOpenGroupModal} onClose={onCloseGroupModal} />
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
							bg: "brandPrimary.950",
						}}
						_active={{
							bg: "brandPrimary.950",
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
						borderColor="brandPrimary.900"
						zIndex="sticky"
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
			<Flex direction="column" as="nav" aria-label="Main Navigation">
				{isPendingGetCollectionGroups && <LoadingBox />}
				{getCollectionGroupsResponse !== undefined && (
					<>
						<NavItem
							pl="3"
							icon={AiFillCloud}
							counter={getCollectionGroupsResponse.allBookmarksCounter}
							_hover={{
								bg: "brandPrimary.900",
							}}
							onNavItemClick={handleOnClickAllbookmarks}
						>
							All Bookmarks
						</NavItem>
						<NavItem
							pl="3"
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
					getCollectionGroupsResponse !== undefined &&
						getCollectionGroupsResponse.groups &&
						getCollectionGroupsResponse.groups.map((group) => {
							return group.collections ? (
								<Fragment key={`RenderedGroup_${group.id}`}>
									<NavItem
										py="2"
										pl="3"
										treeDepth={0}
										color="brandPrimary.150"
										isGroup={true}
										collapseChildren={group.collections}
										renderCollapseChildren={renderCollectionsNodes}
										menuListOptions={[
											{
												description: "Create collection",
												onClickOption: handleOnClickCreateCollectionRootGroup,
											},
											{
												description: "Collapse all collections",
												onClickOption: handleOnClickCollapseAllCollections,
											},
											{
												description: "Remove all empty collection",
												onClickOption: handleOnClickRemoveAllEmptyCollection,
											},
											{
												isDivider: true,
											},
											{
												description: "Create group",
												onClickOption: handleOnClickCreateGroup,
											},
											{
												description: "Rename group",
												onClickOption: () => handleOnClickRenameGroup(group.id),
											},
											{
												description: "Remove group",
												onClickOption: handleOnClickRemoveGroup,
											},
										]}
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
