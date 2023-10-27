import { Suspense } from "react";
import { useOutlet, useNavigate } from "react-router-dom";
import { CircularProgress } from "@chakra-ui/react";
import useAuth from "@/hooks/UseAuth";

//
//import { useLocalStorage } from "./useLocalStorage";

export default function AuthLayout(): React.ReactElement {
	//const userData = useLoaderData(); // Check if is necessary or just use hydration
	const outlet = useOutlet();
	const navigate = useNavigate();
	const { currentUser, hasHydrated } = useAuth();

	// Manage state when hydrated changes
	if (!hasHydrated()) {
		<CircularProgress isIndeterminate color="green.300" />;
	}

	if (currentUser() !== null) {
		navigate("/manager/dashboard");
	}

	return (
		<Suspense fallback={<CircularProgress isIndeterminate color="green.300" />}>
			{outlet}
		</Suspense>
	);
}
