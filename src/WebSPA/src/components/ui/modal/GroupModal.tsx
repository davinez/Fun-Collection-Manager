// Design
import {
	Modal,
	ModalOverlay,
	ModalContent,
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
	useUpdateGroupMutation,
	useGetGroupByIdQuery,
} from "@/api/services/manager";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { defaultHandlerApiError } from "@/api/apiClient";
// Types
import {
	groupAddFormPayload,
	groupUpdateFormPayload,
	type TGroupAddPayload,
	TGroupUpdatePayload,
} from "@/shared/types/api/manager.types";
import { FormActionEnum } from "@/shared/types/global.types";
// General
import { zodResolver } from "@hookform/resolvers/zod";
import queryClient from "@/api/query-client";
import { useStore } from "@/store/UseStore";

type TGroupAddFormProps = {
	onClose: () => void;
};

const GroupAddForm = ({ onClose }: TGroupAddFormProps) => {
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
};

type TGroupUpdateFormProps = {
	onClose: () => void;
};

const GroupUpdateForm = ({ onClose }: TGroupUpdateFormProps) => {
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

type TAddGroupModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

export const GroupModal = ({ isOpen, onClose }: TAddGroupModalProps) => {
	// State Hooks
	const { managerSlice } = useStore();
	// General Hooks

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent
					bg="brandPrimary.900"
					color="brandPrimary.100"
					border="1px solid"
					borderColor="brandPrimary.900"
				>
					{managerSlice.groupModalFormAction === FormActionEnum.Add ? (
						<GroupAddForm onClose={onClose} />
					) : (
						<GroupUpdateForm onClose={onClose} />
					)}
				</ModalContent>
			</Modal>
		</>
	);
};
