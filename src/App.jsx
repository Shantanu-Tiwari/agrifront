import {Routes, Route, useLocation, Navigate} from "react-router-dom";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import { useState, useEffect } from "react";
import Analyze from "./pages/Analyze.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
    const location = useLocation();
    const noSidebarRoutes = ["/login", "/signup"];
    const showSidebar = !noSidebarRoutes.includes(location.pathname);
    const [sidebarWidth, setSidebarWidth] = useState(256); // Default open width
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication on component mount and when location changes
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(token && token.trim() !== "" && token !== "undefined");
    }, [location]);

    // Set page title based on current route
    const getPageTitle = () => {
        switch (location.pathname) {
            case "/dashboard":
                return "Dashboard";
            case "/analyze":
                return "Analyze";
            case "/experts":
                return "Expert Advice";
            case "/login":
                return "Login";
            case "/signup":
                return "Sign Up";
            default:
                return "Plant Health App";
        }
    };

    return (
        <div className="flex min-h-screen">
            {showSidebar && <Sidebar onWidthChange={(width) => setSidebarWidth(width)} />}

            <div
                className="flex flex-col flex-grow transition-all duration-300"
                style={{ marginLeft: showSidebar ? `${sidebarWidth}px` : '0' }}
            >

                {showSidebar && <Header title={getPageTitle()} />}

                <main className="flex-grow">
                    <Routes>
                        {/* Public routes */}
                        <Route path="signup" element={<Signup />} />
                        <Route path="login" element={<Login />} />

                        {/* Protected routes */}
                        <Route element={<ProtectedRoute/>}>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="analyze" element={<Analyze />} />
                        </Route>

                        {/* Redirect root path */}
                        <Route path="/" element={
                            isAuthenticated ?
                                <Navigate to="/dashboard" /> :
                                <Navigate to="/login" />
                        } />

                        {/* Catch all other routes */}
                        <Route path="*" element={
                            isAuthenticated ?
                                <Navigate to="/dashboard" /> :
                                <Navigate to="/login" />
                        } />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;