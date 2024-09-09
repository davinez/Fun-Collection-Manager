// // Design
// import {
// 	Text,
// 	Button,
// 	Stack,
// 	Flex,
// 	Heading,
// 	Checkbox,
// } from "@chakra-ui/react";
// import textStylesTheme from "shared/styles/theme/foundations/textStyles";
// // Components
// import { InputField } from "components/forms";
// // Assets

// // Types
// import {
// 	loginFormPayload,
// 	type TLoginPayload,
// } from "@/shared/types/api/auth.types";
// // General
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useLoginMutation } from "@/api/services/auth";
// import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
// import { defaultHandlerApiError } from "@/api/useApiClient";

// type TLoginFormProps = {
// 	onOpenAlert: () => void;
// };

  /**
   * DEPRECATED  login flow for use of Entra ID
   */
// export const LoginForm = (props: TLoginFormProps) => {
// 	// Hooks
// 	const methods = useForm<TLoginPayload>({
// 		resolver: zodResolver(loginFormPayload),
// 		mode: "onSubmit",
// 	});
// 	const {
// 		reset,
// 		formState: { errors, isValid },
// 	} = methods;
// 	const loginMutation = useLoginMutation();

//    // TODO: add functionality to forgot password
//    // remember me, check if applies with azure b2c
//    // add sign up page functionality
// 	const onSubmit: SubmitHandler<TLoginPayload> = (
// 		data: TLoginPayload
// 	): void => {
// 		loginMutation.mutate(data, {
// 			onSuccess: (data, variables, context) => {
// 				// Add data to store authslice
// 				//	authSlice.setLoginUser(data.data);

// 				//	navigate("/my/manager/dashboard");
// 				reset();
// 			},
// 			onError: (error, variables, context) => {
// 				defaultHandlerApiError(error);
// 				props.onOpenAlert();
// 			},
// 		});
// 	};

// 	return (
// 		<FormProvider {...methods}>
// 			<Stack as="form" onSubmit={methods.handleSubmit(onSubmit)} p={4} w="70%">
// 				<Heading fontSize={"2xl"}>Sign in to your account</Heading>

// 				<InputField
// 					fontSize={textStylesTheme.textStyles.primary.fontSize}
// 					py={0}
// 					px={2}
// 					h={8}
// 					placeholder="example@example.com"
// 					id="email"
// 					type="email"
// 					label="Email address"
// 					errorMessage={errors.email ? errors.email.message : undefined}
// 				/>

// 				<InputField
// 					fontSize={textStylesTheme.textStyles.primary.fontSize}
// 					py={0}
// 					px={2}
// 					h={8}
// 					id="password"
// 					placeholder="..."
// 					type="password"
// 					label="Password"
// 					errorMessage={errors.password ? errors.password.message : undefined}
// 				/>

// 				<Stack spacing={6}>
// 					<Stack
// 						direction={{ base: "column", sm: "row" }}
// 						alignItems="start"
// 						justifyContent="space-between"
// 					>
// 						<Checkbox marginLeft={1}>Remember me</Checkbox>
// 						<Text color={"blue.500"}>Forgot password?</Text>
// 					</Stack>
// 					<Button
// 						_hover={{
// 							bg: "brandSecondary.800",
// 						}}
// 						_disabled={{
// 							bg: "brandPrimary.100",
// 						}}
// 						_empty={{
// 							bg: "brandPrimary.100",
// 						}}
// 						colorScheme="blue"
// 						variant="solid"
// 						isLoading={loginMutation.isPending}
// 						isDisabled={!isValid || loginMutation.isPending}
// 						type="submit"
// 					>
// 						Sign in
// 					</Button>
// 				</Stack>
// 			</Stack>
// 		</FormProvider>
// 	);
// };



// // Design
// import {
// 	Button,
// 	Checkbox,
// 	Flex,
// 	Text,
// 	FormControl,
// 	FormLabel,
// 	Heading,
// 	Input,
// 	Stack,
// 	Image,
// 	FormErrorMessage,
// 	useDisclosure,
// 	Box,
// } from "@chakra-ui/react";
// // Components
// import { GeneralAlert } from "components/ui/alert";
// import { LoginForm } from "@/components/forms/auth";
// // Assets
// import imgUrl from "@/assets/images/login-image.jpg";
// // Hooks
// import { useStore } from "@/store/UseStore";
// // Types
// import type { TApiResponse } from "@/shared/types/api/api-responses.types";
// // General
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { defaultHandlerApiError } from "@/api/useApiClient";
// import { useMsal } from "@azure/msal-react";

  /**
   * DEPRECATED  login flow for use of Entra ID
   */
// export default function LoginPage(): React.ReactElement {
// 	// Hooks
// 	const {
// 		isOpen: isAlertOpen,
// 		onClose,
// 		onOpen: onOpenAlert,
// 	} = useDisclosure({ defaultIsOpen: false });
// 	const { authSlice } = useStore();
// 	const { instance, accounts, inProgress } = useMsal();

// 	// Handlers

// 	// Return
// 	return (
// 		<>
// 			{isAlertOpen ? (
// 				<GeneralAlert
// 					description="Wrong Credentials"
// 					status="error"
// 					onClick={onClose}
// 					color="black"
// 					variant="left-accent"
// 				/>
// 			) : (
// 				<></>
// 			)}
// 			<Stack 
// 			direction={{ base: "column", md: "row" }}
// 			gap={{ base: 10, md: 0 }}
// 			>
// 				<Flex flex={1} alignItems="center" justifyContent="center">
// 					{/* <LoginForm onOpenAlert={onOpenAlert} /> */}
// 					<Box onClick={() => instance.loginPopup()}>Login</Box>
// 				</Flex>

// 				<Flex flex={1} >
// 					<Image alt="Login Image" objectFit="cover" src={imgUrl} />
// 				</Flex>
// 			</Stack>
// 		</>
// 	);
// }
