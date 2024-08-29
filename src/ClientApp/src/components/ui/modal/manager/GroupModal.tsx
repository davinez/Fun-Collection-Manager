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
import { GroupAddForm, GroupUpdateForm } from "components/forms/manager";
// Assets

// Types
import { FormActionEnum } from "@/shared/types/global.types";
// General
import { useStore } from "@/store/UseStore";

type TGroupModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

export const GroupModal = ({ isOpen, onClose }: TGroupModalProps) => {
	// Hooks
	const { managerSlice } = useStore();

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
					{managerSlice.groupModalFormAction === FormActionEnum.Add && (
						<GroupAddForm onClose={onClose} />
					)}
					{managerSlice.groupModalFormAction === FormActionEnum.Update && (
						<GroupUpdateForm onClose={onClose} />
					)}
					{managerSlice.groupModalFormAction === FormActionEnum.Delete && (
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
									You can not delete a populated group!
								</Text>
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
								onClick={onClose}
							>
								Ok
							</Button>
						</Stack>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};
