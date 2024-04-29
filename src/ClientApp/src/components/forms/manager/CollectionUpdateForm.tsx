// Design
import {
	Button,
	Stack,
	useToast,
	Flex,
	Icon,
	FlexProps,
	Spinner,
} from "@chakra-ui/react";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
import { AiOutlinePlus } from "react-icons/ai";
// Components
import { InputField } from "components/forms";
// Assets

// Hooks
import { useUpdateCollectionMutation } from "@/api/services/manager";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { defaultHandlerApiError } from "@/api/useApiClient";
// Types
import {
	collectionUpdateFormPayload,
	type TCollectionUpdateFormPayload,
	TCollection,
} from "@/shared/types/api/manager.types";
// General
import { zodResolver } from "@hookform/resolvers/zod";
import queryClient from "@/api/query-client";
import { useCallback, useRef } from "react";

type TCollectionUpdateFormProps = {
	setIsSelfEditable: React.Dispatch<React.SetStateAction<boolean>>;
	collection: TCollection;
};

export const CollectionUpdateForm = ({
	setIsSelfEditable,
	collection,
	...rest
}: TCollectionUpdateFormProps & FlexProps) => {
	// Hooks

	// Validation is triggered on the changeevent for each input, leading to multiple re-renders.
	// Warning: this often comes with a significant impact on performance.
	const methods = useForm<TCollectionUpdateFormPayload>({
		resolver: zodResolver(collectionUpdateFormPayload),
		mode: "onChange",
	});
	const {
		reset,
		formState: { errors, isValid },
	} = methods;
	const updateCollectionMutation = useUpdateCollectionMutation();
	const toast = useToast();
	const refForm = useRef<HTMLFormElement>(null);
	const handleOnInputRefChange = useCallback((node: HTMLInputElement) => {
		// console.log(node);
		if (node !== null) {
			node.focus();
		}
	}, []); // adjust deps

	// Handlers

	const handleOnInputFocusOut = (event: React.FocusEvent<HTMLInputElement>) => {
		// clicked outside of form component
		if (
			refForm.current &&
			!refForm.current.contains(event.relatedTarget as HTMLElement)
		) {
			setIsSelfEditable(false);
		}
	};

	const onSubmit: SubmitHandler<TCollectionUpdateFormPayload> = (
		data
	): void => {
		updateCollectionMutation.mutate(
			{
				collectionId: collection.id,
				payload: data,
			},
			{
				onSuccess: (data, variables, context) => {
					setIsSelfEditable(false);
					queryClient.invalidateQueries({ queryKey: ["collection-groups"] });
					toast({
						title: "Collection Updated.",
						status: "success",
						duration: 5000,
						isClosable: true,
					});
					reset();
				},
				onError: (error, variables, context) => {
					setIsSelfEditable(false);
					toast({
						title: "Error",
						description: "Error in updating Collection",
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
			<Stack
				tabIndex={-1} // Make it focusable to catch it with relatedTarger
				w="100%"
				as="form"
				onSubmit={methods.handleSubmit(onSubmit)}
				ref={refForm}
			>
				<Flex
					w="100%"
					align="center"
					textStyle="primary"
					bg="brandPrimary.800"
					pr={3}
					{...rest}
				>
					<Button
						aria-label="Update Collection"
						p={0}
						m={0}
						h="100%"
						w="20%"
						bg="brandPrimary.800"
						_hover={{
							bg: "brandPrimary.800",
						}}
						type="submit"
						isDisabled={!isValid || updateCollectionMutation.isPending}
					>
						{updateCollectionMutation.isPending ? (
							<Spinner h="100%" w="100%" boxSize="5" color="brandPrimary.100" />
						) : (
							<Icon
								h="100%"
								w="100%"
								boxSize="5"
								color="brandPrimary.100"
								as={AiOutlinePlus}
							/>
						)}
					</Button>

					<InputField
						color="brandPrimary.100"
						border="none"
						_focus={{
							border: "none",
							outline: "none",
							boxShadow: "none",
							borderBottom: "1px solid",
							borderRadius: "0",
							borderBottomColor: "brandSecondary.600",
						}}
						_hover={{
							borderBottomColor: "brandSecondary.600",
						}}
						fontSize={textStylesTheme.textStyles.primary.fontSize}
						p={0}
						my={1}
						h={6}
						borderBottom="1px solid"
						borderRadius={0}
						borderBottomColor="brandSecondary.600"
						id="name"
						onBlur={handleOnInputFocusOut}
						defaultValue={collection.name}
						ref={handleOnInputRefChange}
					/>
				</Flex>
			</Stack>
		</FormProvider>
	);
};
