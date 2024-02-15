// Design
import {
	Button,
	Stack,
	useToast,
	Box,
} from "@chakra-ui/react";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
// Components
import { InputField } from "components/forms";
// Assets

// Hooks
import { useAddURLMutation } from "@/api/services/manager";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
// Types
import {
	addURLFormPayload,
	type TAddURLPayload,
} from "@/shared/types/api/manager.types";
// General
import { zodResolver } from "@hookform/resolvers/zod";
import queryClient from "@/api/query-client";
import { defaultHandlerApiError } from "@/api/apiClient";


export const ManagerURLAddForm = () => {
	const methods = useForm<TAddURLPayload>({
		resolver: zodResolver(addURLFormPayload),
		mode: "onChange",
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
					toast({
						title: "Error",
						description: "Error in adding URL",
						status: "error",
						duration: 5000,
						isClosable: true,
					});
					defaultHandlerApiError(error);
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
				<Box display="flex" justifyContent="flex-end">
					<Button
						bg="brandSecondary.600"
						_hover={{
							bg: "brandSecondary.800",
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