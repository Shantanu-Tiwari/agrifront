import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login.jsx";
import Sidebar, { SidebarContext } from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import Analyze from "./pages/Analyze.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AuthContext from "./AuthProvider/AuthContext";
import ExpertsPage from "./pages/ExpertsPage.jsx";
function App() {
    const location = useLocation();
    const { isAuthenticated } = useContext(AuthContext);
    const noSidebarRoutes = ["/login", "/signup"];
    const showSidebar = !noSidebarRoutes.includes(location.pathname);

    // Sidebar state for the context
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

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
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
            <div className="flex min-h-screen bg-gray-50">
                {showSidebar && <Sidebar />}

                <div
                    className={`flex flex-col flex-grow transition-all duration-300 
                    ${showSidebar ? (isSidebarOpen ? 'ml-64' : 'ml-20') : ''}`}
                >
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
                                <Route path="/experts" element={<ExpertsPage />} />
                            </Route>

                            {/* Redirect based on auth state */}
                            <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
                            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </SidebarContext.Provider>
    );
}

export default App;