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
import { defaultHandlerApiError } from "@/api/apiClient";

export default function LoginPage(): React.ReactElement {
	// Hooks
	const {
		isOpen: isAlertOpen,
		onClose,
		onOpen: onOpenAlert,
	} = useDisclosure({ defaultIsOpen: false });
	const { authSlice } = useStore();

	// Handlers

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
			<Stack direction={{ base: "column", md: "row" }}>
				<Flex flex={1} alignItems="center" justifyContent="center">
					<LoginForm onOpenAlert={onOpenAlert} />
				</Flex>

				<Flex flex={1}>
					<Image alt="Login Image" objectFit="cover" src={imgUrl} />
				</Flex>
			</Stack>
		</>
	);
}
