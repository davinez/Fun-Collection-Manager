import { Box, Flex } from "@chakra-ui/react";
import { useOutlet, Navigate } from "react-router-dom";
import { useStore } from "@/store/UseStore";
import MainPanel from "components/layout/MainPanel/MainPanel";
import Footer from "components/layout/HomeLayout/HomeFooter";
import HomeNavbar from "components/layout/HomeLayout/HomeNavbar";

export const HomeLayout = (): JSX.Element => {
	const outlet = useOutlet();
	const { authSlice } = useStore();

	if (authSlice.username) {
    return <Navigate to="/my/manager/dashboard" replace />;
  }

	return (
		<Flex
			direction="column"
			minH="100vh"
			overflow="hidden"
			bgColor="brandPrimary.900"
			textColor="gray.200"
			letterSpacing="0.025em"
			w="100%"
		>
			<HomeNavbar />
			<MainPanel as="main" w="100%" p="4">
				{outlet}
			</MainPanel>
			<Box px="24px" mx="auto" width="1044px" maxW="100%">
				<Footer />
			</Box>
		</Flex>
	);
}
