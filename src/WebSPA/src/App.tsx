import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";
// Layouts and Auth
import {
	AuthLayout,
	HomeLayout,
	ProtectedLayout,
	ManagerLayout,
} from "@/components/layout";
// Pages
import HomePage from "@/routes/HomePage";
import LoginPage from "@/routes/LoginPage";
import SignupPage from "@/routes/SignupPage";
import { DashboardPage } from "@/routes/manager/DashboardPage";
import { AllBookmarksPage } from "@/routes/manager/AllBookmarksPage";
import { GeneralAlertComponent } from "components/ui/alert";

// set a fallback route/page if error ocurrs or enter an invalid route, that page should show and error alert

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			element={<AuthLayout />}
			//loader={getUserDataLoader}
			errorElement={
				<GeneralAlertComponent
					description="Something went wrong!"
					status="error"
				/>
			}
		>
			<Route element={<HomeLayout />}>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
			</Route>

			<Route path="/my" element={<ProtectedLayout />}>
				<Route path="manager" element={<ManagerLayout />}>
					<Route index path="dashboard" element={<DashboardPage />} />
					<Route path="all" caseSensitive element={<AllBookmarksPage />} />
				</Route>
				{/* <Route path="/settings" element={<SettingsPage />} />
				<Route path="/profile" element={<ProfilePage />} /> */}
			</Route>
		</Route>
	)
);

export default router;

// Clean up on module reload (HMR)
// https://vitejs.dev/guide/api-hmr
if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		router.dispose();
	});
}
