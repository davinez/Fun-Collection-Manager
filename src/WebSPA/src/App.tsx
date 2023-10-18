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
		<Route
			element={<AppLayout />}
			//	loader={(): any => defer({ userPromise: getUserData() })}
		>
			<Route path="/" element={<TicTacToe />} />
		</Route>
	)
);

export default App;
