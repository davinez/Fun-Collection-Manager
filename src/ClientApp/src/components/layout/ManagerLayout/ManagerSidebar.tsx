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
import { useState, useEffect } from "react";
import { useStore } from "@/store/UseStore";
import { defaultHandlerApiError } from "@/api/useApiClient";
import { useNavigate } from "react-router-dom";
import { renderNodesState } from "@/shared/utils";
import { useGetCollectionsQuery } from "@/api/services/manager";
import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";

type TGroupsNavItemsProps = {
	data: TGetCollectionGroups;
	onOpenGroupModal: () => void;
};

const GroupsNavItems = ({
	data,
	onOpenGroupModal,
}: TGroupsNavItemsProps): React.ReactElement => {
	// Hooks
	const [nodesState, setNodesState] = useState<TDynamicCollapseState[]>(
		renderNodesState(data.groups)
	);

	// Handlers
	const handleOnClickCollapseAllCollections = () => {
		setNodesState(
			[...(nodesState as TDynamicCollapseState[])].map((node) => {
				return {
					...node,
					isOpen: false,
				};
			})
		);
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
						onOpenGroupModal={onOpenGroupModal}
						handleOnClickCollapseAllCollections={
							handleOnClickCollapseAllCollections
						}
						nodesData={{
							nodesState: nodesState as TDynamicCollapseState[],
							setNodesState: setNodesState as React.Dispatch<
								React.SetStateAction<TDynamicCollapseState[]>
							>,
						}}
					>
						{group.name}
					</GroupNavItem>
				);
			})}
		</>
	);
};

type TUpperSectionProps = {
	handleOnClickLogOut: () => void;
	userDisplayName: string | undefined;
};

const UpperSection = ({
	handleOnClickLogOut,
	userDisplayName,
}: TUpperSectionProps): React.ReactElement => {
	// Return handling
	return (
		<Flex w="100%" pl="3" py="2" alignItems="center">
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
		</Flex>
	);
};

type TManagerSidebarProps = {};

export const ManagerSidebar =
	({}: TManagerSidebarProps): React.ReactElement => {
		// Hooks
		const { authSlice } = useStore();
		const { instance, accounts, inProgress } = useMsal();
		const {
			isPending: isPendingGetCollectionGroups,
			isError: isErrorGetCollectionGroups,
			error: errorGetCollectionGroups,
			data: getCollectionGroupsResponse,
		} = useGetCollectionsQuery();
		const toast = useToast();
		const navigate = useNavigate();
		const {
			isOpen: isOpenGroupModal,
			onOpen: onOpenGroupModal,
			onClose: onCloseGroupModal,
		} = useDisclosure();
		const currentAccount = instance.getAccountByHomeId(
			authSlice.accountIdentifiers.homeAccountId as string
		) as AccountInfo;

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

			navigate("/");
		};

		const handleOnClickAllbookmarks = () => {
			navigate("/my/manager/all");
		};

		// Return handling

		if (isPendingGetCollectionGroups) {
			return (
				<>
					<GroupModal isOpen={isOpenGroupModal} onClose={onCloseGroupModal} />
					<UpperSection
						handleOnClickLogOut={handleOnClickLogOut}
						userDisplayName={authSlice.userDisplayName}
					/>
					<LoadingBox />
				</>
			);
		}

		if (isErrorGetCollectionGroups) {
			return (
				<>
					<GroupModal isOpen={isOpenGroupModal} onClose={onCloseGroupModal} />
					<UpperSection
						handleOnClickLogOut={handleOnClickLogOut}
						userDisplayName={authSlice.userDisplayName}
					/>
					<ErrorBox />
				</>
			);
		}

		return (
			<>
				<GroupModal isOpen={isOpenGroupModal} onClose={onCloseGroupModal} />
				<UpperSection
					handleOnClickLogOut={handleOnClickLogOut}
					userDisplayName={authSlice.userDisplayName}
				/>
				<Flex direction="column" as="nav" aria-label="Main Navigation">
					{getCollectionGroupsResponse && (
						<>
							<GeneralNavItem
								py={2}
								px={3}
								textStyle="primary"
								color="brandPrimary.100"
								icon={AiFillCloud}
								counter={getCollectionGroupsResponse.allBookmarksCounter}
								_hover={{
									bg: "brandPrimary.900",
								}}
								handleOnClickNavItem={handleOnClickAllbookmarks}
							>
								All Bookmarks
							</GeneralNavItem>
							<GroupsNavItems
								data={getCollectionGroupsResponse}
								onOpenGroupModal={onOpenGroupModal}
							/>
						</>
					)}
				</Flex>
			</>
		);
	};
