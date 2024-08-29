// Design
import { Grid, GridItem, useDisclosure, useMediaQuery } from "@chakra-ui/react";
// Components
import { ManagerSidebar } from "./ManagerSidebar";
import { ManagerNavbar } from "./ManagerNavbar";
// Assets

// Hooks
import { useOutlet } from "react-router-dom";
// Types

// General
import { Suspense } from "react";

export const ManagerLayout = (): JSX.Element => {
	const outlet = useOutlet();
	// Sidebar Drawer
	const {
		isOpen: isOpenDrawer,
		onOpen: onOpenDrawer,
		onClose: onCloseDrawer,
	} = useDisclosure();
	const [isLargerThan800] = useMediaQuery("(min-width: 800px)");

	// prettier-ignore
	const templateAreasLargerThan800 = 
				`"sidebar navbar" 
				 "sidebar main"`;

	// prettier-ignore
	const templateAreasSmallerThan800 = 
				 `"navbar" 
					"main"`;

	return (
		<Grid
			// prettier-ignore
			templateAreas={isLargerThan800 ? templateAreasLargerThan800 : templateAreasSmallerThan800}
			// Sidebar width
			gridTemplateColumns={isLargerThan800 ? "250px auto" : "1fr"}
			// Navbar height
			gridTemplateRows="48px 1fr"
			gap="0"
			minH="100vh"
			maxWidth="100vw"
			bg="gray.50"
			overflowX="clip"
		>
			<GridItem
				as="aside"
				area="sidebar"
				pos="fixed"
				top="0"
				left="0"
				h="100%"
				pb="10"
				overflowX="hidden"
				overflowY="auto"
				w="250px"
				display={isLargerThan800 ? "block" : "none"}
				bg="brandPrimary.900"
				borderRight="1px solid"
				borderRightColor="gray"
			>
				<ManagerSidebar
					isOpenDrawer={isOpenDrawer}
					onCloseDrawer={onCloseDrawer}
				/>
			</GridItem>
			
			<GridItem
				as="header"
				display="flex"
				area="navbar"
				alignItems="center"
				justifyContent="space-between"
				position="sticky"
				top="0"
				zIndex="2"
				w="full"
				h="100%"
				bg="brandPrimary.800"
				pl="20px"
				pr="20px"
				gap={2}
			>
				<ManagerNavbar onOpenDrawer={onOpenDrawer} />
			</GridItem>

			<GridItem
				as="main"
				w="100%"
				h="100%"
				area="main"
				bg="brandPrimary.800"
				pos="static"
				top="0"
				left="0"
			>
				<Suspense>{outlet}</Suspense>
			</GridItem>
		</Grid>
	);
};
