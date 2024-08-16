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
import { InputField, TextAreaField } from "components/forms";
// Assets

// Types
import {
	bookmarkUpdateFormPayload,
	type TBookmarkUpdatePayload,
	TBookmark,
} from "@/shared/types/api/manager.types";
// General
import { zodResolver } from "@hookform/resolvers/zod";
import queryClient from "@/api/query-client";
import { useUpdateBookmarkMutation } from "@/api/services/manager";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { defaultHandlerApiError } from "@/api/useApiClient";
import { dataTagSymbol } from "@tanstack/react-query";

type TBookmarkUpdateFormProps = {
	onClose: () => void;
	bookmark: TBookmark;
};

export const BookmarkUpdateForm = ({
	onClose,
	bookmark,
}: TBookmarkUpdateFormProps) => {
	// Hooks
	const methods = useForm<TBookmarkUpdatePayload>({
		resolver: zodResolver(bookmarkUpdateFormPayload),
		mode: "onSubmit",
	});
	const {
		reset,
		formState: { errors },
	} = methods;
	const updateBookmarkMutation = useUpdateBookmarkMutation();
	const toast = useToast();

	const onSubmit: SubmitHandler<TBookmarkUpdatePayload> = (
		data: TBookmarkUpdatePayload
	): void => {
		// Convert object to FomrData
		// We will require only the first upload file
		const formData = new FormData();

		let key: keyof typeof data;
		for (key in data) {
			if (key === "cover" && data[key]) {
				formData.append(key, (data[key] as FileList).item(0) as File);
			} else if (key !== "cover") {
				formData.append(key, data[key] as string);
			}
		}

		updateBookmarkMutation.mutate(
			{ bookmarkId: bookmark.id, payload: formData },
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
					onClose();
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
					defaultValue={bookmark.title}
				/>

				<TextAreaField
					fontSize={textStylesTheme.textStyles.primary.fontSize}
					py={0}
					px={2}
					h={8}
					id="description"
					label="Description"
					errorMessage={
						errors.description ? errors.description.message : undefined
					}
					defaultValue={bookmark.description}
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
					defaultValue={bookmark.websiteURL}
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
