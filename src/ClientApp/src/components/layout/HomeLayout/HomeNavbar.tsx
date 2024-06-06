// Design
import {
	Box,
	Flex,
	Text,
	Button,
	Stack,
	useDisclosure,
} from "@chakra-ui/react";
import { MoonIcon } from "@chakra-ui/icons";
// Components
import { GeneralAlert } from "components/ui/alert";
// Assets

// Types

// General
import { NavLink, useNavigate } from "react-router-dom";
import type React from "react";
import { useStore } from "@/store/UseStore";
import { defaultHandlerApiError } from "@/api/useApiClient";
import { useMsal } from "@azure/msal-react";
import {
	InteractionStatus,
} from "@azure/msal-browser";

export default function HomeNavbar(): React.ReactElement {
	// Hooks
	const { authSlice } = useStore();
	const { instance, inProgress } = useMsal();
	const navigate = useNavigate();
	const {
		isOpen: isAlertOpen,
		onClose,
		onOpen: onOpenFailedLoginAlert,
	} = useDisclosure({ defaultIsOpen: false });

	// Handlers
	const handleOnClickSignIn = async () => {
		// https://stackoverflow.com/questions/65958941/msal-js-loginpopup-vs-acquiretokenpop

		try {
			const loginResponse = await instance.loginPopup();

			// const json = JSON.stringify(loginResponse);

			const idTokenClaims = loginResponse.account.idTokenClaims;	

			if(!idTokenClaims ||
				 !idTokenClaims['roles'] ||
				!Array.isArray(idTokenClaims['roles']) ||
				 !idTokenClaims['roles'].length){
					// Call register user account endpoint
					
				 }
	
			// Handle login response
			authSlice.setLoginUser({
				localAccountId: loginResponse.account.localAccountId,
				homeAccountId: loginResponse.account.homeAccountId,
				username: loginResponse.account.username, // Possible null
				userDisplayName: "ssdfds",
				userEmail: "email placeholder obtener de claims",
				userScopes: loginResponse.scopes,
				accessToken: loginResponse.accessToken,
			});

			navigate("/my/manager/dashboard");
		} catch (error) {
			defaultHandlerApiError(error);
			onOpenFailedLoginAlert();
		}
	};

	// Return
	return (
		<>
			{isAlertOpen && (
				<GeneralAlert
					description="Failed Login"
					status="error"
					onClick={onClose}
					color="black"
					variant="left-accent"
				/>
			)}

			<Box w="100%" h="100%">
				<Flex
					bg="brandPrimary.800"
					color="brandPrimary.100"
					py={2}
					px={4}
					align="center"
					justify="space-between"
					w="100%"
					h="100%"
				>
					<Flex as={NavLink} to="/" flexFlow="row wrap" ml={3}>
						<MoonIcon w={4} h={4} color="red.500" />
						<Text w="100%" fontFamily="heading" color="white">
							FuCoMa
						</Text>
					</Flex>

					<Stack justify="center" direction="row" spacing={6}>
						{inProgress === InteractionStatus.Login ? (
							<Flex alignItems="center" color="white">
								Login is currently in progress!
							</Flex>
						) : (
							<Button
								fontSize="sm"
								fontWeight={600}
								color="white"
								bg="brandSecondary.800"
								_hover={{
									bg: "brandSecondary.600",
								}}
								onClick={handleOnClickSignIn}
							>
								Sign In
							</Button>
						)}
					</Stack>
				</Flex>
			</Box>
		</>
	);
}
