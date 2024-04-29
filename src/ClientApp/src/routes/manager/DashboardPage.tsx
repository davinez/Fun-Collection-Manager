import { Stack, Text, Table } from "@chakra-ui/react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {  useMsal } from "@azure/msal-react";

export const DashboardPage = (): React.ReactElement => {
    const { instance, accounts, inProgress } = useMsal();
    const activeAccount = instance.getActiveAccount();

	return (
		<Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
			<Text>Dashboard</Text>
		</Stack>
	);
}
