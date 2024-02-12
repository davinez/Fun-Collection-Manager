// Design
import {
	ModalCloseButton,
	ModalFooter,
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
	useUpdateBookmarkMutation,
} from "@/api/services/manager";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { defaultHandlerApiError } from "@/api/apiClient";
// Types
import {
	bookmarkUpdateFormPayload,
	type TBookmarkUpdatePayload,
	TBookmark,
} from "@/shared/types/api/manager.types";
// General
import { zodResolver } from "@hookform/resolvers/zod";
import queryClient from "@/api/query-client";
import { useStore } from "@/store/UseStore";

type TManagerBookmarkUpdateFormProps = {
	onClose: () => void;
	bookmark: TBookmark;
};

export const ManagerBookmarkUpdateForm = ({
	onClose,
	bookmark
}: TManagerBookmarkUpdateFormProps) => {
	// State Hooks
	const { managerSlice } = useStore();
	// General Hooks
	const methods = useForm<TBookmarkUpdatePayload>({
		resolver: zodResolver(bookmarkUpdateFormPayload),
		mode: "onSubmit",
	});
	const {
		reset,
		formState: { errors, isValid, isDirty },
	} = methods;
	const updateBookmarkMutation = useUpdateBookmarkMutation();
	const toast = useToast();

	const onSubmit: SubmitHandler<TBookmarkUpdatePayload> = (
		data: TBookmarkUpdatePayload
	): void => {
		updateBookmarkMutation.mutate(
			{ bookmarkId: bookmark.id, payload: data },
			{
				onSuccess: (data, variables, context) => {
					queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
					toast({
						title: "Bookmark updated.",
						status: "success",
						duration: 5000,
						isClosable: true,
					});
					reset();
				},
				onError: (error, variables, context) => {
					toast({
						title: "Error",
						description: "Error in updating Bookmark",
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
			<Stack as="form" onSubmit={methods.handleSubmit(onSubmit)} p={5}>
				<Flex align="center" justify="space-between" mb={3}>
					<Text fontSize="large">Edit bookmark</Text>
					<ModalCloseButton size="lg" position="unset" />
				</Flex>

				<InputField
					fontSize={textStylesTheme.textStyles.primary.fontSize}
					py={0}
					px={2}
					h={8}
					id="cover"
					type="file"
					label="Cover"
					multiple={false}
					errorMessage={errors.cover ? errors.cover.message : undefined}
				/>

				<InputField
					fontSize={textStylesTheme.textStyles.primary.fontSize}
					py={0}
					px={2}
					h={8}
					id="title"
					label="Title"
					errorMessage={errors.title ? errors.title.message : undefined}
				/>

				<InputField
					fontSize={textStylesTheme.textStyles.primary.fontSize}
					py={0}
					px={2}
					h={8}
					id="description"
					type="text"
					label="Description"
					errorMessage={
						errors.description ? errors.description.message : undefined
					}
				/>

				<InputField
					fontSize={textStylesTheme.textStyles.primary.fontSize}
					py={0}
					px={2}
					h={8}
					id="websiteURL"
					label="URL"
					errorMessage={
						errors.websiteURL ? errors.websiteURL.message : undefined
					}
				/>

				<ModalFooter>
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
						type="submit"
						mr={3}
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
				</ModalFooter>
			</Stack>
		</FormProvider>
	);
};
