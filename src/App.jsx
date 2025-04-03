import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useContext } from "react";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import Analyze from "./pages/Analyze.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AuthContext from "./AuthProvider/AuthContext";

function App() {
    const location = useLocation();
    const { isAuthenticated } = useContext(AuthContext); // ✅ Use AuthContext globally
    const noSidebarRoutes = ["/login", "/signup"];
    const showSidebar = !noSidebarRoutes.includes(location.pathname);

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
        <div className="flex min-h-screen bg-gray-50">
            {showSidebar && (
                <div className="w-64 fixed inset-y-0 left-0 z-30 bg-white shadow-lg">
                    <Sidebar />
                </div>
            )}

            <div className={`flex flex-col flex-grow transition-all duration-300 ${showSidebar ? 'ml-64' : ''}`}>
                {showSidebar && (
                    <div className="sticky top-0 z-20 bg-white shadow-sm">
                        <Header title={getPageTitle()} />
                    </div>
                )}

                <main className="flex-grow p-6 pt-4">
                    <Routes>
                        {/* Public routes */}
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />

                        {/* Protected routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/analyze" element={<Analyze />} />
                        </Route>

                        {/* Redirect based on auth state */}
                        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
                        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;