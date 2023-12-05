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
import { GeneralAlertComponent } from "components/ui/alert/index";
// Assets
import imgUrl from "@/assets/images/login-image.jpg";
// Hooks
import { useStore } from "@/store/UseStore";
import { isAxiosError } from "@/hooks/UseApiClient";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useSubmitLoginMutation } from "@/api/services/auth";
// Types
import type { TApiResponse } from "@/shared/types/api/api-responses.types";
import type { TLoginPayload } from "@/shared/types/api/auth.types";
// General
import { useNavigate } from "react-router-dom";
import { useState } from "react";



export default function LoginPage(): React.ReactElement {
	const navigate = useNavigate();
	const mutationLogin = useSubmitLoginMutation();
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<TLoginPayload>();
	const {
		isOpen: isAlertOpen,
		onClose,
		onOpen: onOpenAlert,
	} = useDisclosure({ defaultIsOpen: false });
	const [errorAuthService, setErrorAuthService] = useState<string>("");
	const { authSlice } = useStore();

	const onSubmit: SubmitHandler<TLoginPayload> = (
		values: TLoginPayload
	): void => {
		mutationLogin.mutate(values, {
			onSuccess: (data, variables, context) => {
				// Add data to store authslice
			authSlice.setLoginUser(data.data);

				navigate("/my/manager/dashboard");
			},
			onError: (error, variables, context) => {
				if (isAxiosError<TApiResponse>(error)) {
					setErrorAuthService(error.response?.data.messsage as string);
				} else {
					setErrorAuthService("GENERIC_ERROR_MESSAGE");
          console.log(error);
				}

				onOpenAlert();
			},
		});
	};

	return (
		<>
			{isAlertOpen ? (
				<GeneralAlertComponent
					description={errorAuthService}
					status="error"
					onClick={onClose}
					color="black"
					variant="left-accent"
				/>
			) : (
				<></>
			)}
			<Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
				<Flex p={8} flex={1} alignItems="center" justifyContent="center">
					<Stack
						as="form"
						onSubmit={handleSubmit(onSubmit)}
						spacing={4}
						w="full"
						maxW="md"
					>
						<Heading fontSize={"2xl"}>Sign in to your account</Heading>

						<FormControl id="email" isInvalid={errors.email !== undefined}>
							<FormLabel htmlFor="email">Email address</FormLabel>
							<Input
								id="email"
								placeholder="example@example.com"
								type="email"
								{...register("email", {
									required: "This is required",
								})}
							/>
							<FormErrorMessage>
								{errors.email && errors.email.message}
							</FormErrorMessage>
						</FormControl>
						<FormControl
							id="password"
							isInvalid={errors.password !== undefined}
						>
							<FormLabel htmlFor="password">Password</FormLabel>
							<Input
								id="password"
								placeholder="..."
								type="password"
								{...register("password", {
									required: "This is required",
								})}
							/>
							<FormErrorMessage>
								{errors.password && errors.password.message}
							</FormErrorMessage>
						</FormControl>
						<Stack spacing={6}>
							<Stack
								direction={{ base: "column", sm: "row" }}
								alignItems="start"
								justifyContent="space-between"
							>
								<Checkbox marginLeft={1}>Remember me</Checkbox>
								<Text color={"blue.500"}>Forgot password?</Text>
							</Stack>
							<Button
								colorScheme="blue"
								variant="solid"
								isLoading={isSubmitting}
								type="submit"
							>
								Sign in
							</Button>
						</Stack>
					</Stack>
				</Flex>
				<Flex flex={1}>
					<Image alt="Login Image" objectFit="cover" src={imgUrl} />
				</Flex>
			</Stack>
		</>
	);
}
