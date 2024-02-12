// Design
import {
	Modal,
	ModalOverlay,
	ModalContent,
} from "@chakra-ui/react";
// Components
import { ManagerGroupAddForm, ManagerGroupUpdateForm, ManagerBookmarkUpdateForm } from "components/forms";
// Assets

// Hooks

// Types
import { FormActionEnum } from "@/shared/types/global.types";
import { TBookmark } from "@/shared/types/api/manager.types";
// General
import { useStore } from "@/store/UseStore";


type TManagerBookmarkModalProps = {
	isOpen: boolean;
	onClose: () => void;
  bookmark: TBookmark;
};

export const ManagerBookmarkModal = ({ isOpen, onClose, bookmark }: TManagerBookmarkModalProps) => {
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
				{managerSlice.bookmarkModalFormAction === FormActionEnum.Delete && (
						<ManagerBookmarkDeleteForm onClose={onClose} />
					)}
					{managerSlice.bookmarkModalFormAction === FormActionEnum.Update && (
						<ManagerBookmarkUpdateForm onClose={onClose} bookmark={bookmark} />
					)}
				</ModalContent>
			</Modal>
		</>
	);
};