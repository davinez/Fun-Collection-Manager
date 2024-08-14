// Design
import {
	ModalCloseButton,
	Text,
	Button,
	Stack,
	useToast,
	Flex,
	Box,
	Image,
} from "@chakra-ui/react";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
// Components
import { LoadingBox, ErrorBox } from "@/components/ui/box";
// Assets

// Types
import {
	collectionUpdateIconFormPayload,
	type TCollectionUpdateIconFormPayload,
} from "@/shared/types/api/manager.types";
// General
import {
	useUpdateCollectionIconMutation,
	useGetAllIconsQuery,
} from "@/api/services/manager";
import { defaultHandlerApiError } from "@/api/useApiClient";
import queryClient from "@/api/query-client";
import { useEffect } from "react";
import { DEFAULT_ICON, R2_DOMAIN } from "shared/config";

type TCollectionIconFormProps = {
	collectionId: number;
	collectionIcon: string | undefined;
	onClose: () => void;
};

export const CollectionIconForm = ({
	collectionId,
	collectionIcon,
	onClose,
}: TCollectionIconFormProps) => {
	// Hooks
	const {
		isPending: isPendingGetAllIcons,
		isError: isErrorGetAllIcons,
		error: errorGetAllIcons,
		data: getGetAllIconsResponse,
	} = useGetAllIconsQuery();
	const updateCollectionCoverMutation = useUpdateCollectionIconMutation();
	const toast = useToast();

	useEffect(() => {
		if (isErrorGetAllIcons) {
			toast({
				title: "Error",
				description: "Error in fetching all icons",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			defaultHandlerApiError(errorGetAllIcons);
		}
	}, [isErrorGetAllIcons]);

	// Handlers

	//const onSubmit = (data): void => {};

	const handleOnClickResetIcon = () => {
		if (!collectionIcon) {
			toast({
				title: "Default icon already in use",
				status: "success",
				duration: 5000,
				isClosable: true,
			});
		} else {
			const payload: TCollectionUpdateIconFormPayload = {
				isDefaultIcon: true,
				iconKey: undefined,
			};

			const validationResult =
				collectionUpdateIconFormPayload.safeParse(payload);

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

			updateCollectionCoverMutation.mutate(
				{
					collectionId,
					payload,
				},
				{
					onSuccess: (data, variables, context) => {
						// TODO: validate invalidating key "collection-groups" to avoid re fetch all
						queryClient.invalidateQueries({ queryKey: ["collection-groups"] });
						toast({
							title: "Icon updated.",
							status: "success",
							duration: 5000,
							isClosable: true,
						});
						onClose();
					},
					onError: (error, variables, context) => {
						toast({
							title: "Error",
							description: "Error in updating icon",
							status: "error",
							duration: 5000,
							isClosable: true,
						});
						defaultHandlerApiError(error);
						onClose();
					},
				}
			);
		}
	};

	const handleOnClickSelectedIcon = (key: string) => {

		if (collectionIcon === key) {
			toast({
				title: "Icon already set",
				status: "success",
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		const payload: TCollectionUpdateIconFormPayload = {
			isDefaultIcon: false,
			iconKey: key,
		};

		const validationResult = collectionUpdateIconFormPayload.safeParse(payload);

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

		updateCollectionCoverMutation.mutate(
			{
				collectionId,
				payload,
			},
			{
				onSuccess: (data, variables, context) => {
					// TODO: validate invalidating key "collection-groups" to avoid re fetch all
					queryClient.invalidateQueries({ queryKey: ["collection-groups"] });
					toast({
						title: "Icon updated.",
						status: "success",
						duration: 5000,
						isClosable: true,
					});
					onClose();
				},
				onError: (error, variables, context) => {
					toast({
						title: "Error",
						description: "Error in updating icon",
						status: "error",
						duration: 5000,
						isClosable: true,
					});
					defaultHandlerApiError(error);
					onClose();
				},
			}
		);
	};

	// Return handling

	if (isPendingGetAllIcons)
		return (
			<Flex p={5} align="center" justify="space-between">
				<LoadingBox />
				<ModalCloseButton size="lg" position="unset" />
			</Flex>
		);

	if (isErrorGetAllIcons)
		return (
			<Flex p={5} align="center" justify="space-between">
				<ErrorBox />
				<ModalCloseButton size="lg" position="unset" />
			</Flex>
		);

	return (
		<Stack p={5}>
			<Flex align="center" justify="space-between" mb={3}>
				<Text fontSize="large">Change Icon</Text>
				<Flex align="center" justify="space-between" gap={3}>
					<Button
						fontSize={textStylesTheme.textStyles.primary.fontSize}
						bg="brandPrimary.900"
						color="brandSecondary.600"
						_hover={{
							bg: "brandPrimary.950",
						}}
						p={2}
						onClick={handleOnClickResetIcon}
					>
						Reset
					</Button>
					<ModalCloseButton size="lg" position="unset" />
				</Flex>
			</Flex>

			{getGetAllIconsResponse.groups.map((group, index) => {
				return (
					<Stack key={`GroupIcons_${index}`} aria-label="icons-group-container">
						<Text mb={4}>{group.title}</Text>
						<Box
							aria-label="icons-container"
							mb={4}
							display="grid"
							gridAutoRows="auto" /* make all rows the same height */
							gridTemplateColumns="repeat(8, 1fr)"
							gap={4}
							justifyItems="center"
							alignItems="center"
						>
							{group.icons.map((icon, index) => {
								return (
									<Box w="100%">
										<Image
											key={`Icon_${group.title + index}`}
											borderRadius="2px"
											boxSize="8"
											color="brandPrimary.150"
											objectFit="contain" 
											src={R2_DOMAIN + "/" + icon.key}
											fallbackSrc={DEFAULT_ICON}
											alt="Default Icon"
											onClick={() => handleOnClickSelectedIcon(icon.key)}
											cursor="pointer"
										/>
									</Box>
								);
							})}
						</Box>
					</Stack>
				);
			})}
		</Stack>
	);
};
