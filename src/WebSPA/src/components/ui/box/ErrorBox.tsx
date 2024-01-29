// Design
import { Flex, Text } from "@chakra-ui/react";

// Components

// Assets

// Hooks

// Types

// General

type TErrorBoxProps = {};

export const ErrorBox = ({}: TErrorBoxProps) => {
	return (
		<Flex align="center" justify="center" gap={2}>
			<Text color="brandPrimary.100" textStyle="primary">
				Error ocurred...
			</Text>			
		</Flex>
	);
};