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

// Assets


// Types
import type { TCollection } from "@/shared/types/api/manager.types";

// General
import { useState } from "react";


// All bookmarks and group NavItem in sidebar

type TRecursiveNavItemProps = {
	icon?: string | React.ElementType; // Third party icon
	counter?: number;
	nodesChildren: {
		nodePadding: number;
		collections: TCollection[];
	};
	children: React.ReactNode;
};

export const RecursiveNavItem = ({
	icon,
	counter,
	nodesChildren,
	children,
	...rest
}: TRecursiveNavItemProps & FlexProps): React.ReactElement => {
	const [isHovering, setIsHovering] = useState(false);
	const { isOpen, onToggle } = useDisclosure();

	const handleMouseOver = () => {
		setIsHovering(true);
	};

	const handleMouseOut = () => {
		setIsHovering(false);
	};

	const handleOnClickNavItem = (event: React.SyntheticEvent<EventTarget>) => {};

	const handleOnClickCreateNestedCollection = () => {};

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
					{nodesChildren.collections.length > 0 && (
						<Icon
							mx="0px"
							boxSize="3"
							color="brandPrimary.150"
							as={isOpen ? AiFillCaretDown : AiFillCaretRight}
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
						{counter}
					</Text>
				)}
			</Flex>
			{nodesChildren.collections.length > 0 && ( // Rendering collections
				<Collapse in={isOpen} animateOpacity>
					{nodesChildren.collections.map((item) => {
						return (
							<RecursiveNavItem
								key={`CollectionNavItem_${item.id}`}
                counter={item.bookmarksCounter}						
								_hover={{
									bg: "brandPrimary.900",
								}}
                pl={item.childCollections.length > 0 ? nodesChildren.nodePadding : nodesChildren.nodePadding + 3}
								nodesChildren={{
									nodePadding: nodesChildren.nodePadding + 3,
									collections: item.childCollections,
								}}
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

// Collections NavItem in sidebar
