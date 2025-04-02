import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../AuthProvider/AuthContext"; // Adjust the path as needed

const ProtectedRoute = () => {
    const { isAuthenticated, user } = useContext(AuthContext);

    console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
    console.log("ProtectedRoute - Current path:", window.location.pathname);

    // If authentication status is still being determined, don't render anything yet
    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Prevents unnecessary redirects
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
