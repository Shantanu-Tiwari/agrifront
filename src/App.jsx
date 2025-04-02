import { Routes, Route, useLocation } from "react-router-dom";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import { useState } from "react";
import Analyze from "./pages/Analyze.jsx";

function App() {
    const location = useLocation();
    const noSidebarRoutes = ["/login", "/signup"];
    const showSidebar = !noSidebarRoutes.includes(location.pathname);
    const [sidebarWidth, setSidebarWidth] = useState(256); // Default open width

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
            {/* Sidebar on the left */}
            {showSidebar && <Sidebar onWidthChange={(width) => setSidebarWidth(width)} />}

            {/* Content container (includes header and main content) */}
            <div
                className="flex flex-col flex-grow transition-all duration-300"
                style={{ marginLeft: showSidebar ? `${sidebarWidth}px` : '0' }}
            >
                {/* Header at top of content area */}
                {showSidebar && <Header title={getPageTitle()} />}

                {/* Main content area */}
                <main className="flex-grow">
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/analyze" element={<Analyze />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;