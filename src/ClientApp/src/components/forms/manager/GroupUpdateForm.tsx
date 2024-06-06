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
import { LoadingBox, ErrorBox } from "@/components/ui/box";
// Assets

// Hooks
import {
	useUpdateGroupMutation,
	useGetGroupByIdQuery,
} from "@/api/services/manager";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { defaultHandlerApiError } from "@/api/useApiClient";
// Types
import {
	groupUpdateFormPayload,
	type TGroupUpdatePayload,
} from "@/shared/types/api/manager.types";
// General
import { zodResolver } from "@hookform/resolvers/zod";
import queryClient from "@/api/query-client";
import { useStore } from "@/store/UseStore";
import { useEffect } from "react";

type TGroupUpdateFormProps = {
	onClose: () => void;
};

export const GroupUpdateForm = ({ onClose }: TGroupUpdateFormProps) => {
	// Hooks
	const { managerSlice } = useStore();
	const methods = useForm<TGroupUpdatePayload>({
		resolver: zodResolver(groupUpdateFormPayload),
		mode: "onSubmit",
	});
	const {
		reset,
		formState: { errors },
	} = methods;
	const {
		data: getGroupByIdResponse,
		isPending: isPendingGetGroupById,
		isError: isErrorGetGroupById,
		error: errorGetGroupById,
	} = useGetGroupByIdQuery(managerSlice.selectedSidebarGroupId);
	const UpdateGroupMutation = useUpdateGroupMutation();
	const toast = useToast();

	// Handle Error or Store update
	useEffect(() => {
		if (isErrorGetGroupById && managerSlice.selectedSidebarGroupId !== 0) {
			toast({
				title: "Error",
				description: "Error in fetching Group Data",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			defaultHandlerApiError(errorGetGroupById);
		}
	}, [isErrorGetGroupById, managerSlice.selectedSidebarGroupId]);

	// Handlers

	const onSubmit: SubmitHandler<TGroupUpdatePayload> = (
		data: TGroupUpdatePayload
	): void => {
		UpdateGroupMutation.mutate(
			{ groupId: managerSlice.selectedSidebarGroupId as number, payload: data },
			{
				onSuccess: (data, variables, context) => {
					queryClient.invalidateQueries({ queryKey: ["collection-groups"] });
					queryClient.invalidateQueries({
						queryKey: ["group", managerSlice.selectedSidebarGroupId],
					});
					toast({
						title: "Group updated.",
						status: "success",
						duration: 5000,
						isClosable: true,
					});
					reset();
					onClose();
					// Reset selected group Id
					managerSlice.setSelectedSidebarGroupId(0);
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

	// Return handling
	if (isPendingGetGroupById)
		return (
			<>
				<Flex align="center" justify="space-between" mb={3}>
					<Text fontSize="large">Update group</Text>
					<ModalCloseButton size="lg" position="unset" />
				</Flex>
				<LoadingBox />
			</>
		);

	if (isErrorGetGroupById) return <ErrorBox />;

	return (
		<FormProvider {...methods}>
			<Stack as="form" onSubmit={methods.handleSubmit(onSubmit)} p={5}>
				<Flex align="center" justify="space-between" mb={3}>
					<Text fontSize="large">Update group</Text>
					<ModalCloseButton size="lg" position="unset" />
				</Flex>

				<InputField
					fontSize={textStylesTheme.textStyles.primary.fontSize}
					py={0}
					px={2}
					h={8}
					id="groupName"
					errorMessage={errors.groupName ? errors.groupName.message : undefined}
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
