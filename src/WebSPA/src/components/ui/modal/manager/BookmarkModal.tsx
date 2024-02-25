// Design
import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
// Components
import {
	BookmarkUpdateForm,
	BookmarkDeleteForm,
} from "components/forms/manager";
// Assets

// Hooks
import { useStore } from "@/store/UseStore";
// Types
import { FormActionEnum } from "@/shared/types/global.types";
import { TBookmark } from "@/shared/types/api/manager.types";
// General

type TManagerBookmarkModalProps = {
	isOpen: boolean;
	onClose: () => void;
	bookmark?: TBookmark;
};

export const BookmarkModal = ({
	isOpen,
	onClose,
	bookmark,
}: TManagerBookmarkModalProps) => {
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
						<BookmarkDeleteForm onClose={onClose} />
					)}
					{managerSlice.bookmarkModalFormAction === FormActionEnum.Update &&
						bookmark && (
							<BookmarkUpdateForm
								onClose={onClose}
								bookmark={bookmark}
							/>
						)}
				</ModalContent>
			</Modal>
		</>
	);
};
