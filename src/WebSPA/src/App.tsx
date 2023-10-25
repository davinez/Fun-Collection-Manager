import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";
// Layouts and Auth
import AuthLayout from "@/components/layout/AuthLayout/AuthLayout";
import { getUserDataLoader } from "components/layout/AuthLayout/AuthLayout.loader";
import HomeLayout from "components/layout/HomeLayout";
import ProtectedLayout from "components/layout/ProtectedLayout";
// Pages
import HomePage from "@/routes/HomePage";
import LoginPage from "@/routes/LoginPage";
import SignupPage from "@/routes/SignupPage";
import GeneralAlertComponent from "components/ui/alert/GeneralAlertComponent";

export const router = createBrowserRouter(
	createRoutesFromElements(
      <Route
      element={<AuthLayout />}
      loader={getUserDataLoader}
      errorElement={<GeneralAlertComponent description="Something went wrong!" status="error" />}
    >
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      <Route path="/my" element={<ProtectedLayout />}>
       {/* <Route path="/manager/dashboard" element={<ManagerDashboardPage />} /> */}
       {/*<Route path="/settings/dashboard" element={<SettingsDashboardPage />} /> */}
       {/* <Route path="profile" element={<SettingsProfilePage />} /> */}
      </Route>

      </Route>

	)
);

export default router;

// Clean up on module reload (HMR)
// https://vitejs.dev/guide/api-hmr
if (import.meta.hot) {
  import.meta.hot.dispose(() => { router.dispose(); });
}
