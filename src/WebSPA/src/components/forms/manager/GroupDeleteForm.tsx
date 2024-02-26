// Design
import { Icon, Text, Button, Stack, Flex } from "@chakra-ui/react";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
import { AiFillAlert } from "react-icons/ai";
// Components

// Assets

// Hooks

// Types

// General

type TGroupDeleteFormProps = {
	onClose: () => void;
};

export const GroupDeleteForm = ({ onClose }: TGroupDeleteFormProps) => {
	// Hooks

	// Handlers
	const handleOnClick = () => {
		onClose();
	};

	// Return handling

	return (
		<Stack p={5}>
			<Flex align="center" mb={3}>
				<Icon ml="0px" mr="10px" boxSize="5" color="red.200" as={AiFillAlert} />
				<Text fontSize="large">You can not delete a populated group!</Text>
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
				onClick={handleOnClick}
			>
				Ok
			</Button>
		</Stack>
	);
};
