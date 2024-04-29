import { Suspense, useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from "@chakra-ui/react";
import { useMsal } from "@azure/msal-react";
import { useStore } from "@/store/UseStore";

// Check if use is authenticated,
// if is then redirect to main page of "my"
// if not then return to home
export const AuthLayout = (): React.ReactElement => {
	const location = useLocation();
	const navigate = useNavigate();
	const { authSlice } = useStore();
	const { instance } = useMsal();
	const activeAccount = instance.getActiveAccount();
	const AuthAndSyncValidate = () => {
		if (activeAccount !== null && !authSlice.accountIdentifiers.homeAccountId) {
			return false;
		} else if (
			activeAccount !== null &&
			authSlice.accountIdentifiers.homeAccountId
		) {
			return true;
		}
		return false;
	};
	const IsAuthenticated = AuthAndSyncValidate();

	useEffect(() => {
		//Runs on the first render
		//And any time any dependency value change
		if (
			(authSlice.hasHydrated &&
				activeAccount !== null &&
				!authSlice.accountIdentifiers.homeAccountId) ||
			(authSlice.hasHydrated &&
				activeAccount === null &&
				authSlice.accountIdentifiers.homeAccountId)
		) {
			console.log("sdfsd");
			authSlice.logout();
			instance.clearCache();
			navigate("/");
		}
	}, [authSlice.hasHydrated]);

	// useEffect(() => {

	// }, [authSlice.accountIdentifiers.homeAccountId]);

	// Manage state when hydrated changes
	if (!authSlice.hasHydrated) {
		return <CircularProgress isIndeterminate color="green.300" />;
	}

	// Negate acces to auth routes
	if (!IsAuthenticated && location.pathname.indexOf("/my/") > -1) {
		return <Navigate to="/" />;
	}

	// Negate acces to Home/None auth routes
	if (IsAuthenticated && location.pathname.indexOf("/my/") === -1) {
		return <Navigate to="/my/manager/dashboard" />;
	}

	return (
		<Suspense fallback={<CircularProgress isIndeterminate color="green.300" />}>
			<Outlet />
		</Suspense>
	);
};
