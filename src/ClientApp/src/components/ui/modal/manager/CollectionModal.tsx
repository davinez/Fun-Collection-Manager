// Design
import {
	Modal,
	ModalOverlay,
	ModalContent,
	Icon,
	Text,
	Button,
	Stack,
	Flex,
} from "@chakra-ui/react";
import { AiFillAlert } from "react-icons/ai";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
// Components
import { CollectionIconForm } from "components/forms/manager";
// Assets

// Types
import { CollectionModalActionEnum } from "@/shared/types/global.types";
// General

type TCollectionModalProps = {
	isOpen: boolean;
	onClose: () => void;
	modalAction: CollectionModalActionEnum;
	executeDeleteMutation?: () => void;
	collectionId: number;
	collectionIcon: string;
};

export const CollectionModal = ({
	isOpen,
	onClose,
	modalAction,
	executeDeleteMutation,
	collectionId,
	collectionIcon
}: TCollectionModalProps) => {
	// Hooks

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent
					bg="brandPrimary.900"
					color="brandPrimary.100"
					border="1px solid"
					borderColor="brandPrimary.900"
				  minH="150px"
					maxW={{sm: "80vw", md: "60vw", lg: "60vw"}}
				>
					{modalAction === CollectionModalActionEnum.Icon && (
						<CollectionIconForm collectionId={collectionId} collectionIcon={collectionIcon} onClose={onClose}/>
					)}
					{modalAction === CollectionModalActionEnum.Delete && (
						<Stack p={5}>
							<Flex align="center" mb={3}>
								<Icon
									ml="0px"
									mr="10px"
									boxSize="5"
									color="red.200"
									as={AiFillAlert}
								/>
								<Text fontSize="large">
									Are you sure you want to delete this collection? All bookmarks
									within the collection will be deleted.
								</Text>
							</Flex>

							<Button
								w="100%"
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
								onClick={executeDeleteMutation}
							>
								Delete
							</Button>
							<Button
								w="100%"
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
					)}
				</ModalContent>
			</Modal>
		</>
	);
};
