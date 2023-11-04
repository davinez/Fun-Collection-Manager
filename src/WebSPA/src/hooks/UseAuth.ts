import { useStore } from "@/store/UseStore";
import { useNavigate } from "react-router-dom";
import type { TUser } from "shared/types/dto/User.types";

type TuseAuth = {
	currentUser: () => TUser | null;
	logout: () => void;
};

export default function useAuth(): TuseAuth {
	const { authSlice } = useStore();
	const navigate = useNavigate();

	const currentUser = (): TUser | null => authSlice.user;

	const logout = (): void => {
		authSlice.logout();
		navigate("/", { replace: true });
	};

	return {
		currentUser,
		logout,
	};
}
