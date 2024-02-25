// Design
import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
// Components
import { GroupAddForm, GroupUpdateForm } from "components/forms/manager";
// Assets

// Hooks

// Types
import { FormActionEnum } from "@/shared/types/global.types";
// General
import { useStore } from "@/store/UseStore";

type TGroupModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

export const GroupModal = ({
	isOpen,
	onClose,
}: TGroupModalProps) => {
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
						<GroupDeleteForm onClose={onClose} />
					)}
				</ModalContent>
			</Modal>
		</>
	);
};
