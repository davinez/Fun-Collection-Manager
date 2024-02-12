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
	useUpdateGroupMutation,
	useGetGroupByIdQuery,
} from "@/api/services/manager";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { defaultHandlerApiError } from "@/api/apiClient";
// Types
import {
	groupUpdateFormPayload,
	type TGroupUpdatePayload,
} from "@/shared/types/api/manager.types";
// General
import { zodResolver } from "@hookform/resolvers/zod";
import queryClient from "@/api/query-client";
import { useStore } from "@/store/UseStore";


type TGroupUpdateFormProps = {
	onClose: () => void;
};

export const ManagerGroupUpdateForm = ({ onClose }: TGroupUpdateFormProps) => {
	// State Hooks
	const { managerSlice } = useStore();
	// General Hooks
	const methods = useForm<TGroupUpdatePayload>({
		resolver: zodResolver(groupUpdateFormPayload),
		mode: "onChange",
	});
	const {
		reset,
		formState: { errors, isValid, isDirty },
	} = methods;
	const UpdateGroupMutation = useUpdateGroupMutation();
	const { data: getGroupByIdResponse } = useGetGroupByIdQuery(
		managerSlice.selectedSidebarGroup as number
	);
	const toast = useToast();

	const onSubmit: SubmitHandler<TGroupUpdatePayload> = (
		data: TGroupUpdatePayload
	): void => {
		UpdateGroupMutation.mutate(
			{ groupId: managerSlice.selectedSidebarGroup as number, payload: data },
			{
				onSuccess: (data, variables, context) => {
					queryClient.invalidateQueries({ queryKey: ["collection-groups"] });
					toast({
						title: "Group updated.",
						status: "success",
						duration: 5000,
						isClosable: true,
					});
					reset();
				},
				onError: (error, variables, context) => {
					toast({
						title: "Error",
						description: "Error in updating Group",
						status: "error",
						duration: 5000,
						isClosable: true,
					});
					defaultHandlerApiError(error);
				},
			}
		);
	};

	if (getGroupByIdResponse) {
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
						errorMessage={
							errors.groupName ? errors.groupName.message : undefined
						}
						defaultValue={getGroupByIdResponse.name}
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
						isDisabled={!isDirty || !isValid}
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
	}

	return (
		<>
			<Flex align="center" justify="space-between" mb={3}>
				<Text fontSize="large">Update group</Text>
				<ModalCloseButton size="lg" position="unset" />
			</Flex>
			<Text textStyle="primary">Loading...</Text>
		</>
	);
};