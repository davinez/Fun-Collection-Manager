// Design
import { Spinner, Flex, Text } from "@chakra-ui/react";

// Components

// Assets

// Hooks

// Types

// General

type TLoadingBoxProps = {};

export const LoadingBox = ({}: TLoadingBoxProps) => {
	return (
		<Flex align="center" justify="center" gap={2}>
			<Text color="brandPrimary.100" textStyle="primary">
				Loading...
			</Text>
			<Spinner
				size="md"
				thickness="4px"
				speed="0.65s"
				emptyColor="gray.200"
				color="blue.500"
			/>
		</Flex>
	);
};
