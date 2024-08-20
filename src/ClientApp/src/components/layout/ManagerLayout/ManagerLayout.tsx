// Design
import { Grid, GridItem, useDisclosure } from "@chakra-ui/react";
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
	const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure();

	return (
		<Grid
			// prettier-ignore
			templateAreas={
				`"sidebar navbar" 
				 "sidebar main"`
			}
			gridTemplateColumns={{
				sm: "200px 1fr",
				md: "220px 1fr",
			}}
			gridTemplateRows="48px 1fr"
			gap="0"
			minH="100vh"
			maxWidth="100vw"
			bg="gray.50"
			overflowX="clip"
		>
			<ManagerSidebar isOpenDrawer={isOpenDrawer} onCloseDrawer={onCloseDrawer} />

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
				h="full"
				bg="brandPrimary.800"
				pl="20px"
				pr="20px"
				gap={2}
			>
				<ManagerNavbar onOpenDrawer={onOpenDrawer} />
			</GridItem>

			<GridItem as="main" w="100%" h="100%" area="main" bg="brandPrimary.800">
				<Suspense>{outlet}</Suspense>
			</GridItem>
		</Grid>
	);
};
