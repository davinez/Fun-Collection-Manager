// General
import React from "react";
import ReactDOM from "react-dom/client";
// React Query
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/api/query-client";
// styles / Custom Theme
import "shared/styles/styles.css";
import customChakraUITheme from "shared/styles/theme/index";
import { ChakraProvider } from "@chakra-ui/react";
// import "@fontsource/plus-jakarta-sans/latin.css"; // fonts

// Authentication
import { msalConfig } from "shared/config";
import { 
	PublicClientApplication, 
	EventType, 
	EventMessage, 
	AuthenticationResult
} from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
// Router / App
import { RouterProvider } from "react-router-dom";
import App from "@/App.tsx";


const msalInstance = new PublicClientApplication(msalConfig);

 // Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
	// Account selection logic is app dependent. Adjust as needed for different use cases.
	const account = msalInstance.getAllAccounts()[0]
	msalInstance.setActiveAccount(account === undefined ? null : account);
}

//set the account
msalInstance.addEventCallback((event: EventMessage) => {
	if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
			const authenticationResult = event.payload as AuthenticationResult;
			const account = authenticationResult.account;
			msalInstance.setActiveAccount(account);
	}
});

const rootElement = document.querySelector("#root") as Element;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<MsalProvider instance={msalInstance}>
				<ChakraProvider theme={customChakraUITheme}>
					<QueryClientProvider client={queryClient}>
						<RouterProvider router={App} />
					</QueryClientProvider>
				</ChakraProvider>
			</MsalProvider>
		</React.StrictMode>
	);
}
