import { useContext } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../../Context/AuthContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useContext(authContext);

  // no token => not logged in=>send the user to the login page
  if (token === null) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;