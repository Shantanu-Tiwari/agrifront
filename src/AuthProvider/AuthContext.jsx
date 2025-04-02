import { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        console.log("Auth Initialization - Path:", location.pathname, "Token:", token);

        if (token && token !== "undefined" && token !== "null" && storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            setUser(null);
            setIsAuthenticated(false);
            delete axios.defaults.headers.common["Authorization"];

            // 🚀 Prevent redirecting if already on login or signup
            if (!["/login", "/signup"].includes(location.pathname)) {
                navigate("/login", { replace: true });
            }
        }
    }, [navigate, location.pathname]);

    const signup = async (name, email, password) => {
        try {
            const { data } = await axios.post("https://agriback-mj37.onrender.com/auth/signup", {
                name,
                email,
                password,
            });

            if (data && data.user && data.token) {
                setUser(data.user);
                setIsAuthenticated(true);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);
                axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

                console.log("Signup successful - Navigating to /dashboard");
                navigate("/dashboard");
                return { success: true };
            }
        } catch (error) {
            console.error("Signup error:", error.response?.data?.error || "Connection error");
            return error.response?.data || { error: "Connection error. Please try again." };
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await axios.post("https://agriback-mj37.onrender.com/auth/login", {
                email,
                password,
            });

            if (data?.user && data?.token) {
                console.log("Login successful - Token:", data.token);

                // ✅ Store token and user
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                // ✅ Update state
                setUser(data.user);
                setIsAuthenticated(true);

                // ✅ Set axios default header
                axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

                // ✅ Redirect to dashboard
                navigate("/dashboard");

                return { success: true };
            } else {
                console.error("Login failed: No token received");
                return { error: "Invalid login credentials." };
            }
        } catch (error) {
            console.error("Login error:", error.response?.data?.error || error);
            return { error: "Login failed. Please try again." };
        }
    };



    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        navigate("/login", { replace: true });
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
