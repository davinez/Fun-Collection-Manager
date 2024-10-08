// Design
import {
	Image,
	Text,
	Flex,
	Icon,
	Collapse,
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
	AiFillSetting,
} from "react-icons/ai";
// Components
import {
	CollectionAddForm,
	CollectionUpdateForm,
} from "@/components/forms/manager";
import { CollectionModal } from "components/ui/modal/manager";
// Assets
import { DEFAULT_ICON, R2_ICONS_DOMAIN } from "shared/config";
// Types
import {
	type TCollection,
	type TDynamicCollapseState,
	type TDeleteCollectionPayload,
	deleteCollectionFormPayload,
} from "@/shared/types/api/manager.types";
import { CollectionModalActionEnum } from "@/shared/types/global.types";
// General
import { useDeleteCollectionMutation } from "@/api/services/manager";
import { useState } from "react";
import queryClient from "@/api/query-client";
import { defaultHandlerApiError } from "@/api/useApiClient";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/UseStore";

// All bookmarks and group NavItem in sidebar

type TRecursiveNavItemProps = {
	groupId: number;
	collection: TCollection;
	nodePadding: number;
	children: React.ReactNode;
};

export const RecursiveNavItem = ({
	groupId,
	collection,
	nodePadding,
	children,
	...rest
}: TRecursiveNavItemProps & FlexProps): React.ReactElement => {
	const nodeState = useStore(
		(state) =>
			state.managerSlice.collectionsNodeState?.find(
				(node) => node.nodeId === collection.id
			)
	) as TDynamicCollapseState;
	const { managerSlice } = useStore();
	const [isHovering, setIsHovering] = useState(false);
	const [isShowingInput, setIsShowingInput] = useState(false);
	const [isSelfEditable, setIsSelfEditable] = useState(false);
	const [modalAction, setModalAction] = useState(
		CollectionModalActionEnum.Icon
	);
	const toast = useToast();
	const {
		isOpen: isOpenCollectionModal,
		onOpen: onOpenCollectionModal,
		onClose: onCloseCollectionModal,
	} = useDisclosure();

	const deleteCollectionMutation = useDeleteCollectionMutation();
	const navigate = useNavigate();

	const handleMouseOver = () => {
		setIsHovering(true);
	};

	const handleMouseOut = () => {
		setIsHovering(false);
	};

	const handleOnClickCollapseCollection = () => {
		managerSlice.toggleCollectionNode(nodeState.nodeId);
	};

	const handleOnClickNavItem = (event: React.SyntheticEvent<EventTarget>) => {
		// Only open collection page if the clicked element it is the div and not an inside element
		if (
			(event.target instanceof HTMLDivElement &&
				(event.target as HTMLDivElement).getAttribute("aria-label") ===
					"navitem-main-container") ||
			event.target instanceof HTMLImageElement ||
			event.target instanceof HTMLParagraphElement
		) {
			// Navigate to collection page
			if (isShowingInput) {
				setIsShowingInput(false);
			}
			navigate(`/my/manager/${collection.id}`);
		}
	};

	const handleOnClickCreateNestedCollection = () => {
		// Open if is collection closed
		if (!nodeState.isOpen) {
			managerSlice.toggleCollectionNode(nodeState.nodeId);
		}

		// Show input
		setIsShowingInput(true);
	};

	const handleOnClickRenameCollection = () => {
		setIsSelfEditable(true);
	};

	const handleOnClickChangeIconCollection = () => {
		if (modalAction !== CollectionModalActionEnum.Icon)
			setModalAction(CollectionModalActionEnum.Icon);
		onOpenCollectionModal();
	};

	const handleDeleteMutation = () => {
		const payload: TDeleteCollectionPayload = {
			collectionId: collection.id,
		};

		const validationResult = deleteCollectionFormPayload.safeParse(payload);

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

		deleteCollectionMutation.mutate(payload, {
			onSuccess: (data, variables, context) => {
				queryClient.invalidateQueries({ queryKey: ["collection-groups"] });
				toast({
					title: "Collection deleted.",
					status: "success",
					duration: 5000,
					isClosable: true,
				});
			},
			onError: (error, variables, context) => {
				toast({
					title: "Error",
					description: "Error in deleting collection",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				defaultHandlerApiError(error);
			},
		});
	};

	const handleOnClickRemoveCollection = async () => {
		try {
			// If collection has data then show warning
			if (
				collection.bookmarksCounter > 0 ||
				collection.childCollections.length > 0
			) {
				setModalAction(CollectionModalActionEnum.Delete);
				onOpenCollectionModal();
			} else {
				handleDeleteMutation();
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Error in fetching Collection Data",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			defaultHandlerApiError(error);
		}
	};

	return (
		<>
			<CollectionModal
				isOpen={isOpenCollectionModal}
				onClose={onCloseCollectionModal}
				modalAction={modalAction}
				handleDeleteMutation={handleDeleteMutation}
				collectionId={collection.id}
				collectionIcon={collection.icon}
			/>
			{isSelfEditable ? (
				<CollectionUpdateForm
					setIsSelfEditable={setIsSelfEditable}
					collection={collection}
					pl={nodePadding}
				/>
			) : (
				<Flex
					aria-label="navitem-main-container"
					align="center"
					justify="space-between"
					py={2}
					pr={3}
					cursor="pointer"
					textStyle="primary"
					color="brandPrimary.100"
					transition=".15s ease"
					onClick={handleOnClickNavItem}
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
						{collection.childCollections.length > 0 && (
							<Icon
								mx="0px"
								boxSize="3"
								color="brandPrimary.150"
								as={nodeState.isOpen ? AiFillCaretDown : AiFillCaretRight}
								onClick={handleOnClickCollapseCollection}
							/>
						)}
						<Image
							ml="0px"
							mr="5px"
							borderRadius="2px"
							boxSize="5"
							color="brandPrimary.150"
							objectFit="contain"
							src={!collection.icon ? DEFAULT_ICON : R2_ICONS_DOMAIN + "/" + collection.icon}
							fallbackSrc={DEFAULT_ICON}
							alt="Default Icon"
						/>
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
					{isHovering ? (
						<Menu>
							<MenuButton
								aria-label="navitem-right-section"
								as={IconButton}
								icon={
									<Icon
										boxSize="4"
										color="brandPrimary.150"
										as={AiFillSetting}
									/>
								}
								bg="brandPrimary.950"
								color="brandPrimary.100"
								_hover={{
									bg: "brandPrimary.800",
								}}
								_active={{
									bg: "brandPrimary.800",
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
									h="100%"
									textStyle="primary"
									_hover={{
										bg: "brandSecondary.800",
									}}
									onClick={handleOnClickCreateNestedCollection}
								>
									Create nested collection
								</MenuItem>
								<MenuDivider borderColor="brandPrimary.100" />
								<MenuItem
									bg="brandPrimary.800"
									h="100%"
									textStyle="primary"
									_hover={{
										bg: "brandSecondary.800",
									}}
									onClick={handleOnClickChangeIconCollection}
								>
									Change Icon
								</MenuItem>
								<MenuItem
									bg="brandPrimary.800"
									h="100%"
									textStyle="primary"
									_hover={{
										bg: "brandSecondary.800",
									}}
									onClick={handleOnClickRenameCollection}
								>
									Rename
								</MenuItem>
								<MenuItem
									bg="brandPrimary.800"
									h="100%"
									textStyle="primary"
									_hover={{
										bg: "brandSecondary.800",
									}}
									onClick={async () => handleOnClickRemoveCollection()}
								>
									Remove
								</MenuItem>
							</MenuList>
						</Menu>
					) : (
						<Text
							aria-label="navitem-right-section"
							textStyle="tertiary"
							color="brandPrimary.150"
							w="15%"
							textAlign="end"
							mr={1}
						>
							{collection.bookmarksCounter}
						</Text>
					)}
				</Flex>
			)}
			{
				// Show form if click on create collection
				isShowingInput && (
					<CollectionAddForm
						groupId={groupId}
						parentCollectionId={collection.id}
						setIsShowingInput={setIsShowingInput}
						pl={nodePadding}
					/>
				)
			}
			{collection.childCollections.length > 0 && ( // Rendering child collections
				<Collapse in={nodeState.isOpen} animateOpacity>
					{collection.childCollections.map((item) => {
						return (
							<RecursiveNavItem
								key={`CollectionNavItem_${item.id}`}
								w="100%"
								_hover={{
									bg: "brandPrimary.950",
								}}
								groupId={groupId}
								collection={item}
								pl={
									item.childCollections.length > 0
										? nodePadding
										: nodePadding + 3
								}
								nodePadding={nodePadding + 3}
							>
								{item.name}
							</RecursiveNavItem>
						);
					})}
				</Collapse>
			)}
		</>
	);
};
