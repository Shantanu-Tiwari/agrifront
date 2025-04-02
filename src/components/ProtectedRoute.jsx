import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    // Check if there's a valid token in localStorage
    const token = localStorage.getItem("token");

    // Add validation for the token to ensure it's not just empty or malformed
    const isValidToken = token && token.trim() !== "" && token !== "undefined";

    // Only redirect to login if the token is invalid or missing
    return isValidToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;