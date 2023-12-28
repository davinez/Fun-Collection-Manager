// Design
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalCloseButton,
	Text,
	Icon,
	Button,
	Stack,
	useToast,
	Flex,
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
import {
	useAddGroupMutation,
	useUpdateGroupMutation,
} from "@/api/services/manager";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { isAxiosError } from "@/hooks/UseApiClient";
// Types
import type { TApiResponse } from "@/shared/types/api/api-responses.types";
import {
	groupFormPayload,
	type TGroupPayload,
} from "@/shared/types/api/manager.types";
import { ReusableFormActionEnum } from "@/shared/types/global.types";
// General
import { zodResolver } from "@hookform/resolvers/zod";
import queryClient from "@/api/query-client";
import { useStore } from "@/store/UseStore";

type TGroupFormProps = {
	onClose: () => void;
	formAction: ReusableFormActionEnum;
};

const GroupForm = ({ onClose, formAction }: TGroupFormProps) => {
	// State Hooks
	const { managerSlice } = useStore();
	// General Hooks
	const methods = useForm<TGroupPayload>({
		resolver: zodResolver(groupFormPayload),
		mode: "onChange",
	});
	const {
		reset,
		formState: { errors, isSubmitting, isValid, isDirty },
	} = methods;
	const AddGroupMutation = useAddGroupMutation();
	const UpdateGroupMutation = useUpdateGroupMutation();
	const toast = useToast();

	const onSubmit: SubmitHandler<TGroupPayload> = (
		data: TGroupPayload
	): void => {
		if (formAction === ReusableFormActionEnum.Add) {
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
					if (isAxiosError<TApiResponse>(error)) {
						toast({
							title: "Error",
							description: "Error in adding Group",
							status: "error",
							duration: 5000,
							isClosable: true,
						});
						console.error(error.response?.data.messsage as string);
					} else {
						console.error(`General error: ${error.name} ${error.message}`);
					}
				},
			});
		}

		if (formAction === ReusableFormActionEnum.Update) {
			const groupId = managerSlice.selectedSidebarGroup;

			// get group data by id using query;

			if (!groupId) {
				toast({
					title: "Error",
					description: "Error in getting group update data",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				console.error("groupId in form submit is undefined");
				return;
			}

			// UpdateGroupMutation.mutate(
			// 	{ groupId: groupId, payload:  },
			// 	{
			// 		onSuccess: (data, variables, context) => {
			// 			queryClient.invalidateQueries({ queryKey: ["collection-groups"] });
			// 			toast({
			// 				title: "Group Added.",
			// 				status: "success",
			// 				duration: 5000,
			// 				isClosable: true,
			// 			});
			// 			reset();
			// 		},
			// 		onError: (error, variables, context) => {
			// 			if (isAxiosError<TApiResponse>(error)) {
			// 				toast({
			// 					title: "Error",
			// 					description: "Error in adding Group",
			// 					status: "error",
			// 					duration: 5000,
			// 					isClosable: true,
			// 				});
			// 				console.error(error.response?.data.messsage as string);
			// 			} else {
			// 				console.error(`General error: ${error.name} ${error.message}`);
			// 			}
			// 		},
			// 	}
			// );
		}
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

type TAddGroupModalProps = {
	isOpen: boolean;
	onClose: () => void;
	formAction: ReusableFormActionEnum;
};

export const GroupModal = ({
	isOpen,
	onClose,
	formAction,
}: TAddGroupModalProps) => {
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
					<GroupForm onClose={onClose} formAction={formAction} />
				</ModalContent>
			</Modal>
		</>
	);
};
