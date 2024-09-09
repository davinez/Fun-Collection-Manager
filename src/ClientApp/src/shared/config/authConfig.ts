import { LogLevel, Configuration, PopupRequest } from '@azure/msal-browser';

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */
// store Azure AD settings and export them as constants
export const msalConfig: Configuration = {
    auth: {
        clientId: import.meta.env.VITE_ENTRA_CLIENTID, // This is the ONLY mandatory field that you need to supply.
        authority: import.meta.env.VITE_ENTRA_AUTHORITY,
        // https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md#redirecturi-considerations
        redirectUri: window.location.origin + '/blank.html', // Points to window.location.origin. You must register this URI on Azure Portal/App Registration.
        postLogoutRedirectUri: window.location.origin + '/blank.html', // Indicates the page to navigate after logout.
        navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
    },
    cache: {
        cacheLocation: 'localStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            logLevel: import.meta.env.PROD ? LogLevel.Warning : LogLevel.Info,
            loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            }
        }
    },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest: PopupRequest = {
    scopes: ["email", "openid", "profile"],
    // Prevents Single sign-on
    //  prompt: "select_account" // https://learn.microsoft.com/en-us/entra/identity-platform/msal-js-prompt-behavior
};

/**
We can request multiple scopes for the same resource (e.g. User.Read, User.Write and Calendar.Read for MS Graph API).
In case you erroneously pass multiple resources in your token request, the token you will receive will only be issued for the first resource.

// you will only receive a token for MS GRAPH API's "User.Read" scope here
const myToken = await msalInstance.acquireTokenSilent({
     scopes: [ "User.Read", "api://<myCustomApiClientId>/My.Scope" ]
});

Access Token requests in MSAL.js are meant to be per-resource-per-scope(s). 

More: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const managerAPIRequest = {
    scopes: [
        `api://${import.meta.env.VITE_ENTRA_CLIENTID_MANAGER}/Manager.Read`,
        `api://${import.meta.env.VITE_ENTRA_CLIENTID_MANAGER}/Manager.Write`
    ]
};

/**
 * An optional silentRequest object can be used to achieve silent SSO
 * between applications by providing a "login_hint" property.
 */
export const silentRequest = {
    scopes: ["openid", "profile"],
    loginHint: "example@domain.net",
};

// Add here the endpoints for MS Graph API services you would like to use.
// export const graphConfig = {
//     graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
// };
