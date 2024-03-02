import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "@/store/UseStore";

export const ProtectedLayout = (): JSX.Element => {
	const { authSlice } = useStore();

	if (!authSlice.username) {
		return 	<Navigate to="/" />
	}

	// Set navbar of app
	return <Outlet />;
}
