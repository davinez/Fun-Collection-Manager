import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

// styles
import "shared/styles/styles.css";

// fonts
// import "@fontsource/plus-jakarta-sans/latin.css";

// Custom Theme
import { customChakraUITheme } from "shared/styles/theme/index";

import App from "@/App.tsx";

const rootElement = document.querySelector("#root") as Element;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<ChakraProvider theme={customChakraUITheme}>
				<RouterProvider router={App} />
			</ChakraProvider>
		</React.StrictMode>
	);
}
