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
	useDisclosure,
	useColorModeValue,
	type FlexProps,
	type BoxProps,
} from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";
import { Suspense } from "react";
import { useLoaderData, useOutlet, Await } from "react-router-dom";
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
			bgColor="gray.900"
			textColor="gray.200"
			letterSpacing="0.025em"
			w="100%"
		>
      <HomeNavbar />
			<MainPanel as="main" w="100%" p="4">
				<Suspense>{outlet}</Suspense>
			</MainPanel>
			<Box px="24px" mx="auto" width="1044px" maxW="100%">
				<Footer />
			</Box>
		</Flex>
	);
}
