import { Suspense, useEffect } from "react";
import { useOutlet, useNavigate } from "react-router-dom";
import { CircularProgress } from "@chakra-ui/react";
//import useAuth from "@/hooks/UseAuth";
import { useStore } from "@/store/UseStore";

export default function AuthLayout(): React.ReactElement {
	//const userData = useLoaderData(); // Check if is necessary or just use hydration
  //const { currentUser } = useAuth();
	const outlet = useOutlet();
	const navigate = useNavigate();

	const { authSlice } = useStore();

	useEffect(() => {
		//Runs on the first render
		//And any time any dependency value changes
	}, [authSlice.hasHydrated]);

	// Manage state when hydrated changes
	if (!authSlice.hasHydrated) {
		return <CircularProgress isIndeterminate color="green.300" />;
	}

	if (authSlice.user !== null) {
		navigate("/manager/dashboard");
	}

	return (
		<Suspense fallback={<CircularProgress isIndeterminate color="green.300" />}>
			{outlet}
		</Suspense>
	);
}
