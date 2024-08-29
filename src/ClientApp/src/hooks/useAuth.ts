import { useStore } from "@/store/UseStore";
import { useNavigate } from "react-router-dom";

type TuseAuth = {
	currentUser: () => string | undefined;
	logout: () => void;
};

export default function useAuth(): TuseAuth {
	const { authSlice } = useStore();
	const navigate = useNavigate();

	const currentUser = (): string | undefined => authSlice.username;

	const logout = (): void => {
		authSlice.logout();
		navigate("/", { replace: true });
	};

	return {
		currentUser,
		logout,
	};
}
