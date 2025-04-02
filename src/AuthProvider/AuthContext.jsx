import {createContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser && storedUser !== "undefined") {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error parsing stored user data:", error);
            setUser(null);
            localStorage.removeItem("user"); // Clean up invalid data
        }
    }, []);

    const signup = async (name, email, password) => {
        try {
            const { data } = await axios.post("http://localhost:5000/auth/signup", {
                name,
                email,
                password,
            });

            if (data && data.user) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);
                navigate("/dashboard");
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
            const { data } = await axios.post("http://localhost:5000/auth/login", {
                email,
                password,
            });

            if (data && data.user) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);
                navigate("/dashboard");
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
        localStorage.removeItem("user");
        localStorage.removeItem("token"); // Also remove token
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{user, signup, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;