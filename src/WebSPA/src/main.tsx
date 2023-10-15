import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";

// styles
// import "@/styles/test-styles.css";

// fonts
//import "@fontsource/plus-jakarta-sans/latin.css";

// Custom Theme
import { theme } from "shared/styles/theme/index";

import { App } from "@/App.tsx";

const rootElement = document.querySelector("#root") as Element;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<ChakraProvider theme={theme}>
				<App />
			</ChakraProvider>
		</React.StrictMode>
	);
}
