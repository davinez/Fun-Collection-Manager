// Design
import {
	ModalCloseButton,
	Text,
	Button,
	Stack,
	useToast,
	Flex,
} from "@chakra-ui/react";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
// Components
import { InputField } from "components/forms";
// Assets

// Hooks
import {
	useAddGroupMutation,
} from "@/api/services/manager";
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

type TGroupAddFormProps = {
	onClose: () => void;
};

export const GroupAddForm = ({ onClose }: TGroupAddFormProps) => {
	// Hooks

	// Validation is triggered on the changeevent for each input, leading to multiple re-renders. 
	// Warning: this often comes with a significant impact on performance.
	const methods = useForm<TGroupAddPayload>({
		resolver: zodResolver(groupAddFormPayload),
		mode: "onChange",
	});
	const {
		reset,
		formState: { errors, isValid },
	} = methods;
	const AddGroupMutation = useAddGroupMutation();
	const toast = useToast();

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
			<Stack as="form" onSubmit={methods.handleSubmit(onSubmit)} p={5}>
				<Flex align="center" justify="space-between" mb={3}>
					<Text fontSize="large">Enter group</Text>
					<ModalCloseButton size="lg" position="unset" />
				</Flex>

				<InputField
					fontSize={textStylesTheme.textStyles.primary.fontSize}
					py={0}
					px={2}
					h={8}
					id="groupName"
					errorMessage={errors.groupName ? errors.groupName.message : undefined}
					placeholder="Group name..."
				/>

				<Button
					mt={4}
					bg="brandSecondary.600"
					h={8}
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
					isDisabled={!isValid}
					type="submit"
				>
					Save
				</Button>
				<Button
					bg="brandPrimary.950"
					color="brandPrimary.100"
					h={8}
					_hover={{
						bg: "brandSecondary.800",
					}}
					fontSize={textStylesTheme.textStyles.primary.fontSize}
					onClick={onClose}
				>
					Cancel
				</Button>
			</Stack>
		</FormProvider>
	);
};