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
	useDisclosure,
	type FlexProps,
} from "@chakra-ui/react";
import {
	AiFillCaretDown,
	AiFillCaretRight,
	AiFillSetting,
} from "react-icons/ai";
// Components
import { NestedCollectionAddForm } from "@/components/forms/manager";
// Assets

// Types
import type {
	TCollection,
	TDynamicCollapseState,
} from "@/shared/types/api/manager.types";

// General
import { useState } from "react";

// All bookmarks and group NavItem in sidebar

type TRecursiveNavItemProps = {
	collection: TCollection;
	nodePadding: number;
	nodesState: TDynamicCollapseState[];
	setNodesState: React.Dispatch<React.SetStateAction<TDynamicCollapseState[]>>;
	children: React.ReactNode;
};

export const RecursiveNavItem = ({
	collection,
	nodePadding,
	nodesState,
	setNodesState,
	children,
	...rest
}: TRecursiveNavItemProps & FlexProps): React.ReactElement => {
	const [isHovering, setIsHovering] = useState(false);
	const [isShowingInput, setIsShowingInput] = useState(false);

	const handleMouseOver = () => {
		setIsHovering(true);
	};

	const handleMouseOut = () => {
		setIsHovering(false);
	};

	const handleOnClickCollapseCollection = () => {
		setNodesState(
			[...nodesState].map((node) => {
				if (node.nodeId === collection.id) {
					return {
						...node,
						isOpen: !node.isOpen,
					};
				} else return node;
			})
		);
	};

	const handleOnClickNavItem = (event: React.SyntheticEvent<EventTarget>) => {
		// Navigate to collection page

		if (isShowingInput) setIsShowingInput(false);
	};

	const handleOnClickCreateNestedCollection = () => {
		// Show input
		setIsShowingInput(true);

		// Open if is collection closed
		if (!nodesState.find((node) => node.nodeId === collection.id)?.isOpen) {
			// Possible undefined value if nodeId doesnt exists ?? Pending
			setNodesState(
				[...nodesState].map((node) => {
					if (node.nodeId === collection.id) {
						return {
							...node,
							isOpen: true,
						};
					} else return node;
				})
			);
		}
	};

	const handleOnClickRenameCollection = () => {};

	const handleOnClickChangeIconCollection = () => {};

	const handleOnClickRemoveCollection = () => {};

	return (
		<>
			<Flex
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
							as={
								nodesState.find((node) => node.nodeId === collection.id)?.isOpen
									? AiFillCaretDown
									: AiFillCaretRight
							}
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
						src={collection.cover}
						fallbackSrc="/assets/icons/bookmark.svg"
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
								onClick={handleOnClickRemoveCollection}
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
			{collection.childCollections.length > 0 ? ( // Rendering child collections
				<Collapse
					in={
						nodesState.find((node) => node.nodeId === collection.id)
							?.isOpen as boolean
					}
					animateOpacity
				>
					{
						// Show form if click on create collection
						isShowingInput && (
							<NestedCollectionAddForm
								collectionId={collection.id}
								setIsShowingInput={setIsShowingInput}
							/>
						)
					}
					{collection.childCollections.map((item) => {
						return (
							<RecursiveNavItem
								key={`CollectionNavItem_${item.id}`}
								_hover={{
									bg: "brandPrimary.900",
								}}
								collection={item}
								pl={
									item.childCollections.length > 0
										? nodePadding
										: nodePadding + 3
								}
								nodePadding={nodePadding + 3}
								nodesState={nodesState}
								setNodesState={setNodesState}
							>
								{item.name}
							</RecursiveNavItem>
						);
					})}
				</Collapse>
			) : // Doesnt have child collections
   (
			// Show form if click on create collection
			isShowingInput && (
				<NestedCollectionAddForm
					collectionId={collection.id}
					setIsShowingInput={setIsShowingInput}
				/>
			)
	 )
		}
		</>
	);
};

// Collections NavItem in sidebar
