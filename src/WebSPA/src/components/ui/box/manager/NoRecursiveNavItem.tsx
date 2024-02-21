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
	type FlexProps,
} from "@chakra-ui/react";
import { AiFillSetting } from "react-icons/ai";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
// Components
import { RecursiveNavItem } from "@/components/ui/box/manager";
// Assets

// Hooks

// Types
import type { TCollection } from "@/shared/types/api/manager.types";

// General
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// All bookmarks and group NavItem in sidebar

type TNoRecursiveNavItemProps = {
	icon?: React.ElementType; // Third party icon
	counter?: number;
	groupId?: number;
	nodesChildren?: TCollection[];
	menuListOptions?: {
		isDivider?: boolean;
		description?: string;
		handleOnClickMenuOption?: () => void;
	}[];
	children: React.ReactNode;
	onNavItemClick?: () => void;
};

export const NoRecursiveNavItem = ({
	icon,
	counter,
	groupId,
	nodesChildren,
	menuListOptions,
	children,
	onNavItemClick,
	...rest
}: TNoRecursiveNavItemProps & FlexProps): React.ReactElement => {
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
		// if (
		// 	event.target instanceof HTMLDivElement ||
		// 	(event.target instanceof HTMLButtonElement &&
		// 		(event.target as HTMLButtonElement).textContent === "Show")
		// )
		onToggle();
	};

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
				onClick={groupId ? handleOnClickGroup : onNavItemClick}
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
					{icon && (
						<Icon
							ml="0px"
							mr="5px"
							boxSize="5"
							color="brandPrimary.150"
							as={icon}
						/>
					)}
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
				{isHovering && menuListOptions !== undefined ? (
					groupId && !isOpen ? (
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
							onClick={handleOnClickGroup}
						>
							Show
						</Button>
					) : (
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
								{menuListOptions.map((option, index) => {
									return option.isDivider ? (
										<MenuDivider
											key={
												groupId
													? `GroupMenuDivider_${groupId}${index}`
													: uuidv4()
											}
											borderColor="brandPrimary.100"
										/>
									) : (
										<MenuItem
											key={groupId ? `GroupMenu_${groupId}${index}` : uuidv4()}
											bg="brandPrimary.800"
											_hover={{
												bg: "brandSecondary.800",
											}}
											h="100%"
											textStyle="primary"
											onClick={option.handleOnClickMenuOption}
										>
											{option.description}
										</MenuItem>
									);
								})}
							</MenuList>
						</Menu>
					)
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
			{nodesChildren && // Rendering collections
				nodesChildren.length > 0 && (
					<Collapse in={isOpen} animateOpacity>
						{nodesChildren.map((item) => {
							return (
								<RecursiveNavItem
									key={`CollectionNavItem_${item.id}`}
									counter={item.bookmarksCounter}
									_hover={{
										bg: "brandPrimary.900",
									}}
									pl={item.childCollections.length > 0 ? 0 : 3}
									nodesChildren={{
										nodePadding: 3,
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
