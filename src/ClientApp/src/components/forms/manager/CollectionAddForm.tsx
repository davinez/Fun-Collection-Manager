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
import { useAddCollectionMutation } from "@/api/services/manager";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { defaultHandlerApiError } from "@/api/useApiClient";
// Types
import {
	collectionAddFormPayload,
	type TCollectionAddFormPayload,
	type TCollectionAddExtrasPayload
} from "@/shared/types/api/manager.types";
// General
import { zodResolver } from "@hookform/resolvers/zod";
import queryClient from "@/api/query-client";
import { useCallback, useRef } from "react";
import { DEFAULT_ICON } from "shared/config";

type TCollectionAddFormProps = {
	setIsShowingInput: React.Dispatch<React.SetStateAction<boolean>>;
	groupId: number;
	parentCollectionId?: number;
};

export const CollectionAddForm = ({
	setIsShowingInput,
	groupId,
	parentCollectionId,
	...rest
}: TCollectionAddFormProps & FlexProps) => {
	// Hooks

	// Validation is triggered on the changeevent for each input, leading to multiple re-renders.
	// Warning: this often comes with a significant impact on performance.
	const methods = useForm<TCollectionAddFormPayload>({
		resolver: zodResolver(collectionAddFormPayload),
		mode: "onChange",
	});
	const {
		reset,
		formState: { errors, isValid },
	} = methods;
	const addCollectionMutation = useAddCollectionMutation();
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
			setIsShowingInput(false);
		}
	};

	const onSubmit: SubmitHandler<TCollectionAddFormPayload> = (data): void => {
		const payload: TCollectionAddFormPayload & TCollectionAddExtrasPayload = {
			name: data.name,
			icon: DEFAULT_ICON,
			groupId,
			parentCollectionId: parentCollectionId,
		};

		addCollectionMutation.mutate(payload, {
			onSuccess: (data, variables, context) => {
				setIsShowingInput(false);
				queryClient.invalidateQueries({ queryKey: ["collection-groups"] });
				toast({
					title: "Collection Added.",
					status: "success",
					duration: 5000,
					isClosable: true,
				});
				reset();
			},
			onError: (error, variables, context) => {
				setIsShowingInput(false);
				toast({
					title: "Error",
					description: "Error in adding Collection",
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
						aria-label="Add Collection"
						p={0}
						m={0}
						h="100%"
						w="20%"
						bg="brandPrimary.800"
						_hover={{
							bg: "brandPrimary.800",
						}}
						type="submit"
						isDisabled={!isValid || addCollectionMutation.isPending}
					>
						{addCollectionMutation.isPending ? (
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
						placeholder="New Collection"
						onBlur={handleOnInputFocusOut}
						ref={handleOnInputRefChange}
					/>
				</Flex>
			</Stack>
		</FormProvider>
	);
};
