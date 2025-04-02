import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../AuthProvider/AuthContext";

const ProtectedRoute = () => {
    const { isAuthenticated, user } = useContext(AuthContext);

    console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
    console.log("ProtectedRoute - Current path:", window.location.pathname);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Prevents instant redirect
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
