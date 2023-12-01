import { Stack, Text } from "@chakra-ui/react";

export default function ManagerDashboardPage(): React.ReactElement {
	return (
		<Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
			<Text>Dashboard</Text>
		</Stack>
	);
}
