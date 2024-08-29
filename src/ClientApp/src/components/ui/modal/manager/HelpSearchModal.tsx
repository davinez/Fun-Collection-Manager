// Design
import {
	Modal,
	ModalOverlay,
	ModalContent,
	Button,
	TableContainer,
	Table,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	Tfoot,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalCloseButton,
} from "@chakra-ui/react";
// Components

// Assets

// Types

// General

type THelpSearchModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

export const HelpSearchModal = ({ isOpen, onClose }: THelpSearchModalProps) => {
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
					maxW={{ base: "80vw", md: "60vw", lg: "60vw" }}
				>
					<ModalHeader>Search guidelines</ModalHeader>
					<ModalCloseButton />

					<ModalBody>
						<TableContainer>
							<Table variant="simple">
								<Thead>
									<Tr>
										<Th>Filter Type</Th>
										<Th>Format</Th>
									</Tr>
								</Thead>
								<Tbody>
									<Tr>
										<Td>Date</Td>
										<Td>YYYY</Td>
									</Tr>
									<Tr>
										<Td>Date</Td>
										<Td>YYYY-MM</Td>
									</Tr>
									<Tr>
										<Td>Date</Td>
										<Td>YYYY-MM-DD</Td>
									</Tr>
									<Tr>
										<Td>Date</Td>
										<Td>
											{">"}YYYY-MM-DD or {"<"}YYYY-MM-DD
										</Td>
									</Tr>
									<Tr>
										<Td>URL</Td>
										<Td>Text up to 255 characters</Td>
									</Tr>
									<Tr>
										<Td>Description</Td>
										<Td>Text up to 255 characters</Td>
									</Tr>
								</Tbody>
								<Tfoot>
									<Tr>
										<Th>Filter Type</Th>
										<Th>Format</Th>
									</Tr>
								</Tfoot>
							</Table>
						</TableContainer>
					</ModalBody>
					<ModalFooter>
						<Button
							bg="brandPrimary.900"
							color="brandSecondary.600"
							_hover={{
								bg: "brandPrimary.950",
							}}
							mr={3}
							onClick={onClose}
						>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
