// Design
import {
	Text,
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
	useDisclosure,
	useToast,
	type FlexProps,
} from "@chakra-ui/react";
import { AiFillSetting } from "react-icons/ai";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
// Components
import { RecursiveNavItem } from "@/components/ui/box/manager";
import { CollectionAddForm } from "components/forms/manager";
// Assets

// Types
import {
	deleteGroupFormPayload,
	type TDynamicCollapseState,
	type TCollectionGroup,
	type TDeleteGroupPayload,
} from "@/shared/types/api/manager.types";
import { FormActionEnum } from "@/shared/types/global.types";
// General
import { useDeleteGroupMutation } from "@/api/services/manager";
import { useState } from "react";
import { useStore } from "@/store/UseStore";
import queryClient from "@/api/query-client";
import { defaultHandlerApiError } from "@/api/useApiClient";

type TGroupNavItemProps = {
	group: TCollectionGroup;
	onOpenGroupModal: () => void;
	handleOnClickCollapseAllCollections: () => void;
	children: React.ReactNode;
};

export const GroupNavItem = ({
	group,
	onOpenGroupModal,
	handleOnClickCollapseAllCollections,
	children,
	...rest
}: TGroupNavItemProps & FlexProps): React.ReactElement => {
	// Hooks
	const { managerSlice } = useStore();
	const [isHovering, setIsHovering] = useState(false);
	const [isShowingInput, setIsShowingInput] = useState(false);
	const { isOpen, onToggle } = useDisclosure();
	const toast = useToast();
	const deleteGroupMutation = useDeleteGroupMutation();

	// handlers

	const handleMouseOver = () => {
		setIsHovering(true);
	};

	const handleMouseOut = () => {
		setIsHovering(false);
	};

	const handleOnClickGroupNavItem = (
		event: React.SyntheticEvent<EventTarget>
	) => {
		// Only activate collapse component if the clicked element it is div or text of group or button with show text
		if (
			event.target instanceof HTMLDivElement ||
			event.target instanceof HTMLParagraphElement ||
			(event.target instanceof HTMLButtonElement &&
				(event.target as HTMLButtonElement).textContent === "Show")
		)
			onToggle();

		if (isShowingInput) setIsShowingInput(false);
	};

	const handleOnClickCreateCollectionRootGroup = () => {
		setIsShowingInput(true);
	};

	const handleOnClickCreateGroup = () => {
		managerSlice.setGroupModalFormAction(FormActionEnum.Add);
		onOpenGroupModal();
	};

	const handleOnClickRenameGroup = (id: number) => {
		managerSlice.setGroupModalFormAction(FormActionEnum.Update);
		managerSlice.setSelectedSidebarGroupId(id);
		onOpenGroupModal();
	};

	const handleOnClickRemoveGroup = async (id: number) => {
		try {
			const payload: TDeleteGroupPayload = {
				groupId: id,
			};

			const validationResult = deleteGroupFormPayload.safeParse(payload);

			if (!validationResult.success) {
				console.error(validationResult.error.message);
				toast({
					title: "Error",
					description: "Error in validation",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				return;
			}

			// Validate that group it is not empty
			if (group.collections && group.collections.length > 0) {
				// Show warning of none-empty group
				managerSlice.setGroupModalFormAction(FormActionEnum.Delete);
				onOpenGroupModal();
			} else {
				deleteGroupMutation.mutate(payload, {
					onSuccess: (data, variables, context) => {
						// TODO: validate invalidating key "collection-groups" to avoid re fetch all
						queryClient.invalidateQueries({ queryKey: ["collection-groups"] });
						toast({
							title: "Group deleted.",
							status: "success",
							duration: 5000,
							isClosable: true,
						});
					},
					onError: (error, variables, context) => {
						toast({
							title: "Error",
							description: "Error in deleting group",
							status: "error",
							duration: 5000,
							isClosable: true,
						});
						defaultHandlerApiError(error);
					},
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Error in fetching Group Data",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			defaultHandlerApiError(error);
		}
	};

	return (
		<>
			<Flex
				align="center"
				justify="space-between"
				cursor="pointer"
				onClick={handleOnClickGroupNavItem}
				onMouseOver={handleMouseOver}
				onMouseOut={handleMouseOut}
				{...rest}
			>
				<Flex
					w="85%"
					aria-label="navitem-left-section"
					align="center"
					gap={0}
					p={0}
				>
					<Text
						aria-label="navitem-name"
						wordBreak="break-all"
						overflow="hidden"
						textOverflow="ellipsis"
						sx={{
							display: "-webkit-box",
							WebkitLineClamp: 1,
							WebkitBoxOrient: "vertical",
						}}
					>
						{children}
					</Text>
				</Flex>
				{isHovering && !isOpen ? (
					<Button
						aria-label="navitem-right-section"
						color="brandPrimary.100"
						bg="brandPrimary.900"
						_hover={{
							bg: "brandPrimary.950",
						}}
						fontSize={textStylesTheme.textStyles.secondary.fontSize}
						h={5}
						p={0}
						m={0}
						w="15%"
						onClick={handleOnClickGroupNavItem}
					>
						Show
					</Button>
				) : (
					<Menu>
						<MenuButton
							aria-label="navitem-right-section"
							as={IconButton}
							icon={
								<Icon boxSize="4" color="brandPrimary.150" as={AiFillSetting} />
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
							p={0}
							m={0}
							w="15%"
						/>
						<MenuList
							bg="brandPrimary.800"
							color="brandPrimary.100"
							border="1px solid"
							borderColor="brandPrimary.900"
						>
							<MenuItem
								bg="brandPrimary.800"
								_hover={{
									bg: "brandSecondary.800",
								}}
								h="100%"
								textStyle="primary"
								onClick={handleOnClickCreateCollectionRootGroup}
							>
								Create collection
							</MenuItem>
							<MenuItem
								bg="brandPrimary.800"
								_hover={{
									bg: "brandSecondary.800",
								}}
								h="100%"
								textStyle="primary"
								onClick={handleOnClickCollapseAllCollections}
							>
								Collapse all collections
							</MenuItem>
							<MenuDivider borderColor="brandPrimary.100" />
							<MenuItem
								bg="brandPrimary.800"
								_hover={{
									bg: "brandSecondary.800",
								}}
								h="100%"
								textStyle="primary"
								onClick={handleOnClickCreateGroup}
							>
								Create group
							</MenuItem>
							<MenuItem
								bg="brandPrimary.800"
								_hover={{
									bg: "brandSecondary.800",
								}}
								h="100%"
								textStyle="primary"
								onClick={() => handleOnClickRenameGroup(group.id)}
							>
								Rename group
							</MenuItem>
							<MenuItem
								bg="brandPrimary.800"
								_hover={{
									bg: "brandSecondary.800",
								}}
								h="100%"
								textStyle="primary"
								onClick={async () => handleOnClickRemoveGroup(group.id)}
							>
								Remove group
							</MenuItem>
						</MenuList>
					</Menu>
				)}
			</Flex>

			{/* Rendering collections */}
			<Collapse in={isOpen} animateOpacity>
				{
					// Show form if click on create collection
					isShowingInput && (
						<CollectionAddForm
							groupId={group.id}
							setIsShowingInput={setIsShowingInput}
						/>
					)
				}
				{group.collections &&
					group.collections.length > 0 &&
					group.collections.map((collection) => {
						let nodeStateExists: number | undefined =
							managerSlice.collectionsNodeState?.findIndex(
								(node) => node.nodeId === collection.id
							);

						if (nodeStateExists !== undefined && nodeStateExists !== -1) {
							return (
								<RecursiveNavItem
									key={`CollectionNavItem_${collection.id}`}
									w="100%"
									_hover={{
										bg: "brandPrimary.950",
									}}
									pl={collection.childCollections.length > 0 ? 0 : 3}
									groupId={group.id}
									collection={collection}
									nodePadding={3}
								>
									{collection.name}
								</RecursiveNavItem>
							);
						}
					})}
			</Collapse>
		</>
	);
};
