// Design
import { Icon, Text, Button, Stack, useToast, Flex } from "@chakra-ui/react";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
import { AiFillAlert } from "react-icons/ai";
// Components
import { InputField, TextAreaField } from "components/forms";
// Assets

// Hooks
import { useDeleteBookmarkMutation } from "@/api/services/manager";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { defaultHandlerApiError } from "@/api/apiClient";
import { useStore } from "@/store/UseStore";
// Types
import {
	bookmarkDeleteFormPayload,
	type TBookmarkDeletePayload,
} from "@/shared/types/api/manager.types";
// General
import { zodResolver } from "@hookform/resolvers/zod";
import queryClient from "@/api/query-client";

type TManagerBookmarkDeleteFormProps = {
	onClose: () => void;
};

export const ManagerBookmarkDeleteForm = ({
	onClose,
}: TManagerBookmarkDeleteFormProps) => {
	// State Hooks
	const { managerSlice } = useStore();
	// General Hooks

	const deleteBookmarkMutation = useDeleteBookmarkMutation();
	const toast = useToast();

	const handleOnClickDeleteBookmark = () => {
		const payload: TBookmarkDeletePayload = {
			bookmarkIds: managerSlice.selectedBookmarksCheckbox,
		};

		// Validate
		const validationResult = bookmarkDeleteFormPayload.safeParse(payload);

		if (!validationResult.success) {
			console.error(validationResult.error.message);
			toast({
				title: "Error",
				description: "Error in validation",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
      return;
		}

		deleteBookmarkMutation.mutate(payload, {
			onSuccess: (data, variables, context) => {
				queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
				toast({
					title: "Bookmark deleted.",
					status: "success",
					duration: 5000,
					isClosable: true,
				});
			},
			onError: (error, variables, context) => {
				toast({
					title: "Error",
					description: "Error in deleting Bookmark",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				defaultHandlerApiError(error);
			},
		});
	};

	return (
		<Stack p={5}>
			<Flex align="center" mb={3}>
				<Icon
					ml="0px"
					mr="10px"
					boxSize="5"
					color="yellow.200"
					as={AiFillAlert}
				/>
				<Text fontSize="large">Are you sure?</Text>
			</Flex>

			<Button
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
				mr={3}
				onClick={handleOnClickDeleteBookmark}
			>
				Ok
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
	);
};
