import {createContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check both token and user on initial load
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        console.log("Auth initialization - Token:", token);
        console.log("Auth initialization - User:", storedUser);

        try {
            if (token && token !== "undefined" && token !== "null" &&
                storedUser && storedUser !== "undefined") {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);

                // Set up axios with the auth token for all subsequent requests
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            } else {
                setUser(null);
                setIsAuthenticated(false);
                delete axios.defaults.headers.common["Authorization"];

                // Only navigate to login if we're not already there and not signing up
                const currentPath = window.location.pathname;
                if (currentPath !== "/login" && currentPath !== "/signup" && currentPath !== "/") {
                    navigate("/login");
                }
            }
        } catch (error) {
            console.error("Error initializing auth:", error);
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
            navigate("/login");
        }
    }, [navigate]);

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

                // Set Authorization header for future requests
                axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

                console.log("Signup successful - Token set:", data.token);
                navigate("/dashboard");
                return { success: true };
            }
        } catch (error) {
            if(error.response){
                console.error("Signup error:", error.response.data.error);
                return error.response.data; // Return error for handling in component
            } else {
                console.error("Signup error:", error);
                return { error: "Connection error. Please try again." };
            }
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await axios.post("https://agriback-mj37.onrender.com/auth/login", {
                email,
                password,
            });

            if (data && data.user && data.token) {
                setUser(data.user);
                setIsAuthenticated(true);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);

                // Set Authorization header for future requests
                axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

                console.log("Login successful - Token set:", data.token);
                navigate("/dashboard");
                return { success: true };
            }
        } catch (error) {
            if(error.response){
                console.error("Login error:", error.response.data.error);
                return error.response.data; // Return error for handling in component
            } else {
                console.error("Login error:", error);
                return { error: "Connection error. Please try again." };
            }
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{user, isAuthenticated, signup, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;