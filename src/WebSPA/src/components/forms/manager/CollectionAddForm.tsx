// Design
import { Button, Stack, useToast, Flex, Icon } from "@chakra-ui/react";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
import { AiOutlinePlus } from "react-icons/ai";
// Components
import { InputField } from "components/forms";
// Assets

// Hooks
import { useAddGroupMutation } from "@/api/services/manager";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { defaultHandlerApiError } from "@/api/apiClient";
// Types
import {
	groupAddFormPayload,
	type TGroupAddPayload,
} from "@/shared/types/api/manager.types";
// General
import { zodResolver } from "@hookform/resolvers/zod";
import queryClient from "@/api/query-client";

type TCollectionAddFormProps = {
	setIsShowingInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CollectionAddForm = ({
	setIsShowingInput,
}: TCollectionAddFormProps) => {
	// State Hooks

	// General Hooks
	const methods = useForm<TGroupAddPayload>({
		resolver: zodResolver(groupAddFormPayload),
		mode: "onChange",
	});
	const {
		reset,
		formState: { errors, isValid, isDirty },
	} = methods;
	const AddGroupMutation = useAddGroupMutation();
	const toast = useToast();

	// Add mutation, type and validation
	// Submit on button click or enter key

	const onSubmit: SubmitHandler<TGroupAddPayload> = (
		data: TGroupAddPayload
	): void => {
		AddGroupMutation.mutate(data, {
			onSuccess: (data, variables, context) => {
				queryClient.invalidateQueries({ queryKey: ["collection-groups"] });
				toast({
					title: "Group Added.",
					status: "success",
					duration: 5000,
					isClosable: true,
				});
				reset();
			},
			onError: (error, variables, context) => {
				toast({
					title: "Error",
					description: "Error in adding Group",
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
			<Stack w="100%" as="form" onSubmit={methods.handleSubmit(onSubmit)}>
				<Flex
					w="100%"
					align="center"
					cursor="pointer"
					textStyle="primary"
					bg="brandPrimary.800"
					pr={3}
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
						isDisabled={!isDirty || !isValid}
						onClick={() => setIsShowingInput(false)}
					>
						<Icon
							h="100%"
							w="100%"
							boxSize="5"
							color="brandPrimary.100"
							as={AiOutlinePlus}
						/>
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
							borderBottomColor: "brandSecondary.600"
						}}
						fontSize={textStylesTheme.textStyles.primary.fontSize}
						p={0}
						my={1}
						h={6}
						borderBottom="1px solid"
						borderRadius={0}
						borderBottomColor="brandSecondary.600"
						id="groupName"
						placeholder="New Collection"
					/>
				</Flex>
			</Stack>
		</FormProvider>
	);
};
