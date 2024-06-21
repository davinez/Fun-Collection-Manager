// Design
import {
	Box,
	Flex,
	Text,
	Button,
	Stack,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { MoonIcon } from "@chakra-ui/icons";
// Components
import { GeneralAlert } from "components/ui/alert";
// Assets

// Types
import {
	createUserAccountPayload,
	type TCreateUserAccountPayload,
} from "@/shared/types/api/auth.types";
// General
import { NavLink, useNavigate } from "react-router-dom";
import type React from "react";
import { useStore } from "@/store/UseStore";
import { defaultHandlerApiError } from "@/api/useApiClient";
import {
	useCreateUserAccountMutation,
	useGetUserAccountByIdPFetchQuery,
} from "@/api/services/auth";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { useApiClient } from "@/api/useApiClient";
import { API_BASE_URL_AUTH } from "shared/config";
import { loginRequest, managerAPIRequest } from "shared/config/authConfig";

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
	const toast = useToast();
	const createUserAccountMutation = useCreateUserAccountMutation();
	const apiClient = useApiClient(API_BASE_URL_AUTH);

	// Handlers
	const handleOnClickSignIn = async () => {
		// https://stackoverflow.com/questions/65958941/msal-js-loginpopup-vs-acquiretokenpop

		try {
			const loginResponse = await instance.loginPopup(loginRequest);
			// const json = JSON.stringify(loginResponse);

			const activeAccount = instance.getActiveAccount();

			if (activeAccount === null) {
				toast({
					title: "Error",
					description: "Error after login",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				return;
			}

			const tokenRequest = {
				account: activeAccount,
				scopes: [...managerAPIRequest.scopes],
			};

			const managerAPIToken = await instance.acquireTokenSilent(tokenRequest);

			authSlice.setAccessToken(managerAPIToken.accessToken);

			const userAccount = await useGetUserAccountByIdPFetchQuery(
				apiClient,
				loginResponse.account.homeAccountId,
				true
			);

			if (!userAccount) {
				const payload: TCreateUserAccountPayload = {
					identityProviderId: loginResponse.account.homeAccountId,
					createSubscription: {
						isTrialPeriod: false,
						validTo: new Date("January 01, 2034 00:01:00"),
						planAcquired: 1,
					},
				};

				const validationResult = createUserAccountPayload.safeParse(payload);

				if (!validationResult.success) {
					toast({
						title: "Error",
						description: "Error in validation create account",
						status: "error",
						duration: 5000,
						isClosable: true,
					});
					return;
				}

				createUserAccountMutation.mutate(payload, {
					onSuccess: async (data, variables, context) => {
						// const activeAccount = instance.getActiveAccount();

						// if (activeAccount === null) {
						// 	toast({
						// 		title: "Error",
						// 		description:
						// 			"Error after account creation. Please log in again",
						// 		status: "error",
						// 		duration: 5000,
						// 		isClosable: true,
						// 	});
						// 	return;
						// }

						// const tokenRequest = {
						// 	account: activeAccount,
						// 	scopes: [...managerAPIRequest.scopes],
						// };

						// const managerAPIToken =
						// 	await instance.acquireTokenSilent(tokenRequest);

						const newIdTokenClaims = managerAPIToken.account.idTokenClaims;

						if (!newIdTokenClaims) {
							toast({
								title: "Error",
								description:
									"Error after account creation. Please log in again",
								status: "error",
								duration: 5000,
								isClosable: true,
							});
							return;
						}

						authSlice.setLoginUser({
							localAccountId: managerAPIToken.account.localAccountId,
							homeAccountId: managerAPIToken.account.homeAccountId,
							userDisplayName: newIdTokenClaims["userDisplayName"] as string,
							userEmail: newIdTokenClaims["userEmail"] as string,
							userRoles: newIdTokenClaims.roles as string[],
							accessToken: managerAPIToken.accessToken,
						});

						navigate("/my/manager/dashboard");
					},
					onError: (error, variables, context) => {
						toast({
							title: "Error",
							description: "Error in creating new account",
							status: "error",
							duration: 5000,
							isClosable: true,
						});
						defaultHandlerApiError(error);
					},
				});
			} else {
				const idTokenClaims = loginResponse.account.idTokenClaims;

				if (!idTokenClaims) {
					onOpenFailedLoginAlert();
					return;
				}

				const activeAccount = instance.getActiveAccount();

				if (activeAccount === null) {
					toast({
						title: "Error",
						description: "Error getting active account. Please log in again",
						status: "error",
						duration: 5000,
						isClosable: true,
					});
					return;
				}

				const tokenRequest = {
					account: activeAccount,
					scopes: [...managerAPIRequest.scopes],
				};

				const managerAPIToken = await instance.acquireTokenSilent(tokenRequest);

				// Handle login response
				authSlice.setLoginUser({
					localAccountId: loginResponse.account.localAccountId,
					homeAccountId: loginResponse.account.homeAccountId,
					userDisplayName: idTokenClaims["userDisplayName"] as string,
					userEmail: idTokenClaims["userEmail"] as string,
					userRoles: idTokenClaims.roles as string[],
					accessToken: managerAPIToken.accessToken,
				});

				navigate("/my/manager/dashboard");
			}
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
