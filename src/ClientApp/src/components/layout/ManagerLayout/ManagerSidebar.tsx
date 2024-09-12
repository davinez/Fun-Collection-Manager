// Design
import {
	Text,
	Flex,
	Icon,
	Button,
	Menu,
	MenuList,
	MenuButton,
	MenuItem,
	MenuDivider,
	useToast,
	useDisclosure,
	Box,
	Drawer,
	DrawerContent,
	BoxProps,
	GridItem,
	CloseButton,
	useMediaQuery,
} from "@chakra-ui/react";
import {
	AiFillCaretDown,
	AiOutlineUser,
	AiFillCloud,
	AiFillSetting,
	AiOutlineLogout,
} from "react-icons/ai";
// Components
import { GroupModal } from "@/components/ui/modal/manager";
import { LoadingBox, ErrorBox } from "@/components/ui/box";
import { GroupNavItem, GeneralNavItem } from "@/components/ui/box/manager";
// Assets

// Types
import type {
	TDynamicCollapseState,
	TGetCollectionGroups,
} from "@/shared/types/api/manager.types";
// General
import { useEffect } from "react";
import { useStore } from "@/store/UseStore";
import { defaultHandlerApiError } from "@/api/useApiClient";
import { useNavigate } from "react-router-dom";
import { renderNodesState } from "@/shared/utils";
import { useGetCollectionsQuery } from "@/api/services/manager";
import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";
import queryClient from "@/api/query-client";

type TGroupsNavItemsProps = {
	data: TGetCollectionGroups;
	onOpenGroupModal: () => void;
};

const GroupsNavItems = ({
	data,
	onOpenGroupModal,
}: TGroupsNavItemsProps): React.ReactElement => {
	// Hooks
	const { managerSlice } = useStore();

	// Update/Set nodes sidebar state on groups change
	useEffect(() => {
		const generatedStateStructure: TDynamicCollapseState[] = renderNodesState(
			data.groups, managerSlice.collectionsNodeState
		);
		managerSlice.setCollectionNodes(generatedStateStructure);
	}, [data.groups]);

	// Handlers
	const handleOnClickCollapseAllCollections = () => {
		managerSlice.closeAllCollectionNodes();
	};

	// Handle Error

	// Return handling
	return (
		<>
			{data.groups.map((group) => {
				return (
					<GroupNavItem
						key={`RenderedGroup_${group.id}`}
						py={2}
						px={3}
						textStyle="primary"
						color="brandPrimary.150"
						group={group}
						totalGroups={data.groups.length}
						onOpenGroupModal={onOpenGroupModal}
						handleOnClickCollapseAllCollections={
							handleOnClickCollapseAllCollections
						}
					>
						{group.name}
					</GroupNavItem>
				);
			})}
		</>
	);
};

type TUpperSectionProps = {
	onCloseDrawer: () => void;
	handleOnClickLogOut: () => void;
	userDisplayName: string | undefined;
};

const UpperSection = ({
	onCloseDrawer,
	handleOnClickLogOut,
	userDisplayName,
}: TUpperSectionProps): React.ReactElement => {
	const [isLargerThan800] = useMediaQuery("(min-width: 800px)");

	// Return handling
	return (
		<Flex
			aria-label="upper-section"
			w="100%"
			pl="3"
			pr="2"
			py="2"
			alignItems="center"
			justifyContent="space-between"
		>
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
						{userDisplayName}
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
						onClick={handleOnClickLogOut}
					>
						Logout
					</MenuItem>
				</MenuList>
			</Menu>

			{!isLargerThan800 && (
				<CloseButton
					size="lg"
					color="brandPrimary.100"
					onClick={onCloseDrawer}
				/>
			)}
		</Flex>
	);
};

type TManagerSidebarContentProps = {
	data: TGetCollectionGroups;
	onCloseDrawer: () => void;
	handleOnClickLogOut: () => void;
};

export const ManagerSidebarContent = ({
	data,
	onCloseDrawer,
	handleOnClickLogOut,
}: TManagerSidebarContentProps): React.ReactElement => {
	// Hooks
	const { authSlice } = useStore();
	const navigate = useNavigate();
	const {
		isOpen: isOpenGroupModal,
		onOpen: onOpenGroupModal,
		onClose: onCloseGroupModal,
	} = useDisclosure();

	// Handlers
	const handleOnClickAllbookmarks = () => {
		navigate("/my/manager/all");
	};

	// Return handling

	return (
		<>
			<GroupModal isOpen={isOpenGroupModal} onClose={onCloseGroupModal} />
			<UpperSection
				onCloseDrawer={onCloseDrawer}
				handleOnClickLogOut={handleOnClickLogOut}
				userDisplayName={authSlice.userDisplayName}
			/>
			<Flex direction="column" as="nav" aria-label="Main Navigation">
				{
					<>
						<GeneralNavItem
							py={2}
							px={3}
							textStyle="primary"
							color="brandPrimary.100"
							icon={AiFillCloud}
							counter={data.allBookmarksCounter}
							_hover={{
								bg: "brandPrimary.900",
							}}
							handleOnClickNavItem={handleOnClickAllbookmarks}
						>
							All Bookmarks
						</GeneralNavItem>
						<GroupsNavItems data={data} onOpenGroupModal={onOpenGroupModal} />
					</>
				}

				{/*** Add here extras divisions sections below collection groups ***/}
			</Flex>
		</>
	);
};

