import { useStore } from "@/store/UseStore";
import { useNavigate } from "react-router-dom";
import type { TUser } from "shared/types/dto/User.types";

type TuseAuth = {
	hasHydrated: () => boolean;
	isLogged: () => boolean;
	currentUser: () => TUser | null;
	login: () => void;
	logout: () => void;
};

export default function useAuth(): TuseAuth {
	const { authSlice } = useStore();
	const navigate = useNavigate();

	const hasHydrated = (): boolean => authSlice.hasHydrated;

	const isLogged = (): boolean => {
		return authSlice.user == null ? false : true;
	};

	const currentUser = (): TUser | null => authSlice.user;

	const login = (): void => {
		// call react query api service hook

		// store values in store

		navigate("/manager/dashboard", { replace: true });
	};

	const logout = (): void => {
		authSlice.logout();
		navigate("/", { replace: true });
	};

	return {
		hasHydrated,
		isLogged,
		currentUser,
		login,
		logout,
	};
}
