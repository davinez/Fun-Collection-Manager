import { Stack, Text } from "@chakra-ui/react";

export const DashboardPage = (): React.ReactElement => {
	return (
		<Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
			<Text>Dashboard</Text>
		</Stack>
	);
}
