// Design
import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
// Components
import { ManagerGroupAddForm, ManagerGroupUpdateForm } from "components/forms";
// Assets

// Hooks

// Types
import { FormActionEnum } from "@/shared/types/global.types";
// General
import { useStore } from "@/store/UseStore";

type TManagerGroupModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

export const ManagerGroupModal = ({
	isOpen,
	onClose,
}: TManagerGroupModalProps) => {
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
					{managerSlice.groupModalFormAction === FormActionEnum.Add && (
						<ManagerGroupAddForm onClose={onClose} />
					)}
					{managerSlice.groupModalFormAction === FormActionEnum.Update && (
						<ManagerGroupUpdateForm onClose={onClose} />
					)}
				</ModalContent>
			</Modal>
		</>
	);
};
