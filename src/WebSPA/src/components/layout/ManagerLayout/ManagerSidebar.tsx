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
import { ManagerGroupModal } from "@/components/ui/modal";
import { LoadingBox, ErrorBox } from "@/components/ui/box";
import { NoRecursiveNavItem } from "@/components/ui/box/manager";
// Assets

// Hooks
import { useGetCollectionsQuery } from "@/api/services/manager";
// Types
import type {
	TGetCollectionGroups,
	TDynamicCollapseState,
} from "@/shared/types/api/manager.types";
import { FormActionEnum } from "@/shared/types/global.types";
// General
import { useState, useEffect } from "react";
import { useStore } from "@/store/UseStore";
import { defaultHandlerApiError } from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import { renderNodesState } from "@/shared/utils";

type TMainContentProps = {
	data: TGetCollectionGroups;
};

const MainContent = ({ data }: TMainContentProps): React.ReactElement => {
	// State Hooks
	const { managerSlice } = useStore();
	const [nodesState, setNodesState] = useState<TDynamicCollapseState[]>(
		renderNodesState(data.groups)
	);
	// General Hooks
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

	const handleOnClickCreateCollectionRootGroup = () => {};

	const handleOnClickCollapseAllCollections = () => {
		setNodesState(
			[...nodesState].map((node) => {
				return {
					...node,
					isOpen: false,
				};
			})
		);
	};

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

	return (
		<>
			<ManagerGroupModal
				isOpen={isOpenGroupModal}
				onClose={onCloseGroupModal}
			/>
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
				<NoRecursiveNavItem
					pl="3"
					icon={AiFillCloud}
					counter={data.allBookmarksCounter}
					_hover={{
						bg: "brandPrimary.900",
					}}
					handleOnClickNavItem={handleOnClickAllbookmarks}
				>
					All Bookmarks
				</NoRecursiveNavItem>
				{data.groups.map((group) => {
					return (
						<NoRecursiveNavItem
							key={`RenderedGroup_${group.id}`}
							py="2"
							pl="3"
							color="brandPrimary.150"
							groupId={group.id}
							nodesData={{
								nodesChildren: group.collections,
								nodesState: nodesState,
								setNodesState: setNodesState,
							}}
							menuListOptions={[
								{
									description: "Create collection",
									handleOnClickMenuOption:
										handleOnClickCreateCollectionRootGroup,
								},
								{
									description: "Collapse all collections",
									handleOnClickMenuOption: handleOnClickCollapseAllCollections,
								},
								{
									isDivider: true,
								},
								{
									description: "Create group",
									handleOnClickMenuOption: handleOnClickCreateGroup,
								},
								{
									description: "Rename group",
									handleOnClickMenuOption: () =>
										handleOnClickRenameGroup(group.id),
								},
								{
									description: "Remove group",
									handleOnClickMenuOption: handleOnClickRemoveGroup,
								},
							]}
						>
							{group.name}
						</NoRecursiveNavItem>
					);
				})}
			</Flex>
		</>
	);
};

type TSidebarProps = {};

export const ManagerSidebar = ({}: TSidebarProps): React.ReactElement => {
	// State Hooks

	// General Hooks
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

	// Handlers

	// Return handling
	if (isPendingGetCollectionGroups) return <LoadingBox />;

	if (isErrorGetCollectionGroups) return <ErrorBox />;

	return <MainContent data={getCollectionGroupsResponse} />;
};
