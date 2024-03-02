// Design
import {
	Grid,
	GridItem,
} from "@chakra-ui/react";
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

	return (
		<Grid
			templateAreas={`"sidebar navbar" "sidebar main"`}
			gridTemplateColumns= {{
				sm: "200px 1fr",
				md: "220px 1fr"
			}}
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
				h="full"
				pb="10"
				overflowX="hidden"
				overflowY="auto"
				w={{sm:"200px", md:"220px"}}
				bg="brandPrimary.900"
				borderRight="1px solid"
				borderRightColor="gray"
			>
				<ManagerSidebar />
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
				h="full"
				bg="brandPrimary.800"
				pl="20px"
				pr="20px"
				gap={2}	
			>
				<ManagerNavbar />
			</GridItem>

			<GridItem 
			as="main" 
			w="100%"
			h="100%"
			area="main"
			bg="brandPrimary.800"
			>
				<Suspense>{outlet}</Suspense>
			</GridItem>
		</Grid>
	);
}
