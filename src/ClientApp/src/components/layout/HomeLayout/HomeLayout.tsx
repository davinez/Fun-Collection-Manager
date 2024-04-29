// Design
import { Grid, GridItem, Box, Flex } from "@chakra-ui/react";
// Components
import Footer from "components/layout/HomeLayout/HomeFooter";
import HomeNavbar from "components/layout/HomeLayout/HomeNavbar";
// Assets

// Types

// General
import { Suspense } from "react";
import { useStore } from "@/store/UseStore";
import { useOutlet, Navigate } from "react-router-dom";

export const HomeLayout = (): JSX.Element => {
	const outlet = useOutlet();
	const { authSlice } = useStore();

	if (authSlice.username) {
		return <Navigate to="/my/manager/dashboard" replace />;
	}

	return (
		<Grid
			// prettier-ignore
			templateAreas={
				`"navbar" 
				 "main"
				 "footer"`
			}
			// width
			gridTemplateColumns="auto"
			// height
			gridTemplateRows="60px auto auto"
			gap="0"
			minH="100vh"
			maxWidth="100vw"
			bg="gray.50"
			overflowX="clip"
		>
			<GridItem
				as="header"
				area="navbar"
				position="sticky"
				zIndex={1}
				top={0}
				bgColor="brandPrimary.900"
				borderRight="1px solid"
				borderRightColor="gray"
				textColor="gray.200"
				letterSpacing="0.025em"
			>
				<HomeNavbar />
			</GridItem>

			<GridItem 
			as="main" 
			area="main" 
			bg="brandPrimary.800"
			w="full"
			h="full"
			>
				{outlet}
			</GridItem>

			<GridItem 
			as="footer" 
			area="footer"  
			bg="brandPrimary.800"
			>
				<Footer />
			</GridItem>
		</Grid>
	);
};
