import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "@/store/UseStore";

// Check if user has permission to actual route, 
// if is then allow to continue
// if not but is authenticated return tu my/manager/dashboard
export const ProtectedAdminLayout = (): JSX.Element => {
	const { authSlice } = useStore();

	// Check Scopes
	// if (isAuthenticated && !authSlice.scopes) {
	// 	return 	<Navigate to="/my/manager/dashboard" />
	// }

	// Set navbar of app
	return <Outlet />;
}
