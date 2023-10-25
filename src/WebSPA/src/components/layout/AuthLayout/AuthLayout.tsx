// import { Navigate } from "react-router-dom";

// type PrivateRouteProps = {
//   children: React.ReactNode;
//   redirectTo?: string;
// };

// export default function RequireAuth({
//   children,
//   redirectTo = "/login",
// }: PrivateRouteProps): React.ReactElement {
//   // add your own authentication logic here
//   const isAuthenticated = true;

//   return isAuthenticated ? (
//     (children as React.ReactElement)
//   ) : (
//     <Navigate to={redirectTo} />
//   );
// };

import { Suspense } from "react";
import { useLoaderData, useOutlet } from "react-router-dom";
import { CircularProgress } from "@chakra-ui/react";
//
//import { useLocalStorage } from "./useLocalStorage";

export default function AuthLayout(): React.ReactElement {
  const outlet = useOutlet();

  const userData = useLoaderData();

  return (
    <Suspense fallback={<CircularProgress isIndeterminate color='green.300'/>}>
      {outlet}
    </Suspense>
  );
};


// Loader => https://github.com/infoxicator/react-router-defer-fetch/blob/main/src/main.jsx
// Zustand => https://doichevkostia.dev/blog/authentication-store-with-zustand/



// const AuthContext = createContext();

// export const AuthProvider = ({ children, userData }) => {
//   const [user, setUser] = useLocalStorage("user", userData);
//   const navigate = useNavigate();

//   const login = async (data) => {
//     setUser(data);
//     navigate("/dashboard/profile", { replace: true });
//   };

//   const logout = () => {
//     setUser(null);
//     navigate("/", { replace: true });
//   };

//   const value = useMemo(
//     () => ({
//       user,
//       login,
//       logout
//     }),
//     [user]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };


