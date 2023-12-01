import type * as React from "react";
import {
	Text,
	Box,
	Flex,
	Icon,
	Collapse,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	IconButton,
	InputGroup,
	InputLeftElement,
	Input,
	Avatar,
  Button,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuDivider,
	useDisclosure,
	useColorModeValue,
	type FlexProps,
	type BoxProps,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import {
	AiFillCaretRight,
	AiFillFolder,
	AiFillFolderOpen,
	AiOutlineEllipsis,
	AiOutlineMenu,
	AiOutlineUser,
} from "react-icons/ai";
import { Suspense } from "react";
import { useOutlet } from "react-router-dom";
import { useSubmitLoginMutation } from "@/api/services/auth";
import { isAxiosError } from "@/hooks/UseApiClient";
import type { TApiResponse } from "@/shared/types/api/api-responses.types";
import type { TLoginPayload } from "@/shared/types/api/auth.types";

const sidebarCollections = ['Collection 1', 'Collection 2', 'Collection 3'];

// function generic and type props explicitly.
type TNavItemProps = {
	icon?: React.ElementType; // Third party icon
	children: React.ReactNode;
	onClick?: () => void;
};

type TSidebarContentProps = {
	//color: string;
};

const NavItem = ({
	icon,
	onClick,
	children,
	...rest
}: TNavItemProps & FlexProps): React.ReactElement => {
	const color = useColorModeValue("gray.600", "gray.300");

	return (
		<Flex
			align="center"
			px="4"
			pl="4"
			py="3"
			cursor="pointer"
			color="inherit"
			_dark={{
				color: "gray.400",
			}}
			_hover={{
				bg: "gray.100",
				_dark: {
					bg: "gray.900",
				},
				color: "gray.900",
			}}
			role="group"
			fontWeight="semibold"
			transition=".15s ease"
			onClick={(): void => {
				onClick?.();
			}}
			{...rest}
		>
			{icon && (
				<Icon
					mx="2"
					boxSize="4"
					_groupHover={{
						color: color,
					}}
					as={icon}
				/>
			)}
			{children}
		</Flex>
	);
};

const SidebarContent = ({
	...rest
}: TSidebarContentProps & BoxProps): React.ReactElement => {
	const integrations = useDisclosure();


  const renderCollections = (collection) => {
   return sidebarCollections.map((collection) => {
      if(collection.children){
        return renderCollections();
      }

    return <NavItem icon={PhoneIcon}>Home</NavItem>
   })
  };

	return (
		<Box
			as="nav"
			pos="fixed"
			top="0"
			left="0"
			zIndex="sticky"
			h="full"
			pb="10"
			overflowX="hidden"
			overflowY="auto"
			bg="white"
			_dark={{
				bg: "gray.800",
			}}
			color="inherit"
			borderRightWidth="1px"
			w="60"
			{...rest}
		>
			<Flex px="4" py="5" alignItems="center">
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                  <Icon boxSize="sm" as={AiOutlineUser} />
                <Text
					fontSize="2xl"
					ml="2"
					color="brand.500"
					_dark={{
						color: "white",
					}}
					fontWeight="semibold"
				>
					david.ibanezn
				</Text>
              </MenuButton>
              <MenuList>
                <MenuItem>Link 1</MenuItem>
                <MenuItem>Link 2</MenuItem>
                <MenuDivider />
                <MenuItem>Link 3</MenuItem>
              </MenuList>
            </Menu>
			</Flex>
			<Flex
				direction="column"
				as="nav"
				fontSize="sm"
				color="gray.600"
				aria-label="Main Navigation"
			>
        {// Recursion function
       renderCollections(sidebarCollections)
         }

				<NavItem icon={PhoneIcon}>Home</NavItem>
				<NavItem icon={PhoneIcon}>Articles</NavItem>
				<NavItem icon={PhoneIcon}>Collections</NavItem>
				<NavItem icon={PhoneIcon}>Checklists</NavItem>
				<NavItem icon={PhoneIcon} onClick={integrations.onToggle}>
					Integrations
					<PhoneIcon />
				</NavItem>
				<Collapse in={integrations.isOpen}>
					<NavItem pl="12" py="2">
						Shopify
					</NavItem>
					<NavItem pl="12" py="2">
						Slack
					</NavItem>
					<NavItem pl="12" py="2">
						Zapier
					</NavItem>
				</Collapse>
				<NavItem icon={PhoneIcon}>Changelog</NavItem>
				<NavItem icon={PhoneIcon}>Settings</NavItem>
			</Flex>
		</Box>
	);
};

// 2 secciones en navitem, la fecha despliega submenus y el resto seleccioan esa coleccion

export default function ManagerLayout(): JSX.Element {
	const sidebar = useDisclosure();
	const outlet = useOutlet();

	return (
		<Box
			as="section"
			bg="gray.50"
			_dark={{
				bg: "gray.700",
			}}
			minH="100vh"
		>
			<SidebarContent
				display={{
					base: "none",
					md: "unset",
				}}
			/>
			<Drawer
				isOpen={sidebar.isOpen}
				onClose={sidebar.onClose}
				placement="left"
			>
				<DrawerOverlay />
				<DrawerContent>
					<SidebarContent w="full" borderRight="none" />
				</DrawerContent>
			</Drawer>
			<Box
				ml={{
					base: 0,
					md: 60,
				}}
				transition=".3s ease"
			>
				<Flex
					as="header"
					align="center"
					justify="space-between"
					w="full"
					px="4"
					bg="white"
					_dark={{
						bg: "gray.800",
					}}
					borderBottomWidth="1px"
					color="inherit"
					h="14"
				>
					<IconButton
						aria-label="Menu"
						display={{
							base: "inline-flex",
							md: "none",
						}}
						onClick={sidebar.onOpen}
						icon={<PhoneIcon />}
						size="sm"
					/>
					<InputGroup
						w="96"
						display={{
							base: "none",
							md: "flex",
						}}
					>
						<InputLeftElement color="gray.500">
							<PhoneIcon />
						</InputLeftElement>
						<Input placeholder="Search for articles..." />
					</InputGroup>

					<Flex align="center">
						<Icon color="gray.500" as={PhoneIcon} cursor="pointer" />
						<Avatar ml="4" size="sm" name="davinez" src="" cursor="pointer" />
					</Flex>
				</Flex>

				<Box as="main" p="4">
					{/* Add content here, remove div below  */}
					<Suspense>{outlet}</Suspense>
				</Box>
			</Box>
		</Box>
	);
}
