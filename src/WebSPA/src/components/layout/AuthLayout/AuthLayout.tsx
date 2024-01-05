import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { CircularProgress } from "@chakra-ui/react";
import { useStore } from "@/store/UseStore";

export const AuthLayout = (): React.ReactElement => {
	//const userData = useLoaderData(); // Check if is necessary or just use hydration
	const { authSlice } = useStore();

	useEffect(() => {
		//Runs on the first render
		//And any time any dependency value change

	}, [authSlice.hasHydrated]);

	// Manage state when hydrated changes
	if (!authSlice.hasHydrated) {
		return <CircularProgress isIndeterminate color="green.300" />;
	}

	return (
		<Suspense fallback={<CircularProgress isIndeterminate color="green.300" />}>
			<Outlet />
		</Suspense>
	);
}
