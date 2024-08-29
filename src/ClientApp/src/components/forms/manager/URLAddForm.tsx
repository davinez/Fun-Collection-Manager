// Design
import { Button, Stack, useToast, Box, Text } from "@chakra-ui/react";
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
	TAddURLExtrasPayload,
} from "@/shared/types/api/manager.types";
// General
import { zodResolver } from "@hookform/resolvers/zod";
import queryClient from "@/api/query-client";
import { defaultHandlerApiError } from "@/api/useApiClient";
import { Location, useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { isNumber } from "shared/utils";

type TURLAddFormProps = {};

// Validation is triggered on the changeevent for each input, leading to multiple re-renders.
// Warning: this often comes with a significant impact on performance.
export const URLAddForm = ({}: TURLAddFormProps) => {
	const methods = useForm<TAddURLPayload>({
		resolver: zodResolver(addURLFormPayload),
		mode: "onChange",
	});
	const {
		reset,
		formState: { errors, isValid },
	} = methods;
	const { collectionId } = useParams();
	const mutationAddURL = useAddURLMutation();

	const toast = useToast();
	const location: Location = useLocation();

	// Re-render-reset on url change
	useEffect(() => {
		reset();
	}, [location.pathname]);

	// Handlers

	const onSubmit: SubmitHandler<TAddURLPayload> = (
		data: TAddURLPayload
	): void => {
		if (!collectionId || !isNumber(collectionId)) {
			toast({
				title: "Invalid selected collection",
				status: "success",
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		const payload: TAddURLPayload & TAddURLExtrasPayload = {
			newURL: data.newURL,
			collectionId: parseInt(collectionId),
		};

		mutationAddURL.mutate(payload, {
			onSuccess: (data, variables, context) => {

				queryClient.invalidateQueries({ queryKey: ["bookmarks", "collection-bookmarks", collectionId] });
				queryClient.invalidateQueries({ queryKey: ["collection-groups"] });

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
		});
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
						isDisabled={!collectionId || !isNumber(collectionId) || !isValid || mutationAddURL.isPending}
						type="submit"
					>
						Save
					</Button>
				</Box>
				{!isNumber(collectionId) && (
					<Box w="100%" textAlign="center">
						<Text fontSize={textStylesTheme.textStyles.primary.fontSize}>
							Please, select a collection to add a bookmark
						</Text>
					</Box>
				)}
			</Stack>
		</FormProvider>
	);
};
