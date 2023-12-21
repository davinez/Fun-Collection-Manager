// Design
import {
	Icon,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Input,
	Button,
	Stack,
	Menu,
	MenuList,
	MenuButton,
	MenuItem,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverCloseButton,
	useToast,
	PopoverBody,
	Box
} from "@chakra-ui/react";
import {
	AiFillCaretDown,
	AiOutlineSearch,
	AiFillFilter,
	AiFillStar,
} from "react-icons/ai";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
import colorStylesTheme from "shared/styles/theme/foundations/colors";
// Components
import { InputField } from "components/forms";
// Assets

// Hooks
import { useAddURLMutation } from "@/api/services/manager";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { isAxiosError } from "@/hooks/UseApiClient";
// Types
import type { TApiResponse } from "@/shared/types/api/api-responses.types";
import {
	addURLFormPayload,
	type TAddURLPayload,
} from "@/shared/types/api/manager.types";
// General
import { zodResolver } from "@hookform/resolvers/zod";
import queryClient from "@/api/query-client";

const AddURLForm = () => {
	const methods = useForm<TAddURLPayload>({
		resolver: zodResolver(addURLFormPayload),
		mode: "onChange"
	});
	const {
		reset,
		formState: { errors, isSubmitting, isValid, isDirty },
	} = methods;
	const mutationAddURL = useAddURLMutation();
	const toast = useToast();

	const onSubmit: SubmitHandler<TAddURLPayload> = (
		data: TAddURLPayload
	): void => {
		mutationAddURL.mutate(
			{ collectionId: 125, payload: data },
			{
				onSuccess: (data, variables, context) => {
					queryClient.invalidateQueries({ queryKey: ["current-collection"] });
					toast({
						title: "URL Added.",
						status: "success",
						duration: 5000,
						isClosable: true,
					});
					reset();
				},
				onError: (error, variables, context) => {
					if (isAxiosError<TApiResponse>(error)) {
						toast({
							title: "Error",
							description: "Error in adding URL",
							status: "error",
							duration: 5000,
							isClosable: true,
						});
						console.error(error.response?.data.messsage as string);
					} else {
						console.error(`General error: ${error.name} ${error.message}`);
					}
				},
			}
		);
	};

	return (
		<FormProvider {...methods}>
			<Stack as="form" onSubmit={methods.handleSubmit(onSubmit)} spacing={4}>
				<InputField
				  fontSize={textStylesTheme.textStyles.primary.fontSize}
					py={0}
					px={2}
					label="URL"
					id="newURL"
					errorMessage={errors.newURL ? errors.newURL.message : undefined}
				  placeholder="https://"
				/>
				<Box display='flex' justifyContent='flex-end'>
				<Button
					bg="brandSecondary.600"
					_hover={{
						bg: "brandSecondary.800"
					}}
					_disabled={{
						bg: "brandPrimary.100",
					}}
					_empty={{
						bg: "brandPrimary.100",
					}}
					fontSize={textStylesTheme.textStyles.primary.fontSize}
					isDisabled={!isDirty || !isValid} 
					type="submit"
				>
					Save
				</Button>
      </Box>			
			</Stack>
		</FormProvider>
	);
};

export const NavbarManager = (): React.ReactElement => {
	return (
		<>
			<InputGroup
				aria-label="page-navbar-leftbuttons-div"
				h="55%"
				w={{
					base: "80%",
					md: "40%",
				}}
			>
				<InputLeftElement h="100%">
					<Icon as={AiOutlineSearch} boxSize="80%" color="brandPrimary.150" />
				</InputLeftElement>

				<Input variant="navbar" placeholder="Search" />

				<InputRightElement h="100%">
					<Menu placement="bottom-end">
						<MenuButton
							_hover={{
								bg: "brandPrimary.800",
							}}
							_active={{
								bg: "brandPrimary.800",
							}}
							as={Button}
							bg="brandPrimary.950"
							p="5px"
							w="100%"
							h="100%"
							rightIcon={
								<Icon
									boxSize={textStylesTheme.textStyles.primary.fontSize}
									as={AiFillCaretDown}
									color="brandPrimary.150"
								/>
							}
						>
							<Icon
								boxSize={textStylesTheme.textStyles.primary.fontSize}
								as={AiFillFilter}
								color="brandPrimary.150"
							/>
						</MenuButton>
						<MenuList
							bg="brandPrimary.800"
							color="brandPrimary.100"
							border="none"
						>
							<MenuItem
								bg="brandPrimary.800"
								_hover={{
									bg: "brandSecondary.800",
								}}
							>
								Link 1
							</MenuItem>
							<MenuItem
								bg="brandPrimary.800"
								_hover={{
									bg: "brandSecondary.800",
								}}
							>
								Link 2
							</MenuItem>
						</MenuList>
					</Menu>
				</InputRightElement>
			</InputGroup>

			<Popover placement="bottom-end">
				<PopoverTrigger>
					<Button
						fontSize={textStylesTheme.textStyles.primary.fontSize}
						bg="brandSecondary.600"
						_hover={{
							bg: "brandSecondary.800",
						}}
						px={3}
						py={3}
						h="55%"
						leftIcon={<Icon boxSize="120%" as={AiFillStar} color="black" />}
					>
						Add
					</Button>
				</PopoverTrigger>
				<PopoverContent 
				p={2} 
				w="25.4rem"
				bg="brandPrimary.800"
				border="1px"
				borderColor="brandSecondary.800"
				color="brandPrimary.100"
				>		
					<PopoverCloseButton p={2} />			
					<PopoverBody>
					<AddURLForm />
					</PopoverBody>		
				</PopoverContent>
			</Popover>
		</>
	);
};
