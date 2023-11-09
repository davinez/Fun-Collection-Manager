import { Box, Flex } from "@chakra-ui/react";
import { useOutlet } from "react-router-dom";
import MainPanel from "components/layout/MainPanel/MainPanel";
import Footer from "components/layout/HomeFooter/HomeFooter";
import HomeNavbar from "components/layout/HomeNavbar/HomeNavbar";

export default function HomeLayout(): JSX.Element {
	const outlet = useOutlet();

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
