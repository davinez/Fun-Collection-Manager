// Example
import { TicTacToe } from "components/ui/examples/index";
// import PRODUCTS from "../data/mock/products.json";

import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";
// import { LoginPage } from "./pages/Login";
// import { HomePage } from "./pages/Home";
// import { ProfilePage } from "./pages/Profile";
// import { SettingsPage } from "./pages/Settings";
import AppLayout from "components/layout/AppLayout";
import HomeLayout from "components/layout/HomeLayout";
import Home from "@/routes/Home";

// ideally this would be an API call to server to get logged in user data

// const getUserData = () =>
// 	new Promise((resolve) =>
// 		setTimeout(() => {
// 			const user = window.localStorage.getItem("user");
// 			resolve(user);
// 		}, 3000)
// 	);

// for error
// const getUserData = () =>
//   new Promise((resolve, reject) =>
//     setTimeout(() => {
//       reject("Error");
//     }, 3000)
//   );

export const App = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route element={<AppLayout />}>
				<Route path="/App" element={<TicTacToe />} />
			</Route>
			<Route element={<HomeLayout />}>
				<Route path="/Home" element={<Home />} />
			</Route>
		</>
	)
);

export default App;
