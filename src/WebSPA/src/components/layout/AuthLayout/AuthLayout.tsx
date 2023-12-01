import { Suspense, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { CircularProgress } from "@chakra-ui/react";
import { useStore } from "@/store/UseStore";

export default function AuthLayout(): React.ReactElement {
	//const userData = useLoaderData(); // Check if is necessary or just use hydration
	const { authSlice } = useStore();
  const navigate = useNavigate();

	useEffect(() => {
		//Runs on the first render
		//And any time any dependency value changes
    if (authSlice.hasHydrated && authSlice.username) {
      navigate('/my/manager/dashboard');
    }

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
