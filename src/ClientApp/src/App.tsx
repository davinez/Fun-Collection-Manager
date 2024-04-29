import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";
// Layouts and Auth
import {
	AuthLayout,
	HomeLayout,
	ManagerLayout,
	ProtectedAdminLayout,
} from "@/components/layout";
// Pages
import NotFound from "@/routes/NotFound";
import HomePage from "@/routes/HomePage";
import LoginPage from "@/routes/LoginPage";
import SignupPage from "@/routes/SignupPage";
import { DashboardPage } from "@/routes/manager/DashboardPage";
import { AllBookmarksPage } from "@/routes/manager/AllBookmarksPage";
import { CollectionPage } from "@/routes/manager/CollectionPage";
import { GeneralAlert } from "components/ui/alert";

// set a fallback route/page if error ocurrs or enter an invalid route, that page should show and error alert

export const App = createBrowserRouter(
	createRoutesFromElements(
		<Route
			element={<AuthLayout />}
			errorElement={
				<GeneralAlert description="Something went wrong!" status="error" />
			}
		>
       <Route path='*' element={<NotFound />} />

			<Route element={<HomeLayout />}>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
			</Route>

			<Route path="/my">
				<Route path="manager" element={<ManagerLayout />}>
					<Route index path="dashboard" element={<DashboardPage />} />
					<Route path="all" caseSensitive element={<AllBookmarksPage />} />
					<Route path=":id" caseSensitive element={<CollectionPage />} />
				</Route>
				{/* <Route path="/settings" element={<SettingsPage />} /> */}
				{/*	<Route path="/profile" element={<ProfilePage />} /> */}
				{/* <Route path="/admin" element={<ProtectedAdminLayout />}>
				</Route> */}
			</Route>
		</Route>
	)
);

export default App;

// Clean up on module reload (HMR)
// https://vitejs.dev/guide/api-hmr
if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		App.dispose();
	});
}
