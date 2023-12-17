// Design
import {
	Grid,
	GridItem,
} from "@chakra-ui/react";
// Components
import { SidebarManager } from "./SidebarManager";
import { NavbarManager } from "./NavbarManager";
// Assets

// Hooks
import { useOutlet } from "react-router-dom";
// Types

// General
import { Suspense } from "react";


export const ManagerLayout = (): JSX.Element => {
	const outlet = useOutlet();

	return (
		<Grid
			templateAreas={`"sidebar navbar" "sidebar main"`}
			gridTemplateColumns="300px 1fr"
			gridTemplateRows="3rem 1fr"
			gap="0"
			minH="100vh"
			bg="gray.50"
		>
			<GridItem
				as="aside"
				area="sidebar"
				pos="fixed"
				top="0"
				left="0"
				zIndex="sticky"
				h="full"
				pb="10"
				overflowX="hidden"
				overflowY="auto"
				w="300px"
				bg="brandPrimary.800"
				borderRight="1px solid"
				borderRightColor="brandPrimary.150"
			>
				<SidebarManager />
			</GridItem>

			<GridItem
				as="header"
				display="flex"
				area="navbar"
				alignItems="center"
				justifyContent="space-between"
				position="sticky"
				top="0"
				w="full"
				h="full"
				bg="brandPrimary.800"
				borderBottom="1px solid"
				borderBottomColor="brandPrimary.150"
				pl="15px"
				pr="15px"
				gap={2}
			>
				<NavbarManager />
			</GridItem>

			<GridItem as="main" area="main" w="full">
				<Suspense>{outlet}</Suspense>
			</GridItem>
		</Grid>
	);
}
