// Design
import {
	Button,
	Checkbox,
	Flex,
	Text,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	Image,
	FormErrorMessage,
	useDisclosure,
	Box,
} from "@chakra-ui/react";
// Components
import { GeneralAlert } from "components/ui/alert";
import { LoginForm } from "@/components/forms/auth";
// Assets
import imgUrl from "@/assets/images/login-image.jpg";
// Hooks
import { useStore } from "@/store/UseStore";
// Types
import type { TApiResponse } from "@/shared/types/api/api-responses.types";
// General
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { defaultHandlerApiError } from "@/api/useApiClient";
import { useMsal } from "@azure/msal-react";

export default function LoginPage(): React.ReactElement {
	// Hooks
	const {
		isOpen: isAlertOpen,
		onClose,
		onOpen: onOpenAlert,
	} = useDisclosure({ defaultIsOpen: false });
	const { authSlice } = useStore();
	const { instance, accounts, inProgress } = useMsal();

	// Handlers

	// Return
	return (
		<>
			{isAlertOpen ? (
				<GeneralAlert
					description="Wrong Credentials"
					status="error"
					onClick={onClose}
					color="black"
					variant="left-accent"
				/>
			) : (
				<></>
			)}
			<Stack 
			direction={{ base: "column", md: "row" }}
			gap={{ base: 10, md: 0 }}
			>
				<Flex flex={1} alignItems="center" justifyContent="center">
					{/* <LoginForm onOpenAlert={onOpenAlert} /> */}
					<Box onClick={() => instance.loginPopup()}>Login</Box>
				</Flex>

				<Flex flex={1} >
					<Image alt="Login Image" objectFit="cover" src={imgUrl} />
				</Flex>
			</Stack>
		</>
	);
}
