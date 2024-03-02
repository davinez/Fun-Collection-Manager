import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/api/query-client";

// styles
import "shared/styles/styles.css";

// fonts
// import "@fontsource/plus-jakarta-sans/latin.css";

// Custom Theme
import customChakraUITheme from "shared/styles/theme/index";

import router from "@/App.tsx";

const rootElement = document.querySelector("#root") as Element;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<ChakraProvider theme={customChakraUITheme}>
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
				</QueryClientProvider>
			</ChakraProvider>
		</React.StrictMode>
	);
}