/***** Main Component *****/

type TManagerSidebarProps = {
	isOpenDrawer: boolean;
	onCloseDrawer: () => void;
};

export const ManagerSidebar = ({
	isOpenDrawer,
	onCloseDrawer,
}: TManagerSidebarProps): React.ReactElement => {
	// Hooks
	const {
		isPending: isPendingGetCollectionGroups,
		isError: isErrorGetCollectionGroups,
		error: errorGetCollectionGroups,
		data: getCollectionGroupsResponse,
	} = useGetCollectionsQuery();
	const toast = useToast();
	const [isLargerThan800] = useMediaQuery("(min-width: 800px)");
	const { authSlice } = useStore();
	const { instance, accounts, inProgress } = useMsal();
	const currentAccount = instance.getAccountByHomeId(
		authSlice.accountIdentifiers.homeAccountId as string
	) as AccountInfo;
	const navigate = useNavigate();

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

	// Handlers
	const handleOnClickLogOut = async () => {
		await instance.logoutPopup({
			account: currentAccount,
		});

		authSlice.logout();
		queryClient.removeQueries();

		navigate("/");
	};

	// Return handling

	// Pending
	if (isPendingGetCollectionGroups) {
		return (
			<>
				{isLargerThan800 && (
					<>
						<UpperSection
							onCloseDrawer={onCloseDrawer}
							handleOnClickLogOut={handleOnClickLogOut}
							userDisplayName={authSlice.userDisplayName}
						/>
						<LoadingBox />
					</>
				)}
				<Drawer
					isOpen={isOpenDrawer}
					placement="left"
					onClose={onCloseDrawer}
					returnFocusOnClose={false}
					onOverlayClick={onCloseDrawer}
				>
					{/* Styling according to GridItem sidebar in Layout */}
					<DrawerContent bg="brandPrimary.900">
						<UpperSection
							onCloseDrawer={onCloseDrawer}
							handleOnClickLogOut={handleOnClickLogOut}
							userDisplayName={authSlice.userDisplayName}
						/>
						<LoadingBox />
					</DrawerContent>
				</Drawer>
			</>
		);
	}

	// Erorr
	if (isErrorGetCollectionGroups) {
		return (
			<>
				{isLargerThan800 && (
					<>
						<UpperSection
							onCloseDrawer={onCloseDrawer}
							handleOnClickLogOut={handleOnClickLogOut}
							userDisplayName={authSlice.userDisplayName}
						/>
						<ErrorBox />
					</>
				)}
				<Drawer
					isOpen={isOpenDrawer}
					placement="left"
					onClose={onCloseDrawer}
					returnFocusOnClose={false}
					onOverlayClick={onCloseDrawer}
				>
					{/* Styling according to GridItem sidebar in Layout */}
					<DrawerContent bg="brandPrimary.900">
						<UpperSection
							onCloseDrawer={onCloseDrawer}
							handleOnClickLogOut={handleOnClickLogOut}
							userDisplayName={authSlice.userDisplayName}
						/>
						<ErrorBox />
					</DrawerContent>
				</Drawer>
			</>
		);
	}

	// Fetched
	return (
		<>
			{isLargerThan800 && (
				<ManagerSidebarContent
					data={getCollectionGroupsResponse}
					onCloseDrawer={onCloseDrawer}
					handleOnClickLogOut={handleOnClickLogOut}
				/>
			)}
			<Drawer
				isOpen={isOpenDrawer}
				placement="left"
				onClose={onCloseDrawer}
				returnFocusOnClose={false}
				onOverlayClick={onCloseDrawer}
			>
				{/* Styling according to GridItem sidebar in Layout */}
				<DrawerContent bg="brandPrimary.900">
					<ManagerSidebarContent
						data={getCollectionGroupsResponse}
						onCloseDrawer={onCloseDrawer}
						handleOnClickLogOut={handleOnClickLogOut}
					/>
				</DrawerContent>
			</Drawer>
		</>
	);
};
