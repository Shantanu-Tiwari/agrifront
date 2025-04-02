import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../AuthProvider/AuthContext"; // Adjust the import path as needed

const ProtectedRoute = () => {
    const { isAuthenticated } = useContext(AuthContext);

    console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
    console.log("ProtectedRoute - Current path:", window.location.pathname);

    // Use the authentication state from context
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;